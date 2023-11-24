import { Router } from "express";
import { createBlog, deleteBlog, dislikeBlog, getAllBlogs, getBlog, likeBlog, updateBlog, uploadImages } from "../controllers/blogCtrl.js";
import {authMiddleWare,isAdmin} from '../middlewares/authMiddleware.js'
import uploadPhoto, { blogImgResize, productImgResize } from "../middlewares/uploadImages.js";
const router = Router()

router.route('/').post(authMiddleWare,isAdmin,createBlog)
router.route('/updateblog/:id').put(authMiddleWare,isAdmin,updateBlog)
router.route('/getblog/:id').get(getBlog)
router.route('/getallblogs').get(getAllBlogs)
router.route('/deleteblog/:id').delete(authMiddleWare,isAdmin,deleteBlog)
router.route('/likes').put(authMiddleWare,likeBlog)
router.route('/dislikes').put(authMiddleWare,dislikeBlog)
router.route('/upload/:id').put(authMiddleWare,isAdmin,uploadPhoto.array('images',10),blogImgResize,uploadImages)

export default router;