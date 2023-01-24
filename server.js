const express = require('express');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const dbRouter = require('./db.js');
const pagesRouter = require('./pages.js');
app.use('/static', express.static('static'))
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/db', dbRouter);
app.use('/', pagesRouter);


mongoose.connect(process.env.DB_LINK);
app.listen(6232,() => console.log("Listening"));




