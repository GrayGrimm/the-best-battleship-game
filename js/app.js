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

const aiShipsData = [
    { name: 'Aircraft Carrier', length: 5, hits: 0, sunk: false, locations: [], element: null },
    { name: 'Battleship', length: 4, hits: 0, sunk: false, locations: [], element: null },
    { name: 'Destroyer', length: 3, hits: 0, sunk: false, locations: [], element: null },
    { name: 'Dredger', length: 3, hits: 0, sunk: false, locations: [], element: null },
    { name: 'Fortress', length: 2, hits: 0, sunk: false, locations: [], element: null }
]


/*---------------------------- Variables (state) ----------------------------*/

let currentPlayer = 'Player One';
let currentShipBeingPlaced = null;
let currentShipLength = 0;
let isVertical = false;
let winner;
let allShipsPlaced = false;

let playerOneGameBoard = [];
let playerTwoGameBoard = [];


/*------------------------ Cached Element References ------------------------*/

const gameBoard = document.querySelector('.game-board-container')
const playerOneOcean = document.querySelector('#player-one-ocean')
const playerTwoOcean = document.querySelector('#player-two-ocean')
const playerTwoRows = playerTwoOcean.querySelectorAll('.board-row')
const displayMessage = document.querySelector('#game-message')
const shipIcons = document.querySelectorAll('.ship-icon')
const playerOneShipYard = document.getElementById('player-one-ship-yard')
const playerTwoShipYard = document.getElementById('player-two-ship-yard')
const playerOneRotateShipButton = document.querySelector('#player-one-rotate-ship-button')
const resetButun = document.querySelector('#reset-the-game-button')

/*-------------------------------- Functions --------------------------------*/
const createBoard = (boardId) => {
    let gameBoard = [];
    const rows = 10;
    const column = 10;

    const boardContainer = document.getElementById(boardId)
    boardContainer.innerHTML = '';

    const columnHeader = document.createElement('div');
    columnHeader.classList.add('board-row', 'header-row');

    const cornerCell = document.createElement('div');
    cornerCell.classList.add('board-cell', 'header-cell', 'corner-cell');
    columnHeader.appendChild(cornerCell);

    for (let j = 0; j < column; j++) {
        const headerCell = document.createElement('div')
        headerCell.classList.add('board-cell', 'header-cell', 'column-header')
        headerCell.textContent = j + 1
        columnHeader.appendChild(headerCell)
    }
    boardContainer.appendChild(columnHeader)

    for (let i = 0; i < rows; i++) {
        gameBoard[i] = []; 
        const rowElement = document.createElement('div')
        rowElement.classList.add('board-row')

        const rowLetters = String.fromCharCode(65 + i);
        const rowHeader = document.createElement('div');
        rowHeader.classList.add('board-cell', 'header-cell', 'row-header');
        rowHeader.textContent = rowLetters
        rowElement.appendChild(rowHeader)

        for (let j = 0; j < column; j++) { 
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
    playerOneGameBoard = createBoard('player-one-ocean');
    playerTwoGameBoard = createBoard('player-two-ocean');

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
    setUpPlacementListeners('player-two-ocean')
    displayMessage.textContent = "Player One, select a ship and place it on the board"
}

const render = () => { }

const handleShipSelection = (event) => {
    const selectedShipElement = event.target.closest('.ship-icon');
    if (!selectedShipElement)
        return;

    const shipName = selectedShipElement.dataset.shipName;
    const shipLength = parseInt(selectedShipElement.dataset.length);

    const ship = shipsData.find(ships => ships.name.toLowerCase().replace(/\s/g, '-') === shipName);

    if (ship) {
        currentShipBeingPlaced = ship;
        currentShipLength = shipLength;
        currentShipBeingPlaced.element = selectedShipElement;

        shipIcons.forEach(icon => icon.classList.remove('selected-ship'));
        selectedShipElement.classList.add('selected-ship');

        displayMessage.textContent = `You've selected the ${ship.name} Now click on a tile on your board to place it.`;
    }
}

const handleBoardPlacement = (event) => {
    const clickedCell = event.target.closest('.board-cell')

    if (!clickedCell || !clickedCell.classList.contains('water-cell')) {
        return;
    }

    if (allShipsPlaced === true) {
        return;
    }

    if (currentShipBeingPlaced) {
        const startRow = clickedCell.dataset.row;
        const startCol = parseInt(clickedCell.dataset.col)
        const oceanId = clickedCell.parentElement.parentElement.id;

        const startRowIndex = startRow.charCodeAt(0) - 'A'.charCodeAt(0);

        const proposedLocation = [];
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


            if (!targetCell || targetCell.classList.contains('ship')) {
                canPlace = false;
                displayMessage.textContent = "Can't place ship here! There's already a ship or an invalid cell.";
                break;
            }
            proposedLocation.push(targetCell);
        }
        if (canPlace) {
            proposedLocation.forEach(cell => {
                const cellRowLetter = cell.dataset.row;
                const cellColNumber = parseInt(cell.dataset.col);

                const actualRowIndex = cellRowLetter.charCodeAt(0) - 'A'.charCodeAt(0);
                const actualColIndex = cellColNumber - 1;

                playerOneGameBoard[actualRowIndex][actualColIndex] = 'S';
            });
            proposedLocation.forEach(cell => {
                cell.classList.add('ship')
                cell.classList.add(currentShipBeingPlaced.name.toLowerCase().replace(/\s/g, '-'))
            });

            currentShipBeingPlaced.locations = proposedLocation.map(cell => ({
                row: cell.dataset.row,
                col: parseInt(cell.dataset.col)
            }))

            document.querySelector(`.ship-icon[data-ship-name="${currentShipBeingPlaced.name.toLowerCase().replace(/\s/g, '-')}"]`).remove();

            displayMessage.textContent = `${currentShipBeingPlaced.name} placed successfully`;

            currentShipBeingPlaced = null;
            currentShipLength = 0;
            shipIcons.forEach(icon => icon.classList.remove('selected-ship'));
            isVertical = false;
            checkAllShipsPlaced();
        } else {
            console.log('Invalid Placement');
        }
    } else {
        displayMessage.textContent = "Please select a ship from the shipyard first!";
    }

}

const handleRotateButton = (event) => {
    const rotateButton = event.target.id
    console.log(rotateButton)
    if (isVertical === false) {
        isVertical = true;
        displayMessage.textContent = "Ship will be vertical"
    } else {
        isVertical = false;
        displayMessage.textContent = "Ship will be horizontal"
    }
}

const checkAllShipsPlaced = () => {
    const shipCount = playerOneShipYard.childElementCount;
    if (shipCount === 0) {
        playerTwoAiPlacement();
        playerOneRotateShipButton.style.display = 'none'
        displayMessage.textContent = "All ships have been placed!"
        allShipsPlaced = true;
    }
}

const playerTwoAiPlacement = () => {
    displayMessage.textContent = "Player Two is placing their ships. PLese Wait"
    aiShipsData.forEach((ship) => {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 200;

        while (!placed && attempts < maxAttempts) {
            attempts++

            const randomRowIndex = Math.floor(Math.random() * 10);
            const randomCol = Math.floor(Math.random() * 10) + 1;

            const randomIsVertical = Math.random() < 0.5;

            const proposedLocation = [];
            let canAiPlace = true;

            for (let i = 0; i < ship.length; i++) {
                let checkRowIndex = randomRowIndex;
                let checkCol = randomCol;

                if (randomIsVertical) {
                    checkRowIndex += i;
                } else {
                    checkCol += i;
                }

                const proposedRowLetter = String.fromCharCode('A'.charCodeAt(0) + checkRowIndex);
                const targetCellId = `player-two-ocean- ${proposedRowLetter}${checkCol}`;
                const targetCell = document.getElementById(targetCellId);

                if (!targetCell || targetCell.classList.contains('ship')) {
                    canAiPlace = false;
                    break;
                }
                proposedLocation.push(targetCell);
            }
            if (canAiPlace) {
                proposedLocation.forEach(cell => {
                    const cellRowLetter = cell.dataset.row;
                    const cellColNumber = parseInt(cell.dataset.col);

                    const actualRowIndex = cellRowLetter.charCodeAt(0) - 'A'.charCodeAt(0);
                    const actualColIndex = cellColNumber - 1;

                    playerTwoGameBoard[actualRowIndex][actualColIndex] = 'S';
                });
                proposedLocation.forEach(cell => {
                    cell.classList.add('ship')
                })
                ship.locations = proposedLocation.map(cell => ({
                    row: cell.dataset.row,
                    col: parseInt(cell.dataset.col)
                }))
                placed = true;
            }
        }
    })
    displayMessage.textContent = "Player Two has placed all their ships!";
    playerTwoShipYard.style.display = 'none';
    console.log(playerOneGameBoard)
}
const shotsFired = (event) => {
    const targetCell = event.target

    const targetBoardId = targetCell.parentElement.parentElement.id;

    if (allShipsPlaced === true && currentPlayer === 'Player One') {

        const targetRowLetter = targetCell.dataset.row;
        const targetColNumber = parseInt(targetCell.dataset.col);

        let hitShip = null;

        for (const ship of shipsData) {
            const foundInLocation = ship.locations.some(loc =>
                loc.row === targetRowLetter &&
                loc.col === targetColNumber
            );
            if (foundInLocation) {
                hitShip = ship;
                break;
            }
        }

        if (targetCell.classList.contains('hit-attempt')) {
            displayMessage.textContent = "Try Again! Either attempted already or invalid cell!"
            return;
        } else if (hitShip) {
            targetCell.style.backgroundColor = 'red'
            targetCell.classList.add('hit-attempt')
            displayMessage.textContent = `${currentPlayer} hit a ship!! Player Twos Turn!`
            hitShip.hits++;
            checkShipSunk(hitShip);
            checkForWinner();
            currentPlayer = 'Player Two';
            aiShotsFired();
        } else {
            targetCell.style.backgroundColor = 'black'
            targetCell.classList.add('hit-attempt')
            displayMessage.textContent = `${currentPlayer} missed! Player Twos Turn!`
            currentPlayer = 'Player Two'
            aiShotsFired();
        }

    }

}

const aiShotsFired = () => {

    if (allShipsPlaced === true && currentPlayer === 'Player Two') {
        let targetRowIndex;
        let targetColNumber;
        let targetCellElement = null;
        let proposedRowLetter = null;

        let foundValidTarget = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!foundValidTarget && attempts < maxAttempts) {
            targetRowIndex = Math.floor(Math.random() * 10);
            targetColNumber = Math.floor(Math.random() * 10) + 1;

            proposedRowLetter = String.fromCharCode('A'.charCodeAt(0) + targetRowIndex);
            const cellId = `player-one-ocean-${proposedRowLetter}${targetColNumber}`;
            targetCellElement = document.getElementById(cellId);

            if (targetCellElement && !targetCellElement.classList.contains('hit-attempt')) {
                foundValidTarget = true;
            }
            attempts++;
        }
        const isAHit = playerOneGameBoard[targetRowIndex][targetColNumber - 1] === 'S';

        let hitShip = null;
        if (isAHit) {
            for (const ship of shipsData) {
                const shipLocation = ship.locations.some(loc =>
                    loc.row === proposedRowLetter &&
                    loc.col === targetColNumber
                );
                if (shipLocation) {
                    hitShip = ship;
                    break;
                }
            }
        }
        if (hitShip) {
            targetCellElement.style.backgroundColor = 'red'
            targetCellElement.classList.add('hit-attempt')
            displayMessage.textContent = `${currentPlayer} hit a ship! Player Ones Turn!`
            hitShip.hits++;
            checkShipSunk(hitShip);
            checkForWinner();
            currentPlayer = 'Player One';
        } else if (!hitShip) {
            targetCellElement.style.backgroundColor = 'black'
            targetCellElement.classList.add('hit-attempt')
            displayMessage.textContent = `${currentPlayer} missed! Player Ones Turn!`
            currentPlayer = 'Player One'
        } else {
            return;
        }
    }
}


const checkShipSunk = (ship) => {
    if (ship.hit >= ship.length) {
        if (!ship.sunk) {
            ship.sunk = true;
            displayMessage.textContent = `You sunk the opponents ${ship.name}!!`
            return true;
        }
    }
}

const checkForWinner = () => {
    if (shipsData.every((ship) => ship.sunk === true)) {
        winner = playerTwo;
        displayMessage.textContent = "Player Two has won"
    } else if (aiShipsData.every((ship) => ship.sunk === true)) {
        winner = playerOne;
        displayMessage.textContent = "Player One has won"
    }
}

const resetTheGame = (event) => {
    init();
    window.location.reload();
    displayMessage.textContent = "The game has been reset! Player One place your ships to begin!"
}

/*----------------------------- Event Listeners -----------------------------*/

const setUpPlacementListeners = (boardId) => {
    const board = document.getElementById(boardId);
    board.addEventListener('click', handleBoardPlacement)
}

playerOneOcean.addEventListener('click', shotsFired);
playerTwoOcean.addEventListener('click', shotsFired);
playerOneShipYard.addEventListener('click', handleShipSelection);
playerOneRotateShipButton.addEventListener('click', handleRotateButton);
resetButun.addEventListener('click', resetTheGame);

/* ---------------------------------------------------- */

init();


/*-------------------------------------Code Graveyard---------------------------------------------------------------------------------------------------------

When the ship is clicked, it becomes selected, then when the rotate button is clicked it rotates the ship in the ship-yard, this returns with nothing selected
When the ship is clicked and held it can be draggeed onto the board, there the tiles will be highlighted green where the ship is over can can be placed
If the ship is to close to another ship the watertiles will become red
When the ship is hit/ updates the board by turning the watertile red
add a function so when all ships are placed it nullifies the placeShip function so a message doesnt pop up
maybe add a button for ai ship attack

------------------------------------------------------------------------------------------------------------------------------------------------------------------*/