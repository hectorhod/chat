var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const path = require('path');
const PORT = 3000

var clients = {};

app.use(express.static(path.join(__dirname+'/assets')))
app.use('/jquery',express.static(path.join(__dirname+'/node_modules/jquery/dist')))
app.use('/socket.io-client',express.static(path.join(__dirname+'/node_modules/socket.io-client/dist')))

// Socket.io
io.on("connection", function (client) {
    client.on("join", function(name){
      console.log("Conectado: " + name);
      clients[client.id] = name;
      client.emit("update", "Você entrou na sala.");
      client.broadcast.emit("update", name + " entrou na sala.");
      io.emit("lista", clients);
    });
  
    client.on("send", function(msg){
      console.log("Message: " + msg);
      client.broadcast.emit("chat", clients[client.id], msg);
    });
  
    client.on("disconnect", function(){
      console.log("Desconectado");
      io.emit("update", clients[client.id] + " saiu da sala.");
      delete clients[client.id];
    });
  });

http.listen(PORT, function(){
console.log('Servidor rodando na porta %s', PORT);
});