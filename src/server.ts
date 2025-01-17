import { app } from "./app";
import conectarNoBD from "./config/bd";

const https = require("https");
const fs = require("fs");
const path = require("path");

const porta = process.env.PORT || 3335;

https
  .createServer(
    {
      cert: fs.readFileSync("/home/deploy/updown/src/SSL/certificate.crt"),
      key: fs.readFileSync("/home/deploy/updown/src/SSL/private.key"),
      ca: fs.readFileSync("/home/deploy/updown/src/SSL/ca_bundle.crt"),
    },
    app
  )
  .listen(3773, () => console.log("App HTTPS ouvindo na porta 3773"));

const server = app.listen(porta, () => {
  conectarNoBD();
  console.log(`App ouvindo na porta ${porta}`);
});

process.on("SIGINT", () => {
  server.close();
  console.log("App finalizado");
});
