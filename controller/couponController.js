const Coupon = require('../models/couponModel');
const validateMongoDbId = require('../utils/validateMongodbId');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllCoupon = asyncHandler(async (req, res) => {
    try {
        const getCoupons = await Coupon.find();
        res.json(getCoupons);
    } catch (error) {
        throw new Error(error);
    }
});

const getCoupon = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const getCoupon = await Coupon.findById(id);
        res.json(getCoupon);
    } catch (error) {
        throw new Error(error);
    }
});


const updateCoupon = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedCoupon);
    } catch (error) {
        throw new Error(error);
    }
});
const deleteCoupon = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletedCoupon);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = { createCoupon, getAllCoupon, getCoupon, updateCoupon, deleteCoupon };