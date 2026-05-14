const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const {LireEtat, EcrireEtat } = require('./Etat_File')


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors : {origin: "*"} });

io.on("connection", (socket) => {
        console.log("client connected :", socket.id);
        const etat = LireEtat();
        socket.emit("Reponces", etat);

  socket.on("Message", (data) => {
        console.log("Message : ",data); 
        io.emit("Requetes", data);
  });
  

  socket.on("Donner", (data) => {
        EcrireEtat(data);
        io.emit("Etat", data);
  });

  socket.on("disconnect", () => {
        console.log("client disconnected :", socket.id);
  });

});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
        console.log("Server en écoute au port 3000");
});
