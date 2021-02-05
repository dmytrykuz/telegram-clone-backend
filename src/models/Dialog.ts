import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IMessage } from "./Message";


export interface IDialog extends Document {
  author: IUser | string;
  partner: IUser | string;
  message: IMessage[];
  lastMessage: IMessage | string;
}

const DialogScheme = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    partner: { type: Schema.Types.ObjectId, ref: "User" },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  {
    timestamps: true,
  },
);

const DialogModel = mongoose.model<IDialog>("Dialog", DialogScheme);

export default DialogModel;
