const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const { LireEtat, EcrireEtat } = require("./Etat_File");

const app = express();
app.use(express.json({ limit: "1mb" }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  pingInterval: 25000,
  pingTimeout: 20000
});

const PORT = 8080;

app.get("/", (req, res) => {
  res.send("Serveur ESP OK");
});

function handleEspData(rawData) {
  let payload = rawData;
  console.log(rawData);
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (err) {
      console.log("Payload Socket.IO chaîne invalide :", rawData);
      return;
    }
  }

  if (!payload || typeof payload !== "object") {
    console.log("Payload Socket.IO invalide :", rawData);
    return;
  }

  console.log("Données ESP via Socket.IO :", JSON.stringify(payload));
  EcrireEtat(payload);
  //io.emit("Etat", payload);

  const control = {
    R_Snel: { Event: true, Temps: 10 },
    R_Battery: { Event: false, Temps: 2 },
    R_Group: { Event: false, Temps: 5 }
  };
/*
  socket.emit("control", control);
  console.log("Commande envoyée à l'ESP32 :", JSON.stringify(control));*/
}

io.on("connection", (socket) => {
  console.log("client connected :", socket.id);

  const etat = LireEtat();
  console.log("Etat initial chargé :", etat);

  socket.on("esp-data", (data) => {
    handleEspData(data);
    console.log(data);
  });

  socket.on("hello", (data) => {
    console.log("Message reçu :", data);
    io.emit("hello", data);
  });

  
  socket.on("capteurs", (data) => {
    handleEspData(data);
    console.log(data.volts.pin32, data.volts.pin34, data.volts.pin35);
    socket.emit("commande", { led: data.volts.pin32 > 2000 });
  });

  socket.on("disconnect", () => {
        console.log("client disconnected :", socket.id);
  });
        

});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
        console.log("Server en écoute au port 8080");
});
