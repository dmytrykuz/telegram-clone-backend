import { Server } from "socket.io";
import http from "http";


export default (http: http.Server) => {
  const io = new Server(http);

  io.on("connection", function (socket: any) {
    console.log("connected"); //connection test

  });

  return io;
}