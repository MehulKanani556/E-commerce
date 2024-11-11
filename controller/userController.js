const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
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
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            { refreshToken: refreshToken },
            { new: true }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            role: findUser?.role,
            token: generateToken(findUser?._id)
        });
    } else {
        throw new Error('Invalid Credentials');
    }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookie');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error('Invalid Refresh Token');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {

        if (err || user.id !== decoded.id) {
            throw new Error('There is something wrong with refresh token');
        }
        const accessToken = generateToken(user._id);
        res.json({ accessToken })
    })
});


// Logout functionality

const logoutUser = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookie');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204); // forbidden
    }
    console.log(refreshToken);
    await User.findOneAndUpdate({ refreshToken: refreshToken }, {
        refreshToken: "",
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    res.sendStatus(204); // forbidden

    // res.json({ message: 'Logged Out' });
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
    const { id } = req.params;
    validateMongoDbId(id);
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
    const { id } = req.params;
    validateMongoDbId(id);
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



// Update user

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, {
            new: true,

        });

        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const block = await User.findByIdAndUpdate(id, { isBlocked: true }, {
            new: true,
        });
        res.json(block);
    } catch (error) {
        throw new Error(error);
    }
})
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const unblock = await User.findByIdAndUpdate(id, { isBlocked: false }, {
            new: true,
        });
        res.json(unblock);
    } catch (error) {
        throw new Error(error);
    }
})


module.exports = { createUser, loginUser, getallUser, getaUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logoutUser };