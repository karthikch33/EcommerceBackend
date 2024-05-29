import jwt from 'jsonwebtoken'

const generateRefreshToken = (id)=>{
    const refreshToken  = jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:'6d'})
    return refreshToken
}

export default generateRefreshToken