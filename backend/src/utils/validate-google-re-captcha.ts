import { GOOGLE_RECAPTCHA_SECRET_KEY } from "../config";

const validateGoogleReCaptcha = async (token: string): Promise<boolean> => {
    const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${GOOGLE_RECAPTCHA_SECRET_KEY}&response=${token}`,
        {
            method: "POST",
        }
    );
    const data = await response.json();
    return data.success;
};

export default validateGoogleReCaptcha;