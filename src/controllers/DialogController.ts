import express from "express";
import { DialogModel, MessageModel } from "../models";


class DialogController {

  show(req: express.Request, res: express.Response) {
    const authorId: string = req.query.id as string;

    DialogModel.findOne({ author: authorId })
      .populate(["author", "partner"])
      .exec(function (err: any, dialogs: any) {
        if (err) {
          return res.status(404).json({
            message: "Dialogs not found",
          });
        }
        return res.json(dialogs);
      });
  }

  create(req: express.Request, res: express.Response) {
    const dialogData = {
      author: req.body.author,
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
          .then((messageObj: any) => {
            return res.json({
              dialog: dialogObj,
              // message: messageObj,
            });
          })
          .catch(err => {
            return res.json(err);
          });
      })
      .catch(err => {
        return res.json(err);
      });
  }

  delete(req: express.Request, res: express.Response) {
    const id: string = req.params.id;

    DialogModel.findOneAndDelete({ _id: id })
      .then((dialog: any) => {
        if (dialog) {
          return res.json({
            message: "Dialog deleted",
          });
        }
      })
      .catch((err: any) => {
        return res.json({
          message: "Dialog not found",
        });
      });
  }

}

export default DialogController;
