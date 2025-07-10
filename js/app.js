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
const shipsData = [
    { name: 'Aircraft Carrier', length: 5, hits: 0, sunk: false, locations: [], element: null },
    { name: 'Battleship', length: 4, hits: 0, sunk: false, locations: [], element: null },
    { name: 'Destroyer', length: 3, hits: 0, sunk: false, locations: [], element: null },
    { name: 'Dredger', length: 3, hits: 0, sunk: false, locations: [], element: null },
    { name: 'Fortress', length: 2, hits: 0, sunk: false, locations: [], element: null }
]

// const RowLetters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

/*---------------------------- Variables (state) ----------------------------*/

let currentPlayer = 'playerOne'; // Variable for current player
let currentShipBeingPlaced = null;
let currentShipLength = 0;
let isVertical = false;

/*------------------------ Cached Element References ------------------------*/

const gameBoard = document.querySelector('.game-board-container')
const playerOneOcean = document.querySelector('#player-one-ocean')
const playerTwoOcean = document.querySelector('#player-two-ocean')
const displayMessage = document.querySelector('#game-message')
const shipIcons = document.querySelectorAll('.ship-icon')
const playerOneShipYard = document.getElementById('player-one-ship-yard')
const playerOneRotateShipButton = document.querySelector('#player-one-rotate-ship-button')
const playerTwoRotateShipButton = document.querySelector('#player-two-rotate-ship-button')

/*-------------------------------- Functions --------------------------------*/
const createBoard = (boardId) => {
    let gameBoard = [];
    const rows = 10;
    const coloum = 10;

    const boardContainer = document.getElementById(boardId)
    boardContainer.innerHTML = '';

    const coloumHeader = document.createElement('div');
    coloumHeader.classList.add('board-row', 'header-row');

    const cornerCell = document.createElement('div');
    cornerCell.classList.add('board-cell', 'header-cell', 'corner-cell');
    coloumHeader.appendChild(cornerCell);

    for (let j = 0; j < coloum; j++) {
        const headerCell = document.createElement('div')
        headerCell.classList.add('board-cell', 'header-cell', 'column-header')
        headerCell.textContent = j + 1
        coloumHeader.appendChild(headerCell)
    }
    boardContainer.appendChild(coloumHeader)

    for (let i = 0; i < rows; i++) {
        gameBoard[i] = []; //creates an array of 10 arrays
        const rowElement = document.createElement('div')
        rowElement.classList.add('board-row')

        const rowLetters = String.fromCharCode(65 + i);
        const rowHeader = document.createElement('div');
        rowHeader.classList.add('board-cell', 'header-cell', 'row-header');
        rowHeader.textContent = rowLetters
        rowElement.appendChild(rowHeader)

        for (let j = 0; j < coloum; j++) { // nested for loop
            gameBoard[i][j] = '';
            const waterTiles = document.createElement('div')
            waterTiles.classList.add('board-cell', 'water-cell')
            waterTiles.dataset.row = rowLetters;
            waterTiles.dataset.col = j + 1;
            waterTiles.id = `${boardId}-${rowLetters}${j + 1}`
            rowElement.appendChild(waterTiles)
        }
        boardContainer.appendChild(rowElement);
    }

    return gameBoard;
}


const init = () => {
    createBoard('player-one-ocean');
    createBoard('player-two-ocean');

    shipsData.forEach((ship) => {
        ship.hits = 0;
        ship.sunk = false;
        ship.locations = [];
        ship.element = null;
    })
    currentShipBeingPlaced = null;
    currentShipLength = 0;
    isVertical = false;
  
    setUpPlacementListeners('player-one-ocean')
    displayMessage.textContent = "Player One, select a ship and place it on the board"
}

const render = () => { }


const handleShipSelection = (event) => {
    const selectedShipElement = event.target.closest('.ship-icon');
    if (!selectedShipElement) 
        return;

    const shipName = selectedShipElement.dataset.shipName;
    const shipLength = parseInt(selectedShipElement.dataset.length);

    const ship = shipsData.find(ships => ships.name.toLowerCase().replace(/\s/g, '-') === shipName); // replaces the white space globablly with -

    if (ship) {
        currentShipBeingPlaced = ship;
        currentShipLength = shipLength;

        shipIcons.forEach(icon => icon.classList.remove('selected-ship'));
        selectedShipElement.classList.add('selected-ship');

        displayMessage.textContent = `You've selected the ${ship.name} Now click on a tile on your board to place it.`;
    }
console.log(currentShipBeingPlaced)    
console.log(currentShipLength)
}

const handleBoardPlacement = (event) => {
    const clickedCell = event.target.closest('.board-cell')
    console.log(clickedCell)
    if (!clickedCell || !clickedCell.classList.contains('water-cell')) {
        return;
    }
    
    if (currentShipBeingPlaced) {
        const startRow = clickedCell.dataset.row;
        const startCol = parseInt(clickedCell.dataset.col)
        const oceanId = clickedCell.parentElement.parentElement.id;

        //convert letters to numbers
        const startRowIndex = startRow.charCodeAt(0) - 'A'.charCodeAt(0);

        const proposedLocation = []; // will hold the <div>
        let canPlace = true;

        for (let i = 0; i < currentShipLength; i++) {
            let row = startRowIndex;
            let col = startCol;

            if (isVertical) {
                row += i;
            } else {
                col += i;
            }
            const proposedRowLetter = String.fromCharCode('A'.charCodeAt(0) + row);
            const targetCellId = `${oceanId}-${proposedRowLetter}${col}`;
            const targetCell = document.getElementById(targetCellId);
            
            console.log(targetCell)

            if (!targetCell || targetCell.classList.contains('ship')) {
                canPlace = false;
                displayMessage.textContent = "Can't place ship here! There's already a ship or an invalid cell.";
                break;
            }
            proposedLocation.push(targetCell);
            console.log(proposedLocation)
        }
        if (canPlace) {
            proposedLocation.forEach(cell => {
                cell.classList.add('ship')
                cell.classList.add(currentShipBeingPlaced.name.toLowerCase().replace(/\s/g, '-'))
            });

            currentShipBeingPlaced.locations = proposedLocation.map(cell => ({
                row: cell.dataset.row,
                col: parseInt(cell.dataset.col)
            }))
            currentShipBeingPlaced.element = proposedLocation[0].parentElement.parentElement.querySelector(`.ship-icon[data-ship-name="${currentShipBeingPlaced.name.toLowerCase().replace(/\s/g, '-')}"]`);

            document.querySelector(`.ship-icon[data-ship-name="${currentShipBeingPlaced.name.toLowerCase().replace(/\s/g, '-')}"]`).remove();

            displayMessage.textContent = `${currentShipBeingPlaced.name} placed successfully`;

            currentShipBeingPlaced = null;
            currentShipLength = 0;
            shipIcons.forEach(icon => icon.classList.remove('selected-ship'));

        } else {
            console.log('Invalid Placement');
        }
    } else {
        displayMessage.textContent = "Please select a ship from the shipyard first!";
    }

}

/*----------------------------- Event Listeners -----------------------------*/

const setUpPlacementListeners = (boardId) => {
    const board = document.getElementById(boardId);
    board.addEventListener('click', handleBoardPlacement)
}

playerOneShipYard.addEventListener('click', handleShipSelection);


/* ---------------------------------------------------- */

init();


// When the ship is clicked, it becomes selected, then when the rotate button is clicked it rotates the ship in the ship-yard, this returns with nothing selected
// When the ship is clicked and held it can be draggeed onto the board, there the tiles will be highlighted green where the ship is over can can be placed
// If the ship is to close to another ship the watertiles will become red
// When the ship is hit/ updates the board by turning the watertile red