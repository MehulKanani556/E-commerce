const express = require('express');

const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCoupon, getAllCoupon, getCoupon, updateCoupon, deleteCoupon } = require('../controller/couponController');
const router = express.Router();


router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", getAllCoupon);
router.get("/:id", getCoupon);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);



module.exports = router;