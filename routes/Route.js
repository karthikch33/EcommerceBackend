import { Router } from "express";
import { addToCompare, applyCoupon, blockuser, createOrder, createUser,deleteUser,emptyCart,emptyEntireCart,forgotPasswordToken,getAllOrders,getCompareItems,getOrders,getUserCart,getWishlist,getaUser,getallUser,handleRequestToken,loginAdmin,loginUserCtrl, logoutHandler, resetPassword, saveAddress, serveronoroff, unblockuser, updateOrderStatus, updatePassword, updateUser, userCart, } from "../controllers/UserCtrl.js";
import { authMiddleWare, isAdmin } from "../middlewares/authMiddleware.js";
import { checkout, paymentVerification } from "../controllers/paymentCtrl.js";


const router = Router()


router.route('/register').post(createUser)
router.route('/login').post(loginUserCtrl)
router.route('/serveronoroff').get(serveronoroff)
router.route('/adminlogin').post(loginAdmin)
router.route('/handlerequesttoken').get(handleRequestToken)
router.route('/allusers').get(getallUser)
router.route('/addcompareitem/:productId').put(authMiddleWare,addToCompare)
router.route('/getallcompareitems/:id').get(getCompareItems)
router.route('/updatepassword').put(authMiddleWare,updatePassword)
router.route('/logout').get(logoutHandler)
router.route('/order/checkout').post(authMiddleWare,checkout)
router.route('/order/paymentverification').post(authMiddleWare,paymentVerification)
router.route('/getorders').get(authMiddleWare,getOrders)
router.route('/getallorders').get(authMiddleWare,isAdmin,getAllOrders)
router.route('/resetpassword/:token').put(resetPassword)
router.route('/forgotpassword').post(forgotPasswordToken)
router.route('/getuser').get(authMiddleWare, getaUser)
router.route('/getwishlist/:id').get(authMiddleWare, getWishlist)
router.route('/deleteuser/:id').delete(deleteUser)
router.route('/updateuser').put(authMiddleWare,updateUser)
router.route('/saveaddress/:id').put(authMiddleWare,saveAddress)    
router.route('/blockuser/:id').put(authMiddleWare,isAdmin,blockuser)
router.route('/unblockuser/:id').put(authMiddleWare,isAdmin,unblockuser)
router.route('/cart').post(authMiddleWare,userCart)
router.route('/getcart/:id').get(authMiddleWare,getUserCart)
router.route('/emptycart/:_id').delete(authMiddleWare,emptyCart)
router.route('/emptyentirecart').delete(authMiddleWare,emptyEntireCart)
router.route('/coupon').post(authMiddleWare,applyCoupon)
router.route('/createOrder').post(authMiddleWare,createOrder)
router.route('/updateorderstatus/:_id').put(authMiddleWare,isAdmin,updateOrderStatus)
export default router