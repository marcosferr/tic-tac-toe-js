const gameBoard = (function gameBoard() {
  const board = [
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

  return { setBox, getBox, emptyBoxes };
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
    if (turnoJugador) {
      gameBoard.setBox(element.getAttribute("number"), player.marker);
      turnoJugador = false;
      computerPlay();
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

  return { play };
})();

display.board.forEach((el) =>
  el.addEventListener("click", (evento) => GameController.play(evento.target))
);
