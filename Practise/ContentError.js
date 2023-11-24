// not found

const error = (err,req,res,next)=>{
    const statusCode = 200 ? 500 : res.statusCode;
    res.send(statusCode)
    res.json({
        message:err?.message,
        stack:err.stack
    })
}

const notfound = (err,req,res,next)=>{
    const statusCode = 200 ? 500 : res.statusCode;
    res.send(statusCode)
    res.json({
        message:err?.message,
        stack:err?.stack
    })
}

// nfound

const nfound = (req,res,next)=>{
    const error = new Error(`The Obtained Error in your request ${req.originalUrl} `)
    res.status(404).send(error)
}


const notf = (req,res,next)=>{
    const error = new Error(`The Original Url ${req.originalUrl}`)
    res.status(404).send(error)
}

const requireError = (err,req,res,next)=>{
    const statusCode = req.statusCode === 200 ? 500: res.statusCode
    res.status(statusCode)
    res.json({
        message:err?.message,
        stack:err?.stack
    })
}
const lasterror = (err,req,res,next)=>{
    const statuscode = req.statusCode === 200 ? 500 : req.statusCode
    res.status(statuscode).json({
        message:err?.message,
        stack:err?.stack
    })
}





const nf = (req,res,next)=>{
    res.status(404).send(new Error(req.originalUrl))
}