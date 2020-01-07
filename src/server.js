const express = require('express');
const http = require('http');
const path = require('path');
const createGame = require('./game');
const io = require('socket.io');

const app = express();
const server = http.createServer(app);
const sockets = io(server);

app.use(express.static(path.resolve(__dirname, '..', 'public')));

const game = createGame();
game.start();
game.subscribe(command => {
  console.log(`> Emitting ${command.type}`);

  sockets.emit(command.type, command);
});

sockets.on('connection', socket => {
  console.log(`Player connected with id: ${socket.id}`);

  game.addPlayer({ playerId: socket.id });

  socket.emit('setup', game.state);

  socket.on('disconnect', () => {
    console.log(`Player ${socket.id} disconnected`);
    game.removePlayer({ playerId: socket.id });
  });

  socket.on('move-player', command => {
    command.playerId = socket.id;
    command.type = 'move-player';

    game.movePlayer(command);
    console.log(`Moving player ${command.playerId}`);
  });
});

server.listen(process.env.PORT || 3000);
