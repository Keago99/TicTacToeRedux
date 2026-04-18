
// gameboard IIFE
const gameboard = (() => {
    // An array filled with 9 elements of null, to represent the 9 board squares.
    let boardArray = new Array(9).fill(null);

    const getBoard = () => boardArray;

    const placeSymbol = (symbol, index) => {
        if (boardArray[index] !== null){
            alert("space full, please choose another square");
            return false;
        }
        else{
            boardArray[index] = symbol;
            return true;
        }
    }

    const checkWin = () =>{
        const winPatterns = [
            // Rows
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],

            // Columns
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            //Diagonals
            [0, 4, 8],
            [2, 4, 6],

        ];

        for (let i = 0; i < winPatterns.length; i++){
            const a = winPatterns[i][0];
            const b = winPatterns[i][1];
            const c = winPatterns[i][2];

            if (boardArray[a] && boardArray[a] === boardArray[b] && boardArray[a] === boardArray[c]){

                console.log(`${boardArray[a]} has won`);
                return boardArray[a];
            }
        }
        console.log("Nobody has won yet")
        return false;
    }

    const resetBoard = () => {
        boardArray = new Array(9).fill(null);
    }

    const checkTie = () => {
        const hasEmptySpaces = gameboard.getBoard().includes(null);
        if(hasEmptySpaces){
            return false;
        }
        else{
            alert("Tie game!");
            return true;
        }
    }
    return { placeSymbol, checkWin, checkTie, resetBoard, getBoard };
})();

// player factory function
function createPlayer(name, symbol){
    const returnName = () => name;
    const returnSymbol = () => symbol;

    return { returnName, returnSymbol };
}

//gameContoller IIFE
const gameController = (() => {

    let player1 = null;
    let player2 = null;
    let currentPlayer = null;
    let activeGame = false;

    const getCurrentPlayer = () => currentPlayer;
    
    
    const startGame = (p1,p2) => {
        player1 = p1;
        player2 = p2;
        activeGame = true;
        gameboard.resetBoard();
        let randomNumber = Math.floor(Math.random() * 2) + 1;

        if(randomNumber === 1){
            currentPlayer = player1;
        }
        else{
            currentPlayer = player2;
        }
    }

    const swapTurn = () =>{
        if (currentPlayer === player1){
            currentPlayer = player2;
        }
        else{
            currentPlayer = player1;
        }
    }

    const makeMove = (index) => {
        // if the game is active
        if(!activeGame){
            alert("game is over, cannot make another move!");
            return false;
        }
        else{
            // places the symbol and does checks (alerts within placeSymbol)
            const placeSymbol = gameboard.placeSymbol(currentPlayer.returnSymbol(),index);
            if(placeSymbol){
             // winning alerts in checkwin
             let winner = gameboard.checkWin()
             if (winner){
                activeGame = false;
                return true;
             }
             else if(gameboard.checkTie()){
                    activeGame = false;
                    return true;
                }
                else{
                swapTurn();
                return true;
                }
            }
            return false;
        }
    }
    return { getCurrentPlayer, startGame, makeMove };
})();

// displayContoller IIFE
const displayContoller = (() => {
    const showDialog = () => {
        const dialog = document.querySelector("#mainDialog");
        dialog.showModal();
    }

    const resetDialog = () => {
        const inputs = document.querySelectorAll("input");

        for (let i = 0; i < inputs.length; i++){
            inputs[i].value = "";
        }
    }

    const resetDialogEvent = () => {
        const resetBtn = document.querySelector("#dialogResetBtn");

        resetBtn.addEventListener("click", resetDialog);
    }

    const updateTurnDisplay = (player) => { 
        const turnDisplay = document.querySelector("#turnDisplay");

        turnDisplay.innerText = (`It's ${player.returnName()}'s turn`);
    } 

    const dialogSubmit = () => {
        const player1Name = document.querySelector("#player1NameDia").value;
        const player1Symbol = document.querySelector("#player1SymbolDia").value;

        const player2Name = document.querySelector("#player2NameDia").value;
        const player2Symbol = document.querySelector("#player2SymbolDia").value;

        if (!player1Name.trim() || !player1Symbol.trim() || !player2Name.trim() || !player2Symbol.trim()){
            alert("Please fill in all fields!");
            return;
        }

        if (player1Name === player2Name){
            alert("Names must be unique!");
            return;
        }

        if  (player1Symbol === player2Symbol){
            alert("Symbols must be unique!");
            return;
        }

        const player1 = createPlayer(player1Name, player1Symbol);

        const player2 = createPlayer(player2Name, player2Symbol);

        return {player1, player2}
    }

    const dialogSubmitEvent = () => {
        const dialog = document.querySelector("#mainDialog");
        const submitBtn = document.querySelector("#dialogSubmitBtn");

        submitBtn.addEventListener("click", () => {
            const players = dialogSubmit();
            if (players){
                gameController.startGame(players.player1, players.player2);
                updatePlayerDisplay(players.player1, players.player2)
                updateTurnDisplay(gameController.getCurrentPlayer());
                assignMainClickEvent();
                resetDialog();
                dialog.close();
            }

        });
    }

    const updatePlayerDisplay = (p1,p2) =>{
        const player1Name = document.querySelector("#player1Name");
        const player1Symbol = document.querySelector("#player1Symbol");

        const player2Name = document.querySelector("#player2Name");
        const player2Symbol = document.querySelector("#player2Symbol");

        player1Name.value = p1.returnName();
        player1Symbol.value = p1.returnSymbol();

        player2Name.value = p2.returnName();
        player2Symbol.value = p2.returnSymbol();
    }

    const assignMainClickEvent = () => {
        const cells = document.querySelectorAll(".gridItem");

        cells.forEach((cell) => {
            const index = parseInt(cell.dataset.index);
            cell.addEventListener("click", () => {
                const symbol = gameController.getCurrentPlayer().returnSymbol();
                console.log(`symbol is ${symbol}`);
                const success = gameController.makeMove(index);
                if (success){
                    updateCell(index, symbol);
                }
            });
        });
    }

    const updateCell = (index,symbol) => {
        
        
        const cell = document.querySelector(`[data-index="${index}"]`);
        
        cell.innerText = symbol;
    }

    return { showDialog, resetDialogEvent, updateTurnDisplay, dialogSubmitEvent, assignMainClickEvent};
})();


displayContoller.showDialog();
displayContoller.resetDialogEvent();
console.log(document.querySelector("#player1Name"));
displayContoller.dialogSubmitEvent();
