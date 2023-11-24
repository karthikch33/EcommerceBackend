import { Router } from "express";
import { createCategory, deleteCateogry, getCateogry, getallCateogry, updateCategory } from "../controllers/prodcategoryCtrl.js";
import { authMiddleWare, isAdmin } from "../middlewares/authMiddleware.js";
const router = Router()

router.route('/createCategory').post(authMiddleWare,isAdmin,createCategory)
router.route('/updateCategory/:id').put(authMiddleWare,isAdmin,updateCategory)
router.route('/deleteCategory/:id').get(authMiddleWare,isAdmin,deleteCateogry)
router.route('/getCategory/:id').get(getCateogry)
router.route('/getallCategory').get(getallCateogry)






export default router;