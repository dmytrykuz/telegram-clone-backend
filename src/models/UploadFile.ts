import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "./Message";
import { IUser } from "./User";

export interface IUploadFile extends Document {
  fileName: string;
  size: number;
  ext: string;
  url: string;
  message: IMessage | string;
  user: IUser | string;
}

export type IUploadFileDocument = Document & IUploadFile;

const UploadFileScheme = new Schema(
  {
    fileName: String,
    size: Number,
    ext: String,
    url: String,
    message: { type: Schema.Types.ObjectId, ref: "Message", require: true },
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
  },
  {
    timestamps: true,
  }
);

const UploadFileModel = mongoose.model<IUploadFile>(
  "UploadFile",
  UploadFileScheme
);

export default UploadFileModel;
