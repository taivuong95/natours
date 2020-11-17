
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        // user-767676abc64374-45454743.jpeg
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
    }
});

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }else{
        cb(new AppError('Not an image! Please upload only images', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto =  upload.single('photo');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTS pasword database
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
    }
    
    // 2) Filtered out unwanted fields name that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators:true,
        })
        
        res.status(204).json({
            status:'success',
            data:{
                user: updatedUser
            }
        })
        console.log(updatedUser);
    });
    exports.deleteMe = catchAsync(async (req, res, next) => {
        await User.findByIdAndDelete(req.user.id, {active:false})
        
        res.status(200).json({
            status:'success',
            data:null
        })
    })
    
    
    exports.createUser = (req, res) => {
        res.status(500).json({
            status:'error',
            message:'This route is not defined! Please use /signup instead'
        });
    };
    // Do NOT update password with this!
    exports.getAllUser = factory.getAll(User);
    exports.getUser = factory.getOne(User);
    exports.updateUser  = factory.updateOne(User)
    exports.deleteUser = factory.deleteOne(User)