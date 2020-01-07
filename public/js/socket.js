import renderScreen from './render-screen.js';

export default function socket() {
  const socket = io();

  async function start() {
    socket.on('connect', () => {
      const playerId = socket.id;
      const screen = document.getElementById('screen');

      renderScreen(screen, game, requestAnimationFrame, playerId);
      console.log(`Player connected with id: ${playerId}`);
    });

    socket.on('add-player', command => {
      game.addPlayer(command);
    });

    socket.on('remove-player', command => {
      game.removePlayer(command);
    });

    socket.on('add-fruit', command => {
      game.addFruit(command);
    });

    socket.on('remove-fruit', command => {
      game.removeFruit(command);
    });

    socket.on('move-player', command => {
      const playerId = socket.id;

      if (command.playerId !== playerId) game.movePlayer(command);
    });

    socket.on('setup', state => {
      game.setState(state);
    });

    await (() => {
      return new Promise(resolve => {
        socket.on('connect', () => {
          resolve();
        });
      });
    })();
    return socket;
  }

  function on(event, callback) {
    socket.on(event, callback);
  }

  return {
    start,
    on,
  };
}
