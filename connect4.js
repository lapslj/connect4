/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let pno = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let htmlBoard = document.querySelector("#board")
let plrbox1 = document.querySelector(".box1")
let plrbox2 = document.querySelector(".box2")
let scorebox = document.querySelector("#playerdata")
let statusbox = document.querySelector("#instructions")
let gameover = false;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) { //create a blank array for each row
    let bArr = []
    for (let x = 0; x < WIDTH; x++){
      bArr = [...bArr, 0]
    } 
    board = [...board,bArr]
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
   // Create the top clickable row
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  //create the header row to be clicked
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    headCell.setAttribute("class","topguide")
    headCell.innerText = "click here to drop pieces";
    top.append(headCell);
  }
  htmlBoard.append(top);

  //create the board 
  for (let y = 0; y < HEIGHT; y++) { //creating as many rows as height
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td"); //creating cells for each column
      cell.setAttribute("id", `${y}-${x}`); //giving each cell a unique number ID
      cell.setAttribute("occ", "false"); //setting "occupied" attribute to false
      //cell.innerText = y + ", " + x
      row.append(cell);
    }
    htmlBoard.append(row);
  }
  let boxWdth = 56 * WIDTH
  scorebox.style.width = boxWdth + "px"
  statusbox.style.width = boxWdth + "px"
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  //make a column array of current board at x
  let chArray = []
  for (let i = HEIGHT; i > 0; i--){
    chArray = [...chArray,board[i-1][x]]
  }
  return HEIGHT - 1 - chArray.findIndex((val)=>val === 0)
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x, pno) {
  let destSpot = document.getElementById(`${y}-${x}`);
  let isOcc = destSpot.getAttribute("occ");
  console.log(isOcc);
  if(isOcc === "false"){
    putPieceInTable(y, x, pno,destSpot);
    destSpot.setAttribute("occ",true);
  }else{
    console.log("occupied sorry")
  }
}

function putPieceInTable(y, x, pno,destSpot) {
    //let destSpot = document.getElementById(`${y}-${x}`);
    let piece = document.createElement("div");
    piece.setAttribute("class","piece"+pno);
    destSpot.append(piece); //stick the piece in there IF unoccupied
    destSpot.setAttribute("occ",true)
    board[y][x] = pno;
}

/** endGame: announce game end */

function endGame(msg) {
  top.removeEventListener("click", handleClick)
  setTimeout(function(){
    statusbox.innerText = "nice job player "+pno
    alert(msg)},300)
  gameover = true;
}


/** handleClick: handle click of column top to play piece */


const handleClick = (evt) => {
  if (gameover === true){
    statusbox.innerText = "the game is over. reload to restart."
    return};
  // get x from ID of clicked cell
  let x = +evt.target.id

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  placeInTable(y,x,pno); //place piece in board and add to table
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${pno} won!`);
  }
    // check for tie
  if (tieCheck()){
    return endGame("tie game");
  }
  let currbox = pno === 1 ? plrbox1 : plrbox2;
  let nextbox = pno === 1 ? plrbox2 : plrbox1;
  pno = (pno === 1 ? 2 : 1)
  currbox.classList.toggle("yourturn")
  nextbox.classList.toggle("yourturn")
  statusbox.innerText = "your turn player "+pno

}
function tieCheck() {
  //create array of all board values
  let tArray = [];
  for (let i = 0; i < HEIGHT; i++){
    tArray = [...tArray,...board[i]]}
  return tArray.every(x => x !==0)
}
/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match pno

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === pno
    );
  }//win function checks that all these cells are in the board AND equal same player color

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //horizontal win array
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; //vertical win array
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; //diagonal win array
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; //diagonal win array

      if (_win(horiz)){
        winPainter(horiz);
        return true;
      }
      if (_win(vert)){
        winPainter(vert);
        return true;
      }
      if (_win(diagDR)){
        winPainter(diagDR);
        return true;
      }
      if (_win(diagDL)){
        winPainter(diagDL);
        return true;
      }
      // if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
      //   return true;
      // }
    }
  }
}

function winPainter(cells) {
  for(i=0;i<=3;i++){
    let hi1 = document.getElementById(cells[i][0]+"-"+cells[i][1])
    hi1.style.backgroundColor = "gold"
  }
}
    

    // return cells.every(
    //   ([y, x]) =>
    //     y >= 0 &&
    //     y < HEIGHT &&
    //     x >= 0 &&
    //     x < WIDTH &&
    //     board[y][x] === pno
    // );
  //win function checks that all these cells are in the board AND equal same player color

  // TODO: read and understand this code. Add comments to help you.

makeBoard();
makeHtmlBoard();
plrbox1.classList.toggle("yourturn")
