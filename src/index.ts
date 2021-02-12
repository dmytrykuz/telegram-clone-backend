import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
// import socket from 'socket.io';
import "./core/db";
import createRoutes from "./core/routes";

const app = express();
const http = createServer(app);
const socket = require("socket.io")(http);

createRoutes(app, socket);
dotenv.config();

socket.on("connection", (socket: any) => {
  console.log("connected"); //connection test

  socket.emit("111", "Test message from server");

  socket.on("CLIENT:SEND_MESSAGE", function (obj: any) {
    console.log(obj.dialog_id);
  });

});

http.listen(process.env.PORT, () => {
  console.log(`Server: http://localhost:${ process.env.PORT }`);
});
