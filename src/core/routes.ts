import express from "express";
import bodyParser from "body-parser";
import socket from "socket.io";
import { checkAuth, updateLastSeen } from "../middlewares";
import { loginValidation } from "../utils/validation";
import { DialogController, MessageController, UserController } from "../controllers";

const createRoutes = (app: express.Express, socket: socket.Server) => {
  app.use(bodyParser.json());
  app.use(updateLastSeen);
  app.use(checkAuth);

  app.get("/user/me", UserController.getMe);
  app.get("/user/:id", UserController.show);
  app.post("/user/registration", UserController.create);
  app.delete("/user/:id", UserController.delete);
  app.post("/user/login", loginValidation, UserController.login);

  app.get("/dialogs", DialogController.show);
  app.post("/dialogs", DialogController.create);
  app.delete("/dialogs/:id", DialogController.delete);

  app.get("/messages", MessageController.show);
  app.post("/messages", MessageController.create);
  app.delete("/messages", MessageController.delete);
}

export default createRoutes;