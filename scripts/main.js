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
    console.log(emptyIndexes);
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
    return false;
  }

  return { setBox, getBox, emptyBoxes, isEmpty, restart, checkWin };
})();

const display = (function () {
  let board = document.querySelectorAll(".square > div");

  function updateBoard() {
    for (let i = 1; i <= board.length; i++) {
      board[i - 1].innerHTML = gameBoard.getBox(i);
    }
  }
  return { updateBoard, board };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const GameController = (function () {
  const player = Player("Player 1", "X");
  const computer = Player("Computer", "O");
  let posiblesJugadas = [];
  let turnoJugador = true;

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
    posiblesJugadas = gameBoard.emptyBoxes();
    if (posiblesJugadas.length === 0) {
      console.log("No hay mas casillas libres");
      return "";
    }
    gameBoard.setBox(
      posiblesJugadas[Math.floor(Math.random() * posiblesJugadas.length)],
      computer.marker
    );
    if (gameBoard.checkWin()) {
      console.log(gameBoard.checkWin());
    }
    turnoJugador = true;
  }
  function restart() {
    gameBoard.restart();
    display.updateBoard();
    turnoJugador = true;
  }

  return { play, restart };
})();

display.board.forEach((el) =>
  el.addEventListener("click", (evento) => GameController.play(evento.target))
);
document.getElementById("restartBtn").addEventListener("click", () => {
  GameController.restart();
});
