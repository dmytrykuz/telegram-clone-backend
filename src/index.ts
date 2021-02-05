import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import { UserModel, DialogModel, MessageModel } from "./models";
import { UserController, DialogController, MessageController } from "./controllers";


const app = express();

app.use(bodyParser.json());

const User = new UserController();
const Dialog = new DialogController();
const Message = new MessageController();

mongoose.connect("mongodb://localhost:27017/chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.get("/user/:id", User.show);
app.post("/user/registration", User.create);
app.delete("/user/:id", User.delete);

app.get("/dialogs", Dialog.show);
app.post("/dialogs", Dialog.create);
app.delete("/dialogs/:id", Dialog.delete);

app.get("/messages", Message.show);
app.post("/messages", Message.create);
app.delete("/messages", Message.delete);

app.listen(4000, () => {
  console.log("Example app listening on port 4000!");
});
