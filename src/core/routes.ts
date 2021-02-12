import express from "express";
import bodyParser from "body-parser";
import socket from "socket.io";
import { checkAuth, updateLastSeen } from "../middlewares";
import { loginValidation } from "../utils/validation";
import { DialogController, MessageController, UserController } from "../controllers";


const createRoutes = (app: express.Express, io: socket.Server) => {
  const User = new UserController(io);
  const Dialog = new DialogController(io);
  const Message = new MessageController(io);

  app.use(bodyParser.json());
  app.use(updateLastSeen);
  app.use(checkAuth);

  app.get("/user/me", User.getMe);
  app.get("/user/:id", User.show);
  app.post("/user/registration", User.create);
  app.delete("/user/:id", User.delete);
  app.post("/user/login", loginValidation, User.login);

  app.get("/dialogs", Dialog.show);
  app.post("/dialogs", Dialog.create);
  app.delete("/dialogs/:id", Dialog.delete);

  app.get("/messages", Message.show);
  app.post("/messages", Message.create);
  app.delete("/messages", Message.delete);
}

export default createRoutes;