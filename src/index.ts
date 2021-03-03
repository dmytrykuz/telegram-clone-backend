import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";

import "./core/db";
import createRoutes from "./core/routes";
import createSocket from "./core/socket";
import cors from "cors";

const app = express();
app.use(cors());
const http = createServer(app);
const io = createSocket(http);

dotenv.config();

createRoutes(app, io);

http.listen(process.env.PORT, () => {
  console.log(`Server: http://localhost:${process.env.PORT}`);
});
