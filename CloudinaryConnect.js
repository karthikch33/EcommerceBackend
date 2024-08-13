import multer from "multer"
import {dirname} from 'path'
import path from 'path'
import fs from 'fs'
import sharp from "sharp"
import cloudinaryUploadImg, { cloudinaryDeleteImg } from "./utils/cloudinary"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'/photos/images'))
    },
    filename:function(req,file,cb){
        const unqname = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + unqname + '.jpeg')
    }
})

const filterimg = (req,file)=>{
    if(file.mimetype.startsWith('images')) cb(null,true)
    else{
cb({
        message:'unsupported file type'
    }) 
}
}

const reducesize =async (req,res,next)=>{
    if(!req.files) next()
    await Promise.all(
        req.files.map(async(file)=>{
            await sharp(file.filename).resize(300,300).toFormat('jpeg').jpeg({quality:90}).toFile(`photos/images/${file.filename}`)
            fs.unlinkSync(`photos/images/${file.filename}`)
        })
    )
}

const uploadtocloud =async (req,res,next)=>{
    if(!req.files) next()
    const uploader = (path)=> cloudinaryUploadImg(path,'images')
    const files = req.files
    const urls = []
    for(const file of files){
        const {path} = file 
        const newpath = await uploader(path)
        urls.push(newpath)
        fs.unlinkSync(path)
    }
    const images = files.map((file)=>{return file})
    res.json(images)
}

const deletefromcloud =async (req,res,next)=>{
    if(!req.file) next()
        const {path} = file
    const deletefromcloud = await cloudinaryDeleteImg(path,'images')
    res.json({message:deletefromcloud})
}


const upload = multer({
    storage:store,
    filter:filterimg,
    limits:{fileSize:200000}
})