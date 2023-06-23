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

  return { setBox, getBox, emptyBoxes, isEmpty, restart };
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
    display.updateBoard();
  }
  function computerPlay() {
    posiblesJugadas = gameBoard.emptyBoxes();
    if (posiblesJugadas.length === 0) {
      console.log("No hay mas casillas libres");
    }
    gameBoard.setBox(
      posiblesJugadas[Math.floor(Math.random() * posiblesJugadas.length)],
      computer.marker
    );
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
