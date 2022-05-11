const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = require('../models/user');
const route = express.Router();

route.post('/signup', async (req, res) => {

    const {email, password, phone, gender} = req.body;
    if(!email || !password || !phone || !gender)
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    
    try{
        const valid = /@gmail.com/.test(email);
        if(!valid)
          return res.status(400).send({status: 'error', msg: 'invalid email'});
                
        if(password.length < 7)
          return res.status(400).send({status: 'error', msg: 'password must be greater than 6 characters'});

        const bpassword = await bcrypt.hash(password, 10);
        let user = new User;
        const token = await jwt.sign({ 
          id: user._id, 
          username: email
        }, process.env.JWT_SECRET)
        
        console.log(token);

        user.email = email;
        user.password = bpassword;
        user.phone = phone;
        user.gender = gender;
        user.token = token;
        user = await user.save();
        return res.status(200).send({status: 'ok', msg: 'User created successfully', user});
    }
    catch(err){
        console.log(err);
        return res.status(400).send({status: 'error', msg: 'Some error occured', err});
    }
})

route.post('/login', async (req, res) => {
  const { email, password, _id, token} = req.body;

  try{
      if(!email || !password ||!token )
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
      
    let user = await User.findOne({_id}).lean();
    if(!user)
      return res.status(400).send({status: 'error', msg: 'User not found'});

    if(await bcrypt.compare(user.password, password)){
      res.status(200).send({status: 'ok', msg: 'Login Successful', user});

    }else{
      res.status(400).send({ status: 'error', msg: 'username or password incorrect'});
    }
  }  
  catch(err){
    console.log(err);
    return res.status(400).send({status: 'error', msg: `Some error occured ${err}`});
  }
})

module.exports = route;