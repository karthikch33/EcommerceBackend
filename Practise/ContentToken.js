import jwt from 'jsonwebtoken'

const token = async function(id){
    const t = jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
    return t
}