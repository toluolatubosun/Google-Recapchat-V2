export const APP_NAME = "google-recaptcha-demo";
export const JWT_SECRET = process.env.JWT_SECRET || "demo-secret";
export const GOOGLE_RECAPTCHA_SECRET_KEY = process.env.GOOGLE_RECAPTCHA_SECRET_KEY || "demo-secret"
export const ROLE = {
    ADMIN: ["admin"],
    USER: ["user", "admin"]
};