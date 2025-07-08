/*
Psuedo Code for Battleship Game
Create a grid for the game boards will be 10x10 for each player
Define player vaiarbles
Define game piece variables
Define empty space variable
Define a ships sunken variable
Define number of misses variable
Define a number of hits variable
Define a number of ships variable
Define a game over variable
Write an init() funciton
Write a render() function
Write a placeShip() function
Write a checkHit() function
Write a checkWin() function
Write a reset() function
Query the DOM for the game board
Add event listeners to the game board
Write a startGame() function
render hit and miss
Write a updateGameBoard() function

There are 2 10x10 grids, one for the player and one for the CPU
Players secretly place their ships on the grid
Each player has 5 ships of varying sizes (Aircraft Carrier, Battleship, Cruiser, Submarine, Destroyer)
Ship sizes: Aircraft Carrier (5), Battleship (4), Cruiser (3), Submarine (3), Destroyer (2)
Players take turns choosing coordinates on the grid to attack
Once each coordinate for a ship has been hit, the ship is considered sunk
The game continues until all ships of one player are sunk


Starting Condition
IF the game has not been started the game board will be empty
    THEN the player will be asked to place their ships on the board
    ELSE the game will start with the CPU placing their ships randomly on the board

Handling player and CPU choices
IF the playerChoice or cpuChoice hits a ship, update the game board with red where the hit occurred
    ELSE IF the playerChoice or cpuChoice is a miss, update the game board with black where the miss occurred
    ELSE a message will be displayed that the choice was invalid or already chosen prior

Game Over Condition
IF all of one players ships are sunk, display a message that the other player has won.
*/



/*-------------------------------- Constants --------------------------------*/



/*---------------------------- Variables (state) ----------------------------*/



/*------------------------ Cached Element References ------------------------*/

const gameBoard = document.querySelector('.game-board-container')
const playerBoard = document.querySelector('#players-ocean')
const opponentsBoard = document.querySelector('#opponents-ocean')
const displayMessage = document.querySelector('#game-message')

/*-------------------------------- Functions --------------------------------*/

const init = () => {

}
const render = () => {

}
const createBoard = (boardId) => {
    let gameBoard = [];
    const rows = 10;
    const coloum = 10;

    const boardContainer = document.getElementById(boardId)

    for (let i = 0; i < rows; i++) {
        gameBoard[i] = [];
        const rowElement = document.createElement('div')
        rowElement.classList.add('board-row')
     
         for (let j = 0; j < coloum; j++) {
            gameBoard[i][j] = '';
            const cellElement = document.createElement('div')
            cellElement.classList.add('board-cell')
            rowElement.appendChild(cellElement)
        }
        boardContainer.appendChild(rowElement);
    }
    return gameBoard;
}
const playersGameBoard = createBoard('players-ocean');
const opponentsGameBoard = createBoard('opponents-ocean');

/*----------------------------- Event Listeners -----------------------------*/



