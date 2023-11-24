import express from 'express'
import dotenv from 'dotenv/config'
import cors from 'cors'
import bodyParser from 'body-parser'
import { notFound, errorHandler } from './middlewares/ErrorHandler.js'
import router1 from './routes/Route.js'
import router2 from './routes/productRoutes.js'
import router3 from './routes/blogRoutes.js'
import router4 from './routes/prodcategoryRoutes.js'
import router5 from './routes/blogcategoryRoutes.js'
import router6 from './routes/brandRoute.js'
import router7 from './routes/couponRoutes.js'
import router8 from './routes/colorRoutes.js'
import router9 from './routes/enqRoutes.js'
import router10 from './routes/uploadRoute.js'
import dbConnect from './config/dbConnect.js'
import path from 'path'
import morgan from 'morgan'
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'

const app = express()
const PORT = process.env.PORT || 8080

const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


 
app.use(cookieParser())
app.use('/api/user',router1)
app.use('/api/product',router2)
app.use('/api/blog',router3)
app.use('/api/category',router4) 
app.use('/api/blogcategory',router5)
app.use('/api/brand',router6)
app.use('/api/coupon',router7)
app.use('/api/color',router8)
app.use('/api/enquiry',router9)
app.use('/api/upload',router10)

// const __dirname1 = path.resolve()
// if(process.env.NODE_ENV === 'production')
// {
//     app.use(express.static(path.join(__dirname1,'../frontend/build')))
//     app.get('*',(req,res)=>{
//         res.sendFile(path.resolve(__dirname1,'../frontend','build','index.html'))
//     })
// }
// else{
//     app.get('/',(req,res)=>{
//         res.send('API Is Running')
//     })
// }

app.use(notFound)
app.use(errorHandler)





dbConnect() 
.then(()=>{
    console.log("DB Connection Successfull")
    app.listen(PORT,()=>{
        console.log(`Server is running at PORT ${PORT}`)
    })
})
.catch(e=>console.log("DB Connection Lost"))