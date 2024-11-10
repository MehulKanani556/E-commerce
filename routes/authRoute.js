const express = require('express');
const { createUser, loginUser, getallUser, getaUser, deleteUser, updateUser } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post("/register",createUser);
router.post("/login",loginUser);
router.get("/all-users",getallUser);
router.get("/single-user/:id", authMiddleware,isAdmin,getaUser);
router.delete("/delete-user/:id",deleteUser);
router.put("/update-user/:id",updateUser);


module.exports = router;