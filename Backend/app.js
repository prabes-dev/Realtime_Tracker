import express from "express";
import { Server } from "socket.io";
import http from "http";


const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket)=> {
  // Broadcast the location to all connected clients
  socket.on("location", (data) => {
    io.emit("receive-location", {id:socket.id, ...data}); 
  });
  // Notify all clients when a user disconnects
  socket.on("disconnect", () => {
      io.emit("user-disconnected", socket.id); 
  })
  console.log("Connected");
})


server.listen(PORT, () => {
  console.log(`Server is running on:  http://localhost:${PORT}`);
});
