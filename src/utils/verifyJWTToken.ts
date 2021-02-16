import jwt from "jsonwebtoken";
import { IUser } from "../models/User";


export interface DecodedData {
  data: {
    _doc: IUser;
  };
}

export default (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET || "",
      (err, decodeData) => {
        if (err || !decodeData) {
          return reject(err);
        }
        return resolve(decodeData);
      });
  });
}