const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// create user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    // console.log(email,!findUser);
    if (!findUser) {
        //create new user

        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error('User Already Exists');

    }
}
);

// login user
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const findUser = await User.findOne({ email: email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    } else {
        throw new Error('Invalid Credentials');
    }
});


// Get all users

const getallUser = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        throw new Error(error);
    }
});


// Get Single user

const getaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});

// Delete user

const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new Error('User not found');
        }
        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});



// Delete user

const updateUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findByIdAndUpdate(id,{
            firstname:req?.body?.firstname,
            lastname:req?.body?.lastname,
            email:req?.body?.email,
            mobile:req?.body?.mobile
        },{
            new:true,
          
        });
     
        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});



module.exports = { createUser, loginUser, getallUser ,getaUser,deleteUser,updateUser};