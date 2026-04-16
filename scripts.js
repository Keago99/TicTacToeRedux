
// gameboard IIFE
const gameboard = (() => {
    // An array filled with 9 elements of null, to represent the 9 board squares.
    const boardArray = new Array(9).fill(null);
})();

// player factory function
function createPlayer(name, symbol){
    const returnName = () => name;
    const returnSymbol = () => symbol;
}

//gameContoller IIFE
const gameController = (() => {


})();

// displayContoller IIFE
const displayContoller = (() => {
    const showDialog = () => {
        const dialog = document.querySelector("#mainDialog");
        dialog.showModal();
    }

    return { showDialog };
})();

displayContoller.showDialog();