i have learnt new concepts like 

new Error(`write here anything and this is going to be accessed by only function have err in the arguments and must be utilised by the app is more important`)


const errorHandler = (err,req,res,next)=>{
    const statusCode = res.statusCode  === 200 ? 500 : res.statusCode;
    res.status(statusCode)
    res.json({
        message:err.?message,
        stack:err.?stack
    })
}

asyncHandler from express-async-handler which helps to use when you are dealing with async functions



again when you want to change anything in the database before doing that we can a function called 
pre() function which helps to modify the details as you required pre('save',async function(){
    this.password = bcrypt.hash(this.password,bcrypt.genSaltSync(10))
})

this will modify your password before going too insert into mongodb


 <Multiselect className="form-control my-3" name="color" dataKey="id" textField="color" placeholder={'Select Any Color'}
                data={colorState.map((element,i)=>{
                  return element.title
                })}
                onChange={e=>setColor(e)}
                />



const error = (err,req,res,next)=>{
    res.json({
        stack:err.stack,
        message:err.message
    })
}