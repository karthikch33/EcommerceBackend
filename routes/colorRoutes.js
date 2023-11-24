import {Router} from 'express'
import { createColor, deleteColor, getAllColors, getColor, updateColor } from '../controllers/colorCtrl.js'
import { authMiddleWare, isAdmin } from '../middlewares/authMiddleware.js'

const router = Router()

router.route('/createcolor').post(authMiddleWare, isAdmin, createColor)
router.route('/updatecolor/:id').put(authMiddleWare,isAdmin,updateColor)
router.route('/deletecolor/:id').delete(authMiddleWare,isAdmin,deleteColor)
router.route('/getcolor/:id').get(getColor)
router.route('/getallcolor').get(getAllColors)

export default router;