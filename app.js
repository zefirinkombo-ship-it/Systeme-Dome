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
        
        const t = setInterval( () => {
                socket.emit("Requete", etat);
        }, 5000);

  socket.on("Message", (data) => {
        console.log("Message : ",data); 
        
  });
  

  socket.on("Donner", (data) => {
        EcrireEtat(data);
        io.emit("New_Requete", data);
  });

  socket.on("disconnect", () => {
        console.log("client disconnected :", socket.id);
  });

});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
        console.log("Server en écoute au port 3000");
});
