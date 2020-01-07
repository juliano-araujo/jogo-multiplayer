'use strict';

import createKeyboardListener from './keyboard-listener.js';
import createGame from './game.js';
import socketFactory from './socket.js';

const game = createGame();
const keyboardListener = createKeyboardListener(document);
const socket = socketFactory();

socket.start(game).then(socket => {
  keyboardListener.registerPlayerId(socket.id);
  keyboardListener.subscribe(game.movePlayer);

  game.subscribe(command => {
    socket.emit('move-player', command);
  });
});

socket.on('disconnect', () => {
  keyboardListener.unsubscribeAll();
});
