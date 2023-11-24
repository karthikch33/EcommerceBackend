import { Router } from "express";
import { createBrand, deleteBrand, getBrand, getallBrand, updateBrand } from "../controllers/brandCtrl.js";
import { authMiddleWare, isAdmin } from "../middlewares/authMiddleware.js";
const router = Router()

router.route('/createBrand').post(authMiddleWare,isAdmin,createBrand)
router.route('/updateBrand/:id').put(authMiddleWare,isAdmin,updateBrand)
router.route('/deleteBrand/:id').get(authMiddleWare,isAdmin,deleteBrand)
router.route('/getBrand/:id').get(getBrand)
router.route('/getallBrand').get(getallBrand)






export default router;