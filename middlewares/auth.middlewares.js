
const jwt = require('jsonwebtoken');

const redisClient = require('../redis_connect');

// Custom middleware
function verifyToken(req, res, next) {

    try {
         // Get JWT from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userData = decoded;
    next();        
    } catch (error) {

        return res.status(401).json({ status:false, message: 'Invalid Access Token', data: error})
    }

}

function verifyRefreshToken(req, res, next) {
    const token = req.body.token;

    if(!token) {
        return res.status(401).json({ status:false, message: 'Invalid Refresh Token', data: error})
    }

    try {
         
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.userData = decoded;

    //Redis Store Check
    //decoded.sub.toString() is the username
    redisClient.GET(decoded.sub.toString(), (err, data) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ status:false, message: 'Something went wrong'})
        }
        if(data === null ) return res.status(401).json({ status:false, message: 'Token is not in STORE'})

        if(JSON.parse(data) !== token) return res.status(401).json({ status:false, message: 'Token is not same in STORE'})

        next()
        
    })

    } catch (error) {

        return res.status(401).json({ status:true, message: 'Your Session is not valid', data: error})
    }

}

module.exports = { verifyToken, verifyRefreshToken };