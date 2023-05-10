
const jwt = require('jsonwebtoken');

const redisClient = require('../redis_connect');

// Custom middleware
function verifyToken(req, res, next) {
    try {
        // Bearer tokenstring
        const token = req.headers.authorization.split(' ')[1];

        console.log('verifyToken - token ', token)

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        console.log('decoded ', decoded)
        req.userData = decoded;

        req.token = token;

        console.log("verifyToken - decoded ", decoded.sub.toString())

        // varify blacklisted access token.
        redisClient.get('BL_' + decoded.sub.toString(), (err, data) => {
            console.log("verifyToken - DATA ", data)
            if(err) throw err;

            if(data === token) return res.status(401).json({status: false, message: "blacklisted token."});
            next();
        })

        next();

    } catch (error) {
        return res.status(401).json({status: false, message: "Your session is not valid.", data: error});
    }
}

function verifyRefreshToken(req, res, next) {
    const token = req.body.token;

    if(token === null) return res.status(401).json({ status:false, message: 'Invalid Refresh Token'})
   

    try {
    console.log("verifyRefreshToken - token ", token)
         
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
    req.userData = decoded;
    console.log("verifyRefreshToken - decoded ", req.userData )

    //Redis Store Check
    //decoded.sub.toString() is the username
    redisClient.get(decoded.sub.toString(), (err, data) => {
        console.log("verifyRefreshToken - DATA ", data)
        if(err) throw err;

        console.log("verifyRefreshToken - data ", data)

        if(data === null) return res.status(401).json({status: false, message: "Invalid request. Token is not in store."});
        if(JSON.parse(data).token != token) return res.status(401).json({status: false, message: "Invalid request. Token is not same in store."});

        next();
        
    })

    } catch (error) {

        return res.status(401).json({status: true, message: "Your session is not valid.", data: error});
    }

}

module.exports = { verifyToken, verifyRefreshToken };