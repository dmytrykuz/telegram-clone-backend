import express from "express";
import { MessageModel } from "../models";


class MessageController {

  show(req: express.Request, res: express.Response) {
    const dialogId: string = req.query.dialog as string;

    MessageModel.find({ dialog: dialogId })
      .populate(["dialog"])
      .exec((err: any, messages: any) => {
        if (err) {
          return res.status(404).json({
            message: "Messages not found",
          });
        }
        return res.json(messages);
      });
  }

  create(req: express.Request, res: express.Response) {
    const userId = "601c385852971208308e20d4";

    const messageData = {
      text: req.body.text,
      dialog: req.body.dialog_id,
      user: userId,
    };

    const message = new MessageModel(messageData);

    message
      .save()
      .then((obj: any) => {
        return res.json(obj);
      })
      .catch((err: any) => {
        return res.json(err);
      });
  }

  delete(req: express.Request, res: express.Response) {
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
  }

}

export default MessageController;