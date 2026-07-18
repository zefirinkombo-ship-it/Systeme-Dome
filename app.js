const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const {LireEtat, EcrireEtat } = require('./Etat_File')

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
        cors : {origin: "*"}, 
        connectionStateRecovery: {
                maxDisconnectionDuration: 2 * 60 * 1000,
                skipMiddlewares: true
        }
});

io.on("connection", (socket) => {
        console.log("client connected :", socket.id);
        const etat = LireEtat();
        socket.emit("Requete", etat);
        const Voltage = {
                BatV : 12,
                PanV : 11
        }

        socket.emit('Voltage', Voltage);
        
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
        console.log("Server en écoute au port 8080");
});
