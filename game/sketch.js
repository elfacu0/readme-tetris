const p5 = require('node-p5');
const Game = require('./game');

let gameData = {};
let game = new Game(gameData);

function sketch(p) {
  p.setup = () => {
    let canvas = p.createCanvas(250, 300);
      game.draw(p);
      p.noLoop();
      p.saveCanvas(canvas, 'out', 'png').then(() => {
        console.log('saved canvas as out.png');
    }).catch(console.error)
  }
}

let p5Instance = p5.createSketch(sketch);

// function keyPressed() {
//   if (keyCode === LEFT_ARROW) {
//     game.moveTetromino("left");
//   } else if (keyCode === RIGHT_ARROW) {
//     game.moveTetromino("right");
//   } else if (keyCode === 82) {
//     game.moveTetromino('rotate');
//   } else if (keyCode == DOWN_ARROW) {
//     // game.checkVerticalCollision();
//   } else if(keyCode == UP_ARROW){
//     gameData = game.saveGame();
//   }else if(keyCode == 83){
//     loadGame();
//   }
//   game.draw();
// }


// function loadGame(){
//   const parseGameData = {
//     topScore: gameData.topScore,
//     currScore: gameData.currScore,
//     board: JSON.parse(gameData.board),
//     tetromino: JSON.parse(gameData.tetromino),
//     nextTetromino: JSON.parse(gameData.nextTetromino),
//   }
//   game = new Game(parseGameData);
// }