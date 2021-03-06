import express from "express";
import { MessageModel, DialogModel } from "../models";
import socket from "socket.io";

class MessageController {
  io: socket.Server;

  constructor(io: socket.Server) {
    this.io = io;
  }

  updateReadedStatus = (
    res: express.Response,
    userId: string,
    dialogId: string
  ): void => {
    MessageModel.updateMany(
      { dialog: dialogId, user: { $ne: userId } },
      { $set: { readed: true } },
      {},
      (err: any): void => {
        if (err) {
          res.status(500).json({
            status: "error",
            message: err,
          });
        } else {
          this.io.emit("SERVER:MESSAGES_READED", {
            userId,
            dialogId,
          });
        }
      }
    );
  };

  show = (req: express.Request, res: express.Response) => {
    const dialogId: string = req.query.dialog as string;
    const userId: string = req.user._id as string;

    this.updateReadedStatus(res, userId, dialogId);

    MessageModel.find({ dialog: dialogId })
      .populate(["dialog", "user", "attachments"])
      .exec((err: any, messages: any) => {
        if (err) {
          return res.status(404).json({
            status: "error",
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
      attachments: req.body.attachments,
    };

    const message = new MessageModel(messageData);

    message
      .save()
      .then((obj: any) => {
        obj.populate(["dialog", "user", "attachments"], (err: any, message: any) => {
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
    const userId: string = req.user._id;

    MessageModel.findById(id, (err: any, message: any) => {
      if (err || !message) {
        return res.status(404).json({
          status: "error",
          message: "Message not found",
        });
      }

      if (message.user.toString() === userId) {
        message.remove();

        const dialogId = message.dialog;
        MessageModel.findOne(
          { dialog: dialogId },
          {},
          { sort: { created_at: -1 } },
          (err, lastMessage) => {
            if (err) {
              res.status(500).json({
                status: "error",
                message: err,
              });
            }
            DialogModel.findById(dialogId, (err: any, dialog: any) => {
              if (err) {
                return res.status(500).json({
                  status: "error",
                  message: err,
                });
              }

              dialog.lastMessage = lastMessage;
              dialog.save();
            });
          }
        );

        return res.json({
          status: "success",
          message: "Message deleted",
        });
      } else {
        return res.status(404).json({
          status: "error",
          message: "Not have permission",
        });
      }
    });
  };
}

export default MessageController;
