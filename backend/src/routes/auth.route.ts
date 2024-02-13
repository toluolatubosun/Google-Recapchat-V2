import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";

import { JWT_SECRET } from "../config";
import User from "../models/user.model";
import response from "../utils/response";
import CustomError from "../utils/custom-error";
import validateGoogleReCaptcha from "../utils/validate-google-re-captcha";

const router = Router();

router.post("/register", async (req, res) => {
    // Check if all fields are filled
    if (!req.body.name) throw new CustomError("name is required", 400);
    if (!req.body.email) throw new CustomError("email is required", 400);
    if (!req.body.password) throw new CustomError("password is required", 400);
    if (!req.body.googleReCaptchaToken) throw new CustomError("googleReCaptchaToken is required", 400);

    // Validate Google ReCaptcha
    const isHuman = await validateGoogleReCaptcha(req.body.googleReCaptchaToken);
    if (!isHuman) throw new CustomError("Google ReCaptcha validation failed", 400);

    const user = await User.findOne({ email: req.body.email });
    if (user) throw new CustomError("User already exists", 400);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create user
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        // NOTE :: You can create a user with role "admin" here
        role: req.body.role || "user",
    });

    // Save user to database
    const savedUser = await newUser.save();

    res.status(200).json(response("User created successfully", savedUser, true));
});

router.post("/login", async (req, res) => {
    // Check if all fields are filled
    if (!req.body.email) throw new CustomError("email is required", 400);
    if (!req.body.password) throw new CustomError("password is required", 400);

    // Get user from database
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new CustomError("User does not exist", 400);

    // Check if password is correct
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) throw new CustomError("Incorrect password", 400);

    // Create and assign token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);

    res.status(200).json(response("Login successful", { token, user }, true));
});

export default router;
