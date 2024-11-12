const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
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
    try {
        const del = await Product.findByIdAndDelete(id);
        res.json(del);
    } catch (error) {
        throw new Error(error);
    }
})


const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
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

        const page =req.query.page;
        const limit =req.query.limit;
        const skip = (page - 1) * limit;
        qry = qry.skip(skip).limit(limit);
        if(req.query.page){
            const totalCount = await Product.countDocuments();
            if(skip>= totalCount) throw new Error('This page does not exists');
        }

        const products = await qry;
        res.json(products);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct };