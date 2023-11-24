import { Router } from "express";
import { createEnquiry, deleteEnquiry, getEnquiry, getallEnquiry, updateEnquiry } from "../controllers/enqCtrl.js";
import { authMiddleWare, isAdmin } from "../middlewares/authMiddleware.js";
const router = Router()

router.route('/createEnquiry').post(authMiddleWare,isAdmin,createEnquiry)
router.route('/updateEnquiry/:id').put(authMiddleWare,isAdmin,updateEnquiry)
router.route('/deleteEnquiry/:id').get(authMiddleWare,isAdmin,deleteEnquiry)
router.route('/getEnquiry/:id').get(getEnquiry)
router.route('/getallEnquiry').get(getallEnquiry)

export default router;