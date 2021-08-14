require("dotenv").config();
const express = require("express");
const router = express.Router();
const Tetris = require("../models/Tetris");
const p5 = require("node-p5");
const Game = require("../game/game");

const ALLOWED_ACTIONS = ["right", "left", "down", "rotate", "drop"];

// const uploadImage = async (canvas) => {
//   const dataURL = canvas.elt.toDataURL();

//   let base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
//   base64Data += base64Data.replace("+", " ");
//   const binaryData = Buffer.from(base64Data, "base64");

//   const c = new Client();
//   c.on("ready", function () {
//     c.put(binaryData, "out.png", function (err) {
//       if (err) throw err;
//       c.end();
//     });
//   });

//   c.connect({
//     host: "ftp.sirv.com",
//     user: process.env.SIRV_USER,
//     password: process.env.SIRV_PASSWORD,
//   });
// };

// Here it gets the data from db, then creates the game, moves it and then saves the data and updates the new image
router.get("/:action", async (req, res) => {
  const action = req.params.action;
  if (ALLOWED_ACTIONS.includes(action) == false) {
    res.send("wrong action dude");
  }
  let gameData = await Tetris.findById(process.env.MONGOOSE_ID);
  const parsedGameData = {
    topScore: gameData.topScore,
    currScore: gameData.currScore,
    board: JSON.parse(gameData.board),
    tetromino: JSON.parse(gameData.tetromino),
    nextTetromino: JSON.parse(gameData.nextTetromino),
  };

  const game = new Game(parsedGameData);
  function sketch(p) {
    p.setup = () => {
      let canvas = p.createCanvas(250, 300);
      p.noLoop();
      game.moveTetromino(action);
      game.draw(p);
      //   p.saveCanvas(canvas, "out", "png")
      //     .then(() => {
      //       console.log("saved canvas as out.png");
      //     })
      //     .catch(console.error);
      // uploadImage(canvas);
    };
  }

  let p5Instance = p5.createSketch(sketch);
  const saveNewGame = await Tetris.updateOne(
    { _id: process.env.MONGOOSE_ID },
    game.saveGame()
  );
  res.redirect('https://github.com/elfacu0');
});

module.exports = router;
