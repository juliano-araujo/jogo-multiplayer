// Define o player atual
const currentPlayerId = 'player1';

// Factory que cria instâncias do Game
export default function createGame() {
  // Estado dos jogadores e frutas
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10,
    },
  };

  const observers = [];

  function subscribe(observeFunction) {
    observers.push(observeFunction);
  }

  function notifyAll(command) {
    observers.forEach(observeFunction => {
      observeFunction(command);
    });
  }

  function addPlayer(command) {
    const { playerId, playerX, playerY } = command;

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };
  }

  function removePlayer(command) {
    const { playerId } = command;
    delete state.players[playerId];
  }

  function addFruit(command) {
    const { fruitId, fruitX, fruitY } = command;
    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };
  }

  function removeFruit(command) {
    const { fruitId } = command;
    delete state.fruits[fruitId];
  }

  // Função que movimenta os players
  function movePlayer(command) {
    const { playerId, keyPressed } = command;
    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y > 0) {
          player.y -= 1;
        }
      },
      ArrowDown(player) {
        if (player.y + 1 < state.screen.height) {
          player.y += 1;
        }
      },
      ArrowLeft(player) {
        if (player.x > 0) {
          player.x -= 1;
        }
      },
      ArrowRight(player) {
        if (player.x + 1 < state.screen.width) {
          player.x += 1;
        }
      },
    };

    const player = state.players[playerId];
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkForFruitCollision(playerId);
      notifyAll(command);
    }
  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
      console.log(`checking ${playerId} and ${fruitId}`);

      if (player.x === fruit.x && player.y === fruit.y) {
        console.log(`COLLISION between ${playerId} and ${fruitId}`);
        removeFruit({ fruitId });
      }
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  return {
    movePlayer,
    state,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    setState,
    subscribe,
    notifyAll,
  };
}
