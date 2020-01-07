export default function createKeyboardListener(document) {
  const state = {
    observers: [],
    playerId: null,
  };

  function registerPlayerId(playerId) {
    state.playerId = playerId;
  }

  function subscribe(observeFunction) {
    state.observers.push(observeFunction);

    const observerIndex = state.observers.length - 1;

    return () => {
      state.observers.splice(observerIndex, 1);
    };
  }

  function unsubscribeAll() {
    state.observers = [];
  }

  function unsubscribe(observerFunction) {
    const observerIndex = state.observers.findIndex(
      observer => observerFunction === observer,
    );
    state.observers.splice(observerIndex, 1);
  }

  function notifyAll(command) {
    state.observers.forEach(observeFunction => {
      observeFunction(command);
    });
  }

  function handleKeydown(event) {
    const keyPressed = event.key;

    const command = {
      playerId: state.playerId,
      keyPressed,
    };

    notifyAll(command);
  }

  document.addEventListener('keydown', handleKeydown);

  return {
    registerPlayerId,
    subscribe,
    unsubscribe,
    unsubscribeAll,
  };
}
