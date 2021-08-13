require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const uri = process.env.MONGOOSE_URI;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.once('open',()=>{
    console.log("connecting to db");
});

app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.redirect('https://github.com/elfacu0');
});

const PlayRoute = require('./routes/Play');
app.use('/play',PlayRoute);


app.listen(process.env.PORT || 3000 ,console.log("start"));