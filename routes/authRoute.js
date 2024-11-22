const express = require('express');
const { createUser, loginUser, getallUser,saveAddress, getaUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logoutUser, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishList, userCart } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.post("/cart",authMiddleware, userCart);
router.post("/forgot-pass-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
router.get("/logout", logoutUser);
router.get("/refresh", handleRefreshToken);
router.get("/all-users", getallUser);
router.get("/single-user/:id", authMiddleware, isAdmin, getaUser);
router.get("/wishlist", authMiddleware, getWishList);
router.delete("/delete-user/:id", deleteUser);
router.put("/update-user", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);


module.exports = router;