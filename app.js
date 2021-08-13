require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Game = require("./game/game");
const Tetris = require("./models/Tetris");
const p5 = require("node-p5");

const app = express();

const uri = process.env.MONGOOSE_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.once("open", () => {
  console.log("connecting to db");
});

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  let canvas;
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
      canvas = p.createCanvas(250, 300);
      p.noLoop();
      game.draw(p);
    };
  }

  let p5Instance = p5.createSketch(sketch);

  const img = Buffer.from(canvas.elt.toDataURL().replace(/^data:image\/png;base64,/, ''), 'base64');
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Cache-Control": "no-cache",
    'Content-Length':  img.length,
  });
  res.end(img);
});

const PlayRoute = require("./routes/Play");
app.use("/play", PlayRoute);

app.listen(process.env.PORT || 3000, console.log("start"));
