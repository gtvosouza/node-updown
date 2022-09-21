"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var bd_1 = require("./config/bd");
var porta = process.env.PORT || 3335;
var server = app_1.app.listen(porta, function () {
    bd_1.conectarNoBD();
    console.log("App ouvindo na porta " + porta);
});
process.on('SIGINT', function () {
    server.close();
    console.log('App finalizado');
});
