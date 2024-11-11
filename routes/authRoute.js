const express = require('express');
const { createUser, loginUser, getallUser, getaUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logoutUser } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/refresh", handleRefreshToken);
router.get("/all-users", getallUser);
router.get("/single-user/:id", authMiddleware, isAdmin, getaUser);
router.delete("/delete-user/:id", deleteUser);
router.put("/update-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);


module.exports = router;