var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const path = require('path');
const PORT = 3002

var clients = {};

app.use(express.json())
app.use(express.static(path.join(__dirname+'/assets')))
app.use('/jquery',express.static(path.join(__dirname+'/node_modules/jquery/dist')))
app.use('/socket.io-client',express.static(path.join(__dirname+'/node_modules/socket.io-client/dist')))
app.set('views', path.join(__dirname, '/assets'));
app.set('view engine', 'ejs');
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "false");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization, x-acess-token"
  );
  next();
});

var username = ""

app.post('/', (req,res) => {
  username = req.body.username
  //console.log(username);
  res.status(200).json()
  //io.emit("join", username);
})

app.get('/', (req,res) => {
  res.render('index', {username})
})


// Socket.io
io.on("connection", function (client) {
    client.on("join", function(username){
      console.log("Conectado: " + username);
      clients[client.id] = username;
      client.emit("update", "Você entrou na sala.");
      client.broadcast.emit("update", username + " entrou na sala.");
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