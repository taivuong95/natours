const User =require('./../models/userModel');
const jwt = require('jsonwebtoken')

exports.signup = async (req, res, next) => {
    const newUser = await User.create(req.body);

    const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })

    res.status(201).json({
        status:'success',
        token:token,
        data:{
            user: newUser
        }
    })
}

exports.login = (req, res, next) => {
    const {email, password} = req.body;
    
    // 1) Check if email and password exist

    // 2) Check if user exists && password is correct

    // 3) If everything is ok, send token to client
}