import express from "express";
import { Server } from "socket.io";
import http from "http";


const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

server.listen(PORT, () => {
  console.log(`Server is running on:  http://localhost:${PORT}`);
});
