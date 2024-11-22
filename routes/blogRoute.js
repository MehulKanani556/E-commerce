const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, disLikeBlog, uploadImages } = require('../controller/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto, blogImageResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/likes', authMiddleware, likeBlog);
router.put('/dislikes', authMiddleware, disLikeBlog);
router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array('images',10),blogImageResize,uploadImages)
router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);
router.get('/:id',  getBlog);
router.get('/',  getAllBlogs);

module.exports = router;