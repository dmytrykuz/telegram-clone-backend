import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
  email: string;
  fullname: string;
  password: string;
  confirmed: boolean;
  avatar: string;
  confirm_hash: string;
  last_seen: Date;
};

const UserScheme = new Schema(
  {
    email: {
      type: String,
      required: "Email address is required",
      validate: [validator.isEmail, "Invalid email"],
      index: {
        unique: true,
        dropDups: true,
      },
    },
    fullname: {
      type: String,
      required: "Fullname is required",
    },
    password: {
      type: String,
      required: "Password is required",
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    avatar: String,
    confirm_hash: String,
    last_seen: Date,
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("UserModel", UserScheme);

export default UserModel;
