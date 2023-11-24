essentials for Login 

1) checking the user and passwordMatch 

2) giving the refreshToken to the user by updating

3) passing the cookie in the response

4) printing the response in json format


essentials for logout

1) find the cookies 

2) based on refreshtoken find the user 

3) remove the refreshtoken from the db


Note:  We have to pass the dictionary to find() function which helps to check all the conditions


Note: How to change our entire JSON format to String      Use like this JSON.stringify(JSON_BODY)

Note: How to remove keys in the dictionary with specific values
    1) prepare a list with removable elements  [remove1,remove2,remove3,remove4,remove5]
    removableList.forEach(ele=> diction[ele] )

 USING CRYPTO  FOR GENERATION OF TOKENS

    1) At First generate your secret it may be anything i am using crypto again to generate secret
    const secret = crypto.randomBytes(32).toString('hex')

    2) Now create the token using your secret

    const   token = crypto.createHash('sha465').update(secret).digest('hex') 



Writing the Mongodb Increment command

{$inc:{numsViews:1},$dec:{numsViews:2}}
like Blog 

fetch the blog 
fetch the login user
at first liked blog will be false
if he wanted to like then add to likes array  and make 
if he clicks again remove from the likes array
----------------------------------------------------------------------------------------------------------------

const productSchema = new mongoose.schema({

    name:String,

},{timestamps:true})


cloudinary Upload Images

1) requires what files to upload

const uploadImages = (fileToUpload)=>{
    return new Promise((resolve,reject)=>{
        cloundinary.uploader.upload(fileToUpload,(err,result)=>{
            resolve({url:result.secure_url},{resource_type:"auto"})
        })
    })
}