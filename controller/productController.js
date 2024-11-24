const Product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const fs = require('fs');

const slugify = require('slugify');
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require('../utils/cloudinary');
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title, { lower: true });
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error);
    }

});


const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title, { lower: true });
        }

        const update = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json(update);
    } catch (error) {
        throw new Error(error);
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const del = await Product.findByIdAndDelete(id);
        res.json(del);
    } catch (error) {
        throw new Error(error);
    }
})

const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProduct = asyncHandler(async (req, res) => {
    try {

        // Filtering
        const queryObject = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        const obj = excludeFields.forEach((el) => delete queryObject[el]);

        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        let qry = Product.find(JSON.parse(queryStr));

        // Sorting

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            qry = qry.sort(sortBy);
        } else {
            qry = qry.sort('-createdAt');
        }

        // Limiting the field

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            qry = qry.select(fields);
        } else {
            qry = qry.select('-__v');
        }

        // Pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        qry = qry.skip(skip).limit(limit);
        if (req.query.page) {
            const totalCount = await Product.countDocuments();
            if (skip >= totalCount) throw new Error('This page does not exists');
        }

        const products = await qry;
        res.json(products);
    } catch (error) {
        throw new Error(error);
    }
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: prodId },
            }, { new: true });
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(_id, {
                $push: { wishlist: prodId },
            }, { new: true });
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});

const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === _id.toString());
        if (alreadyRated) {
            const updateRating = await Product.updateOne({
                ratings: { $elemMatch: alreadyRated },
            }, {
                $set: { "ratings.$.star": star, "ratings.$.comment": comment }
            }, { new: true });
        } else {
            const rateProduct = await Product.findByIdAndUpdate(prodId, {
                $push: {
                    ratings: {
                        star: star,
                        comment: comment,
                        postedBy: _id
                    }
                }
            }, { new: true });
        }
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingSum = getallratings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingSum / totalRating);
        let finalProduct = await Product.findByIdAndUpdate(prodId, {
            totalRating: actualRating
        }, { new: true });
        res.json(finalProduct);
    } catch (error) {
        throw new Error(error);
    }
});


const uploadImages = asyncHandler(async (req, res) => {

    try {
        const uploader = (path) => cloudinaryUploadImg(path, 'images');
        const urls = [];
        const files = req.files;
        for (let file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        const images = urls.map(file => {
            return file
        });
        res.json(images);
        // const findProduct = await Product.findByIdAndUpdate(id, { images: urls.map(file => { return file }) }, { new: true });
        // res.json(findProduct)

    } catch (error) {
        throw new Error(error)
    }
});

const deleteImages = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const deleted = cloudinaryDeleteImg(id, 'images');
        res.json({ message: 'Deleted' });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages, deleteImages };