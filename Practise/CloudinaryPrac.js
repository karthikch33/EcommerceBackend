import {v2 as cloudinary} from 'cloudinary'



const cloudinaryUploadImg = (fileToUpload) =>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(fileToUpload,(err,result)=>{
            resolve({
                public_id:result.public_id,
                url:result.secure_url,
                asset_url:result.secure_url
            },{resourcetype:"auto"})
        })
    })
}


const cloudinaryUploadImg2 = (fileToUpload) =>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(fileToUpload,(err,result)=>{
            resolve({url:result.secure_url})
        })
    })
}


