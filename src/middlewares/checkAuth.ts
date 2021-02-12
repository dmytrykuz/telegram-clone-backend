import express from "express";
import { verifyJWTToken } from "../utils";
import { IUser } from "../models/User";


export default (req: any, res: express.Response, next: express.NextFunction) => {

  if(req.path === "/user/login" || req.path === "/user/registration") {
    return next();
  }

  const token = req.headers.token;

  verifyJWTToken(token)
    .then((user: any) => {
      if(user) {
        req.user = user.data._doc;
      }
      next();
    }).catch(() => {
      res.status(403).json({
      message: "Invalid auth token provided.",
    });
  });
}