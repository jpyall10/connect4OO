/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  constructor(player1,player2,width=7,height=6){
    this.players = [player1,player2];
    this.WIDTH = width;
    this.HEIGHT = height;
    this.currPlayer = player1;
    this.makeBoard();
    this.makeHtmlBoard();
  }
  
  //let currPlayer = 1; // active player: 1 or 2
  //let board = []; // array of rows, each row is array of cells  (board[y][x])
  
  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }
  
  /** makeHtmlBoard: make HTML table and row of column tops. */
  
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
  
    //make player color entry area
    // const playerColorsRow = document.createElement('tr');
    // playerColorsRow.setAttribute('id','playerColors');
    // const p1ColorBox = document.createElement('input');
    // p1ColorBox.setAttribute('id','p1ColorBox');
    // const p2ColorBox = document.createElement('input');
    // p2ColorBox.setAttribute('id','p2ColorBox');
    // p2ColorBox.setAttribute('type','color');
    // playerColorsRow.append(p1ColorBox,p2ColorBox);
    // board.append(playerColorsRow);


    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    this.handleGameClick = this.handleClick.bind(this)

    top.addEventListener('click', this.handleGameClick);
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }
  
  /** findSpotForCol: given column x, return top empty y (null if filled) */
  
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  
  /** placeInTable: update DOM to place piece into HTML table of board */
  
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    // piece.classList.add(`p${this.currPlayer}`);
    // piece.style.backgroundColor = 
    // if(this.currPlayer === this.players[0]){
    piece.style.backgroundColor = this.currPlayer.color;
    // }else{
      // piece.style.backgroundColor = 'blue';
    // }
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  
  /** endGame: announce game end */
  
  endGame(msg) {
    window.alert(msg);
    const restartBtn = document.getElementById('startButton');
    document.getElementById('p1ColorBox').disabled = false;
    document.getElementById('p2ColorBox').disabled = false;
    const spans = document.querySelectorAll('span');
    for (span of spans){
      span.classList.remove('noDisplay');
      span.classList.add('tooltiptext');
    }
    restartBtn.style.display = 'block';
    restartBtn.value = "Start New Game";
    document.getElementById('column-top').removeEventListener('click',this.handleGameClick);
  }
  
  /** handleClick: handle click of column top to play piece */
  
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.color;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.name} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('The game ended in a Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
  
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  
  checkForWin() {
    const _win = (cells) =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer.color
      );
  
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color,name){
    this.color = color;
    this.name = name;
  }
}
//start game on click of start button
document.getElementById('startButton').addEventListener('click',(e)=>{
  let p1 = new Player(document.getElementById('p1ColorBox').value,'Player 1');
  let p2 = new Player(document.getElementById('p2ColorBox').value,'Player 2');
  if (p1.color === p2.color){
    alert("Colors must be different");
    return;
  }
  new Game(p1,p2);
  document.getElementById('startButton').style.display = 'none';
  let p1ColorBox = document.getElementById('p1ColorBox')
  const spans = document.querySelectorAll('span');
  for (span of spans){
    span.classList.remove('tooltiptext');
    span.classList.add('noDisplay');
  }
  p1ColorBox.disabled = true;
  let p2ColorBox = document.getElementById('p2ColorBox')
  p2ColorBox.disabled = true;
  
});

