const express = require('express');
const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages } = require('../controller/productController');
const router = express.Router();
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto,productImageResize } = require('../middlewares/uploadImages');


router.post('/', authMiddleware, isAdmin, createProduct);
router.get('/', getAllProduct);
router.get('/:id', getaProduct);
router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array('images',10),productImageResize,uploadImages)
router.put('/wishlist', authMiddleware,  addToWishlist);
router.put('/rating', authMiddleware,  rating);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;