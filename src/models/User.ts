import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
import { generatePasswordHash } from "../utils";
import { differenceInMinutes } from "date-fns";

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
        // dropDups: true,
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
    avatar: {
      type: String,
      default: null
    },
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
  // console.log(differenceInMinutes(new Date(), this.last_seen));
  return differenceInMinutes(new Date(), this.last_seen) < 5;
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
      generatePasswordHash(new Date().toISOString()).then((confirmHash) => {
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
