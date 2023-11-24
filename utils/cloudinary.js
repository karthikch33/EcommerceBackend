import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_APIKEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});

const cloudinaryUploadImg = (fileToUpload) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUpload, (error, result) => {
                resolve({
                    url:result.secure_url,
                    asset_id:result.asset_id,
                    public_id:result.public_id
                },{resource_type : "auto"})
        });
    });
};


export const cloudinaryDeleteImg = (fileToDelete)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.destroy(fileToDelete,(err,result)=>{
            resolve({
                url:result.secure_url,
                asset_id:result.asset_id,
                public_id:result.public_id
            },{resource_type:"auto"})
        })
    })
}


export default cloudinaryUploadImg