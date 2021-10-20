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


//SocketIO vem aqui
io.on("connection", function (client) {
    client.on("join", function(name){
      console.log("Joined: " + name);
      clients[client.id] = name;
      client.emit("update", "You have connected to the server.");
      client.broadcast.emit("update", name + " has joined the server.")
    });
  
    client.on("send", function(msg){
      console.log("Message: " + msg);
      client.broadcast.emit("chat", clients[client.id], msg);
    });
  
    client.on("disconnect", function(){
      console.log("Disconnect");
      io.emit("update", clients[client.id] + " has left the server.");
      delete clients[client.id];
    });
  });

http.listen(PORT, function(){
console.log('listening on port %s', PORT);
});