import express from "express";
import { UserModel } from "../models";


export default (_: express.Request, __: express.Response, next: express.NextFunction) => {
  UserModel.findOneAndUpdate(
    { _id: "601da3c2c02b4a086c041fe1" },
    { fullnsme: "qwe", last_seen: new Date() },
    { new: true },
    () => {
    },
  );
  next();
}