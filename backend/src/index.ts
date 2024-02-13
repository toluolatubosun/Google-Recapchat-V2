import "express-async-errors";

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import authRoute from "./routes/auth.route";
import errorMiddleware from "./middlewares/error.middleware";

import type { Request, Response } from "express";

const app = express();

mongoose
    .connect(process.env.DB_URI || "mongodb://127.0.0.1:27017/google-recaptcha-demo", {})
    .then((result) => app.listen(process.env.PORT || 4000))
    .then((result) => console.log(`Server is listening for requests @ localhost:${process.env.PORT || 4000}`))
    .catch((error) => console.log(error));

// Middleware
app.use(
    cors({
        origin: "*"
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hello World!");
});

// Route Middleware
app.use("/api/auth", authRoute);

// Error Handling Middleware
errorMiddleware(app);
