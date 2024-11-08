const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const expressAsyncHandler = require('express-async-handler');

const authMiddleware =expressAsyncHandler