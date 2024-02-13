import mongoose from "mongoose";

interface IUser extends mongoose.Document {
    name: string;
    role: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ["user", "admin"]
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>("user", UserSchema);
