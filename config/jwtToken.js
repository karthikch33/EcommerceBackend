import jwt from 'jsonwebtoken'


const generateToken = (id) =>{
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '10s' });
}

export default generateToken

