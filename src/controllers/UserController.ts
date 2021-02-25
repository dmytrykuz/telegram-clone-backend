import express from "express";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { UserModel } from "../models";
import { IUser } from "../models/User";
import { createJWTToken } from "../utils";
import socket from "socket.io";

class UserController {
  io: socket.Server;

  constructor(io: socket.Server) {
    this.io = io;
  }

  show = (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;

    UserModel.findById(id, (err: any, user: any) => {
      if (err) {
        return res.status(404).json({
          Message: "User not found",
        });
      }
      return res.json(user);
    });
  };

  getMe = (req: express.Request, res: express.Response, socket: any) => {
    const id: string = req.user._id;

    UserModel.findById(id, (err: any, user: any) => {
      if (err || !user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      console.log(user.isOnline);
      return res.json(user);
    });
  };

  create = (req: express.Request, res: express.Response) => {
    const userData = {
      email: req.body.email,
      fullname: req.body.fullname,
      password: req.body.password,
    };

    const errors = validationResult(req);

    const user = new UserModel(userData);
    user
      .save()
      .then((obj: any) => {
        res.json(obj);
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: err,
        });
      });
  };

  delete = (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;

    UserModel.findOneAndDelete({ _id: id })
      .then((user: any) => {
        res.json({
          message: `User ${user.fullname} deleted`,
        });
      })
      .catch((err: any) => {
        res.status(404).json({
          message: "User not found",
        });
      });
  };

  verify = (req: express.Request, res: express.Response) => {
    const hash = req.query.hash;

    if (!hash) {
      return res.status(422).json({ errors: "Invalid hash" });
    }

    UserModel.findOne(
      { confirm_hash: hash as string },
      (err: any, user: any) => {
        if (err || !user) {
          return res.status(404).json({
            status: "error",
            message: "Hash not found",
          });
        }

        user.confirmed = true;

        user.save((err: any) => {
          if (err) {
            return res.status(404).json({
              status: "error",
              message: err,
            });
          }
          return res.json({
            status: "success",
            message: "Аккаунт успішно підтверджений!",
          });
        });
      }
    );
  };

  login = (req: express.Request, res: express.Response) => {
    const loginData = {
      email: req.body.email,
      password: req.body.password,
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    UserModel.findOne({ email: loginData.email }, (err: any, user: IUser) => {
      if (err || !user) {
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
        return res.status(403).json({
          status: "error",
          message: "Incorrect email or password",
        });
      }
    });
  };
}

export default UserController;
