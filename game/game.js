const Tetromino = require("./tetromino");
class Game {
  constructor({
    topScore = 0,
    currScore = 0,
    board = [],
    tetromino = false,
    nextTetromino = false,
  }) {
    this.rows = 20;
    this.columns = 10;
    this.squareSize = 15;
    this.board = board;
    this.emptyColour = "#000000";
    this.tetromino = this.generateTetromino(tetromino);
    this.nextTetromino = this.generateTetromino(nextTetromino);
    !board.length && this.initBoard();
    this.topScore = topScore;
    this.currScore = currScore;
    this.nextTetrominoBoard = [];
    this.initNextTetrominoBoard();
  }

  initBoard() {
    this.board = [];
    for (let i = 0; i < this.rows; i++) {
      this.board.push([]);
      for (let j = 0; j < this.columns; j++) {
        this.board[i].push(this.emptyColour);
      }
    }
  }

  initNextTetrominoBoard() {
    this.nextTetrominoBoard = [];
    for (let i = 0; i < 4; i++) {
      this.nextTetrominoBoard.push([]);
      for (let j = 0; j < 4; j++) {
        this.nextTetrominoBoard[i].push(this.emptyColour);
      }
    }
    this.nextTetromino.shapeCoords.forEach(([x, y]) => {
      this.nextTetrominoBoard[y + 1][x + 1] = this.tetromino.colour;
    });
  }

  draw(p) {
    p.background("#444941");
    this.drawTetromino(p);
    this.drawBoard(p);
    this.checkVerticalCollision(p);
    this.drawScore(p);
  }

  drawBoard(p) {
    this.board.forEach((row, i) => {
      row.forEach((colour, j) => {
        const c = p.color(colour);
        p.fill(c);
        p.rect(
          this.squareSize * j,
          this.squareSize * i,
          this.squareSize,
          this.squareSize
        );
      });
    });
  }

  drawScore(p) {
    p.textSize(18);
    p.fill("#000");
    p.text("Top Score", 160, 30);
    p.text(this.topScore, 160, 50);
    p.text("Score", 160, 80);
    p.text(this.currScore, 160, 100);
    p.text("Next", 160, 130);
    this.drawNextTetromino(p);
  }

  drawNextTetromino(p) {
    const xOffSet = 160;
    const yOffSet = 140;
    this.nextTetrominoBoard.forEach((row, i) => {
      row.forEach((colour, j) => {
        p.fill(p.color(colour));
        p.rect(
          xOffSet + this.squareSize * j,
          yOffSet + this.squareSize * i,
          this.squareSize,
          this.squareSize
        );
      });
    });
  }

  drawTetromino() {
    this.tetromino.shapeCoords.forEach(([x, y]) => {
      this.board[y + this.tetromino.coords[1]][x + this.tetromino.coords[0]] =
        this.tetromino.colour;
    });
  }

  generateTetromino(tetromino) {
    if (!tetromino) {
      return new Tetromino({ shapeId: Math.floor(Math.random() * 4) });
    }
    return new Tetromino(tetromino);
  }

  getNextTetromino() {
    this.tetromino = this.nextTetromino;
    this.nextTetromino = this.generateTetromino();
    this.initNextTetrominoBoard();
  }

  checkVerticalCollision(p) {
    const coords = this.tetromino.coords;
    this.clearTetrominoTrace();
    for (const [x, y] of this.tetromino.shapeCoords) {
      if (
        y + coords[1] + 1 >= this.rows ||
        this.board[y + coords[1] + 1][x + coords[0]] != this.emptyColour
      ) {
        if (y + coords[1] - 4 <= 0) {
          return this.restart();
        }
        this.removeTetromino();
        this.getNextTetromino();
        this.draw(p);
        return "GROUND";
      }
    }
    this.tetromino.fall();
  }

  checkHorizontalCollision(newCoords) {
    return newCoords.find(
      ([x, y]) =>
        x < 0 ||
        x >= this.columns ||
        y < 0 ||
        y >= this.rows ||
        this.board[y][x] != this.emptyColour
    );
  }

  removeTetromino() {
    this.drawTetromino();
    this.tetromino = {};
    this.checkLines();
  }

  clearTetrominoTrace() {
    this.tetromino.shapeCoords.forEach(([x, y], i) => {
      this.board[y + this.tetromino.coords[1]][x + this.tetromino.coords[0]] =
        this.emptyColour;
    });
  }

  moveTetromino(action) {
    if (action == "left") {
      const newCoords = this.tetromino.shapeCoords.map(([x, y]) => [
        x + this.tetromino.coords[0] - 1,
        y + this.tetromino.coords[1],
      ]);
      if (!this.checkHorizontalCollision(newCoords)) {
        this.tetromino.move(action);
      }
    }
    if (action == "right") {
      const newCoords = this.tetromino.shapeCoords.map(([x, y]) => [
        x + this.tetromino.coords[0] + 1,
        y + this.tetromino.coords[1],
      ]);
      if (!this.checkHorizontalCollision(newCoords)) {
        this.tetromino.move(action);
      }
    }
    if (action == "rotate") {
      const oldRotationId = this.tetromino.rotationId;
      this.tetromino.move(action);
      const newCoords = this.tetromino.shapeCoords.map(([x, y]) => [
        x + this.tetromino.coords[0],
        y + this.tetromino.coords[1],
      ]);
      if (this.checkHorizontalCollision(newCoords)) {
        this.tetromino.rotationId = oldRotationId - 1;
        this.tetromino.move(action);
      }
    }
    if (action == "drop") {
      while (true) {
        const coords = this.tetromino.coords;
        for (const [x, y] of this.tetromino.shapeCoords) {
          if (
            y + coords[1] + 1 >= this.rows ||
            this.board[y + coords[1] + 1][x + coords[0]] != this.emptyColour
          ) {
            if (y + coords[1] - 4 <= 0) {
              return this.restart();
            }
            this.removeTetromino();
            this.getNextTetromino();
            return "GROUND";
          }
        }
        this.tetromino.fall();
      }
    }
  }

  restart() {
    this.initBoard();
    this.tetromino = this.generateTetromino();
    this.nextTetromino = this.generateTetromino();
    this.resetScore();
    return "GAME OVER";
  }

  checkLines() {
    for (let i = this.rows - 1; i >= 0; i--) {
      let isComplete = true;
      for (let j = 0; j < this.columns; j++) {
        if (this.board[i][j] == this.emptyColour) {
          isComplete = false;
        }
      }
      if (isComplete) {
        this.removeLine(i);
        this.addScore();
        i += 1;
      }
    }
  }

  removeLine(row) {
    for (let i = row; i > 0; i--) {
      for (let j = 0; j < this.columns; j++) {
        this.board[i][j] = this.board[i - 1][j];
      }
    }
  }

  addScore() {
    this.currScore += 100;
    this.topScore = Math.max(this.topScore, this.currScore);
  }

  resetScore() {
    this.currScore = 0;
  }

  saveGame() {
    const data = {
      topScore: this.topScore,
      currScore: this.currScore,
      board: JSON.stringify(this.board),
      tetromino: JSON.stringify(this.tetromino),
      nextTetromino: JSON.stringify(this.nextTetromino),
    };
    return data;
  }
}

module.exports = Game;
