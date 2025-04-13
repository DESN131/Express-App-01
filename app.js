const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');

const Router = require('./app/routes');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', true);
morgan.token('remote-ip', req => req.ip);
morgan.token('local-time', function () {
    return new Date().toLocaleString();
});
app.use(morgan(':local-time :remote-ip :method :url :status :res[content-length] - :response-time ms'));
  

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app', 'views'));

app.use('/', Router);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
