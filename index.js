const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config();

const app = express();

mongoose.connect('mongodb://localhost:27017/usersystemdb')
.catch(error => console.log(`DB connection error: ${error}`));

const con = mongoose.connection;

con.on('open', error => {
    if(!error)
      console.log('DB connection successful');
    else{
        console.log(`Error connecting to DB: ${error}`)
    }
});

app.use(express.json());
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running at Port: ${PORT}`));