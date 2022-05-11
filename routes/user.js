const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = require('../models/user');
const route = express.Router();


route.post('/edit', async (req, res) => {
    const { email, password, phone, token, _id, gender } = req.body;

    try{
        let user = await jwt.verify(token, process.env.JWT_SECRET);
        if(!user)
          return res.status(400).send({status: 'error', msg: 'Nice try champ'});

        const dpassword = await bcrypt.hash(password, 10);
         user = await User.findOneAndUpdate({_id}, {
            password: dpassword ? dpassword : user.password,
            email: email || user.email,
            phone: phone ? phone : user.phone, 
            gender: gender ? gender : user.gender
        }, {new: true});
        user = await user.save();

        return res.status(200).send({status: 'ok', msg: 'User update Success', user});
    }
    catch(err){
        console.log(err);
        return res.status(400).send({status: 'error', msg: 'Some error occured', err});
    }
    
})

module.exports = route;