const gameBoard = (function gameBoard() {
    const board = [['X', 'X', 'X'], ['X', 'X', 'X'], ['X', 'X', 'X']]
    function setBox(number, value) {
        let line = Math.floor((number - 1) / 3);
        let column = (number - 1) % 3;
        board[line][column] = value
    }
    function getBox(number) {
        let line = Math.floor((number - 1) / 3);
        let column = (number - 1) % 3;
        v
        return board[line][column]
    }
    return { setBox, getBox }
})()

const display = (function () {
    let board = document.querySelectorAll('.square > div')

    function updateBoard() {
        for (let i = 1; i <= board.length; i++) {


            board[i - 1].innerHTML = gameBoard.getBox(i)

        }
    }
    return { updateBoard }
})()

const Player = (name, marker) => {
    this.name = name
    this.marker = marker
}






