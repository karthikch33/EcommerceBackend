import { Router } from "express";
import { authMiddleWare, isAdmin } from "../middlewares/authMiddleware.js";
import uploadPhoto, { productImgResize } from "../middlewares/uploadImages.js";
import { deleteImages, uploadImages } from "../controllers/uploadCtrl.js";

const router = Router()

router.route('/').post(authMiddleWare,isAdmin,uploadPhoto.array('images',10),productImgResize,uploadImages)
router.route('/deleteimages/:id').delete(authMiddleWare,isAdmin,deleteImages)

export default router