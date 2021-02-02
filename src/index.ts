import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import { UserModel } from "./schemes";
import { UserController } from "./controllers";

const app = express();

app.use(bodyParser.json());

const User = new UserController();

mongoose.connect("mongodb://localhost:27017/chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.get("/user/:id", User.show);
app.post("/user/registration", User.create);
app.delete("/user/:id", User.delete);

app.listen(4000, () => {
  console.log("Example app listening on port 4000!");
});
