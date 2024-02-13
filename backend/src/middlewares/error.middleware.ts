import response from "../utils/response";

// Possible error names
const errorNames = ["CastError", "JsonWebTokenError", "ValidationError", "SyntaxError", "MongooseError", "MongoError"];

import type { Application, Request, Response, NextFunction } from "express";

export default (app: Application) => {
    // Error Handler
    app.use((error: any, _: Request, res: Response, __: NextFunction) => {
        if (error.name == "CustomError") {
            res.status(error.status).send(response(error.message, null, false));
        } else if (error.name == "MongoError" && error.code == 11000) {
            // Catch duplicate key field error
            const field = Object.entries(error.keyValue)[0][0];
            res.status(400).send(response(`${field} already exists`, null, false));
        } else if (errorNames.includes(error.name)) {
            res.status(400).send(response(error.message, null, false));
        } else {
            res.status(500).send(response(error.message, null, false));
        }
    });

    return app;
};