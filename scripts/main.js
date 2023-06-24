const gameBoard = (function gameBoard() {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  function setBox(number, value) {
    let line = Math.floor((number - 1) / 3);
    let column = (number - 1) % 3;
    board[line][column] = value;
  }
  function getBox(number) {
    let line = Math.floor((number - 1) / 3);
    let column = (number - 1) % 3;

    return board[line][column];
  }
  function isEmpty(number) {
    return getBox(number) === "";
  }
  function emptyBoxes() {
    let plano = board.flat();
    const emptyIndexes = plano.reduce((acc, currentValue, index) => {
      if (currentValue === "") {
        acc.push(index + 1);
      }
      return acc;
    }, []);

    return emptyIndexes;
  }
  function restart() {
    board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  }
  function checkWin() {
    // Verificar filas
    if (emptyBoxes().length === 0) {
      return "tie";
    }
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] !== "" &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        return board[i][0];
      }
    }
    // Verificar columnas
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] !== "" &&
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i]
      ) {
        return board[0][i];
      }
    }
    // Verificar diagonales
    if (
      board[0][0] !== "" &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return board[0][0];
    }
    if (
      board[0][2] !== "" &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return board[0][2];
    }
    // Si no hay ganador, devolver null
    return null;
  }

  return { setBox, getBox, emptyBoxes, isEmpty, restart, checkWin };
})();

const display = (function () {
  let board = document.querySelectorAll(".square > div");
  let messages = document.getElementById("ui-messages");
  function updateBoard() {
    for (let i = 1; i <= board.length; i++) {
      board[i - 1].innerHTML = gameBoard.getBox(i);
    }
    if (checkWin()) {
      updateMessage("Game Finished");
    }
  }
  function updateMessage(message) {
    messages.innerHTML = message;
  }
  function checkWin() {
    return gameBoard.checkWin();
  }

  return { updateBoard, board, updateMessage };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const GameController = (function () {
  const player = Player("Player 1", "X");
  const computer = Player("Computer", "O");
  let posiblesJugadas = [];
  let turnoJugador = true;
  let jugando = true;

  function play(element) {
    let casillaSelected = element.getAttribute("number");

    if (turnoJugador && gameBoard.isEmpty(casillaSelected)) {
      gameBoard.setBox(casillaSelected, player.marker);
      turnoJugador = false;
      computerPlay();
    } else {
      console.log("selecciona una casilla vacia");
    }
    if (gameBoard.checkWin()) {
      console.log(gameBoard.checkWin());
    }
    display.updateBoard();
  }
  function computerPlay() {
    // computerAI.minimax(gameBoard.board,computer.marker)
    posiblesJugadas = gameBoard.emptyBoxes();
    if (posiblesJugadas.length === 0) {
      console.log("No hay mas casillas libres");
      return "";
    }
    gameBoard.setBox(
      computerAI.minimax(computer.marker).index,
      computer.marker
    ); // Usar el índice devuelto por minimax
    if (gameBoard.checkWin()) {
      console.log(gameBoard.checkWin());
    }
    turnoJugador = true;
  }

  function restart() {
    gameBoard.restart();
    display.updateBoard();
    turnoJugador = true;
    display.updateMessage("Choose Wisely");
  }

  return { play, restart };
})();

display.board.forEach((el) =>
  el.addEventListener("click", (evento) => GameController.play(evento.target))
);
document.getElementById("restartBtn").addEventListener("click", () => {
  GameController.restart();
});

//Maximize is computer turn trying the best one
//Minimize is trying the best for the player
const computerAI = (function () {
  let puntajes = {
    X: -1,
    O: 1,
    tie: 0,
  };
  const playerMarker = "X";
  const computerMarker = "O";

  function minimax(marker) {
    let posiblesJugadas = gameBoard.emptyBoxes();

    if (gameBoard.checkWin()) {
      console.log(puntajes[gameBoard.checkWin()]);
      return { score: puntajes[gameBoard.checkWin()] }; // Devolver un objeto con un campo score
    }

    const allTestPlayInfos = [];

    for (let i = 0; i < posiblesJugadas.length; i++) {
      const currentTestPlayInfo = {};
      currentTestPlayInfo.index = posiblesJugadas[i]; // Guardar la posición de la casilla, no su valor
      gameBoard.setBox(posiblesJugadas[i], marker);
      if (marker === computerMarker) {
        const result = minimax(playerMarker);
        currentTestPlayInfo.score = result.score;
      } else {
        const result = minimax(computerMarker);
        currentTestPlayInfo.score = result.score;
      }
      console.log(gameBoard.emptyBoxes());
      gameBoard.setBox(posiblesJugadas[i], ""); // Restaurar la casilla a su estado anterior
      allTestPlayInfos.push(currentTestPlayInfo);
    }

    let bestTestPlay = null;
    if (marker === computerMarker) {
      let bestScore = -Infinity;
      for (let i = 0; i < allTestPlayInfos.length; i++) {
        if (allTestPlayInfos[i].score > bestScore) {
          bestScore = allTestPlayInfos[i].score;
          bestTestPlay = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < allTestPlayInfos.length; i++) {
        if (allTestPlayInfos[i].score < bestScore) {
          bestScore = allTestPlayInfos[i].score;
          bestTestPlay = i;
        }
      }
    }
    return allTestPlayInfos[bestTestPlay];
  }
  return { minimax };
})();
