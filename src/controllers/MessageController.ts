import express from "express";
import { MessageModel, DialogModel } from "../models";
import socket from "socket.io";

class MessageController {
  io: socket.Server;

  constructor(io: socket.Server) {
    this.io = io;
  }

  show = (req: express.Request, res: express.Response) => {
    const dialogId: string = req.query.dialog as string;

    MessageModel.find({ dialog: dialogId })
      .populate(["dialog", "user"])
      .exec((err: any, messages: any) => {
        if (err) {
          return res.status(404).json({
            message: "Messages not found",
          });
        }
        return res.json(messages);
      });
  };

  create = (req: express.Request, res: express.Response) => {
    const userId: string = req.user._id;

    const messageData = {
      text: req.body.text,
      dialog: req.body.dialog_id,
      user: userId,
    };

    const message = new MessageModel(messageData);

    message
      .save()
      .then((obj: any) => {
        obj.populate(["dialog", "user"], (err: any, message: any) => {
          if (err) {
            return res.status(500).json({
              status: "error",
              message: err,
            });
          }

          DialogModel.findOneAndUpdate(
            { _id: messageData.dialog },
            { lastMessage: message._id },
            { upsert: true },
            (err: any) => {
              if (err) {
                return res.status(500).json({
                  status: "error",
                  message: err,
                });
              }
            }
          );

          res.json(message);
          this.io.emit("SERVER:ADD_MESSAGE", message);
        });
      })
      .catch((err: any) => {
        return res.json(err);
      });
  };

  delete = (req: express.Request, res: express.Response) => {
    const id: string = req.query.id as string;

    MessageModel.findOneAndDelete({ _id: id })
      .then((message: any) => {
        if (message) {
          return res.json({
            message: "Message deleted",
          });
        }
      })
      .catch((err: any) => {
        return res.json({
          message: "Message not found",
        });
      });
  };
}

export default MessageController;
