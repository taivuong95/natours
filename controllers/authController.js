const {promisify}  = require('util')
const User =require('./../models/userModel');
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

exports.signup = async (req, res, next) => {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id)

    res.status(201).json({
        status:'success',
        token:token,
        data:{
            user: newUser
        }
    })
}

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    
    // 1) Check if email and password exist
    if(!email || !password){
       return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({email}).select('+password');
    const correct = await user.correctPassword(password, user.password);

    if(!user || !correct){
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything is ok, send token to client

    const token = signToken(user._id);
    res.status(200).json({
        status:'success',
        token
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // 1) Getting token and check of it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
         token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.', 401))
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user belonging to this token does not exist.', 401));
    }

    // 4) Check if user change password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please login again!', 401))
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser
    next();
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role = 'user'
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action.', 403))
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on  Posted email address
    const user = await User.findOne({ email: req.body.email});
    if(!user){
        return next(new AppError('There is no user with this email address.', 404))
    }
    // 2) Generate the random reset token 
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email!`
try {
    await sendEmail({
        email: user.email,
        subject:'Your password reset token (valid for 10 min)',
        message
    })
    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
    })
} catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save({validateBeforeSave: false});

    return next(new AppError('There was an error sending the email. Try again later.'), 500);
}
   
});

exports.resetPassword = async(req, res, next) => {
    //aaaaaaaaaaaaa
    console.log('abc');
    
}