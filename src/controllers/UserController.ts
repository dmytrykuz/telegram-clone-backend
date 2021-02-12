import express from "express";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { UserModel } from "../models";
import { IUser } from "../models/User";
import { createJWTToken } from "../utils";
const socket = require("socket.io");

class UserController {

  // constructor() {
  //   socket.on("connection", function(socket: any) {
  //     //
  //   })
  // }

  show(req: express.Request, res: express.Response) {
    const id: string = req.params.id;

    UserModel.findById(id, (err: any, user: any) => {
      if (err) {
        return res.status(404).json({
          Message: "User not found",
        });
      }
      return res.json(user);
    });
  }

  getMe(req: express.Request, res: express.Response, socket: any) {
    const id: string = req.user._id;

    UserModel.findById(id, (err: any, user: any) => {
      if (err) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      return res.json(user);
    });
  }

  create(req: express.Request, res: express.Response) {
    const userData = {
      email: req.body.email,
      fullname: req.body.fullname,
      password: req.body.password,
    };

    const user = new UserModel(userData);
    user
      .save()
      .then((obj: any) => {
        res.json(obj);
      })
      .catch((err) => {
        res.json(err);
      });
  }

  delete(req: express.Request, res: express.Response) {
    const id: string = req.params.id;

    UserModel.findOneAndDelete({ _id: id })
      .then((user: any) => {
        res.json({
          message: `User ${ user.fullname } deleted`,
        });
      })
      .catch((err: any) => {
        res.status(404).json({
          message: "User not found",
        });
      });
  }

  login(req: express.Request, res: express.Response) {
    const loginData = {
      email: req.body.email,
      password: req.body.password,
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    UserModel.findOne({ email: loginData.email }, (err: any, user: IUser) => {
      if (err) {
        return res.status(404).json({
          Message: "User not found",
        });
      }

      if (bcrypt.compareSync(loginData.password, user.password)) {
        const token = createJWTToken(user);
        return res.json({
          status: "success",
          token,
        });
      } else {
        return res.json({
          status: "error",
          message: "Incorrect email or password",
        });
      }
    });
  }
}

export default UserController;
