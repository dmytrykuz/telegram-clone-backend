import mongoose, { Schema, Document } from "mongoose";
import { IDialog } from "./Dialog";


export interface IMessage extends Document {
  text: string;
  dialog: IDialog | string;
  read: boolean;
}

const MessageScheme = new Schema({
    text: { type: String, require: Boolean },
    dialog: { type: Schema.Types.ObjectId, ref: "Dialog", require: true },
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const MessageModel = mongoose.model<IMessage>("Message", MessageScheme);

export default MessageModel;