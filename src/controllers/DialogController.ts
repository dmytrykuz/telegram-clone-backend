import express from "express";
import { DialogModel, MessageModel } from "../models";
import socket from "socket.io";

class DialogController {
  io: socket.Server;

  constructor(io: socket.Server) {
    this.io = io;
  }

  show = (req: express.Request, res: express.Response) => {
    const userId: string = req.user._id;

    DialogModel.find()
      .or([{ author: userId }, { partner: userId }])
      .populate(["author", "partner"])
      .populate({
        path: "lastMessage",
        populate: {
          path: "user",
        },
      })
      .exec(function (err: any, dialogs: any) {
        if (err) {
          return res.status(404).json({
            message: "Dialogs not found",
          });
        }
        return res.json(dialogs);
      });
  };

  create = (req: express.Request, res: express.Response) => {
    const dialogData = {
      author: req.user._id,
      partner: req.body.partner,
    };

    const dialog = new DialogModel(dialogData);

    dialog
      .save()
      .then((dialogObj: any) => {
        const message = new MessageModel({
          text: req.body.text,
          user: req.body.author,
          dialog: dialogObj._id,
        });

        message
          .save()
          .then(() => {
            dialogObj.lastMessage = message._id;
            dialogObj.save().then(() => {
              res.json(dialogObj);
              this.io.emit("SERVER:CREATE_DIALOG", {
                ...dialogData,
                dialog: dialogObj,
              });
            });
          })
          .catch((err) => {
            return res.json(err);
          });
      })
      .catch((err) => {
        return res.json(err);
      });
  };

  delete = (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;

    DialogModel.findOneAndDelete({ _id: id })
      .then((dialog: any) => {
        if (dialog) {
          return res.json({
            message: "Dialog deleted",
          });
        }
      })
      .catch(() => {
        return res.json({
          message: "Dialog not found",
        });
      });
  };
}

export default DialogController;
