"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var bd_1 = require("./config/bd");
var https = require("https");
var fs = require("fs");
var path = require("path");
var porta = process.env.PORT || 3335;
https
    .createServer({
    cert: fs.readFileSync(path.join(__dirname, "SSL/certificate.crt")),
    key: fs.readFileSync(path.join(__dirname, "SSL/private.key")),
    ca: fs.readFileSync(path.join(__dirname, "SSL/ca_bundle.crt")),
}, app_1.app)
    .listen(3773, function () { return console.log("App HTTPS ouvindo na porta 3773"); });
var server = app_1.app.listen(porta, function () {
    bd_1.default();
    console.log("App ouvindo na porta " + porta);
});
process.on("SIGINT", function () {
    server.close();
    console.log("App finalizado");
});
