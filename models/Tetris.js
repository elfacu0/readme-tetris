const mongoose = require('mongoose');

const TetrisSchema = new mongoose.Schema({
    topScore: Number,
    currScore: Number,
    board: String,
    tetromino: String,
    nextTetromino: String,
});

module.exports = mongoose.model('Tetris',TetrisSchema);