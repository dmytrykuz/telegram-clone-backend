import { Server } from "socket.io";
import http from "http";

export default (http: http.Server) => {
  const io = new Server(http);
  return io;
};
