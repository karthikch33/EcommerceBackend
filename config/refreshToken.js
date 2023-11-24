import jwt from 'jsonwebtoken'

const generateRefreshToken = (id)=>{
    const newtoken = jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:'1d'})
    return newtoken
}

export default generateRefreshToken