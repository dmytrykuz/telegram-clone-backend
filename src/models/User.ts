import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
import { generatePasswordHash } from "../utils";
import { differenceInMinutes, parseISO } from "date-fns";

export interface IUser extends Document {
  email: string;
  fullname: string;
  password: string;
  confirmed: boolean;
  avatar: string;
  confirm_hash: string;
  last_seen: Date;
  data?: IUser;
}

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
    last_seen: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

UserScheme.virtual("isOnline").get(function (this: any) {
  const newDate: any = new Date();
  console.log("New date = ", newDate);

  return differenceInMinutes(newDate, this.last_seen) < 5;
});

UserScheme.set("toJSON", {
  virtuals: true,
});

UserScheme.pre<IUser>("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  generatePasswordHash(user.password)
    .then((hash) => {
      user.password = String(hash);
      generatePasswordHash(new Date().toString()).then((confirmHash) => {
        user.confirm_hash = String(confirmHash);
        next();
      });
    })
    .catch((err) => {
      next(err);
    });
});

const UserModel = mongoose.model<IUser>("User", UserScheme);

export default UserModel;
