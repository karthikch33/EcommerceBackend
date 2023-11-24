import { Router } from "express";
import { createProduct, deleteProduct, getaProduct,getAllProducts, updateProduct, addToWishList, rating, } from "../controllers/ProductCtrl.js";
import { authMiddleWare, isAdmin } from "../middlewares/authMiddleware.js";
const router = Router()

router.route('/').post(authMiddleWare, isAdmin,createProduct)
router.route('/getproduct/:id').get(getaProduct)
router.route('/getallproducts').get( getAllProducts)
router.route('/updateproduct/:id').put(authMiddleWare, isAdmin, updateProduct)
router.route('/deleteaproduct/:id').delete(authMiddleWare, isAdmin, deleteProduct)
router.route('/wishlist').put(authMiddleWare,addToWishList)
router.route('/rating').put(authMiddleWare,rating)
export default router   