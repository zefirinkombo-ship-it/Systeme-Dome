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
 // socket.emit("Etat", etat);

  socket.on("connect", () => {
    console.log("Socket connecté :", socket.id);
  });

  socket.on("esp-data", (data) => {
    let payload = data;

    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch (err) {
        console.warn("Payload Socket.IO chaîne invalide :", payload);
        return;
      }
    }

    if (!payload || typeof payload !== "object") {
      console.warn("Payload Socket.IO invalide :", data);
      return;
    }

    console.log("Données ESP via Socket.IO :", JSON.stringify(payload));
    EcrireEtat(payload);

    const control = {
      R_Snel: { Event: true, Temps: 10 },
      R_Battery: { Event: false, Temps: 0 },
      R_Group: { Event: false, Temps: 0 }
    };

   /* socket.emit("control", control);
    console.log("Commande envoyée à l'ESP32 :", JSON.stringify(control));*/
  });
  socket.on("capteurs", (data) => {
    handleEspData(data);
    console.log(data.volts.pin32, data.volts.pin34, data.volts.pin35);
    socket.emit("commande", { led: data.volts.pin32 > 2000 });
  });

  socket.on("hello", (data) => {
    console.log("Message reçu :", data);
    io.emit("hello", data);
  });

  socket.on("disconnect", () => {
        console.log("client disconnected :", socket.id);
  });
        

});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
        console.log("Server en écoute au port 8080");
});
