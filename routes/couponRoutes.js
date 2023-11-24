import { Router } from "express";
import { createCoupon, deleteCoupon, getCoupon, getallCoupons, updateCoupon } from "../controllers/couponCtrl.js";
import { authMiddleWare, isAdmin } from "../middlewares/authMiddleware.js";


const router = Router()

router.route('/createcoupon').post(authMiddleWare,isAdmin,createCoupon)
router.route('/allcoupons').get(authMiddleWare,isAdmin,getallCoupons)
router.route('/getcoupon/:id').get(authMiddleWare,isAdmin,getCoupon)
router.route('/updatecoupon/:id').put(authMiddleWare,isAdmin,updateCoupon)
router.route('/deletecoupon/:id').delete(authMiddleWare,isAdmin,deleteCoupon)

export default router