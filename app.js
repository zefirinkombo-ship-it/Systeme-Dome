const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors : {origin: "*"} });

io.on("connection", (socket) => {

      console.log("client connected :", socket.id);

  socket.on("hello", (data) => {

      console.log("Message : ",data); 
    io.emit("hello", data);
  });

  socket.on("disconnect", () => {
      console.log("client disconnected :", socket.id);
  });

});

httpServer.listen(3000, () => {
    console.log("Server en écoute au port 3000");
});