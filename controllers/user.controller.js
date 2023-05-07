const User = require('../models/user.model');
const redisClient = require('../redis_connect');

async function Register(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    try {
        const saved_user = await user.save()
        res.json({status: true, message: 'User saved successfully', data: saved_user});
        
    } catch (error) {
        // log the error in DB
        res.status(400).json({status: false, message: "Something Went Wrong", data:error});
    }
    
}

async function Login (req, res) {

    // Authenticate User
    const username = req.body.username;
    // encrypt password!
    const password = req.body.password;

    try {
        const user = await User.findOne({username: username, password: password}).exec();

        if(user === null) return res.json({status: false,message: 'Invalid Username or Password,check again'});

          // Create JWT
        // can add token requirements here to frist part of jwt.sign
        const access_token = jwt.sign({sub: user._id},process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_TIME}) // payload
        const refresh_token = generateRefreshToken(user._id);
        return res.json({status: true, message:  'Login Successful', data:{access_token: access_token, refresh_token: refresh_token}});
           
        
    } catch (error) {
        
    }

    // Send JWT as response
    return res.status(401).json({
        status: true,
        message: 'Login failed'
    });

}

async function Logout(req, res) {

    const user_id = req.userData.sub;

   

    await redisClient.del(user_id.toString());

    // blacklist current access token
    await redisClient.set('BL' + user_id.toString(), req.token);

  

    // Send response
    return res.json({status: true,message: 'Access granted - Logout Successful'});    
}
function GetAccessToken(req, res){

    const user_id= req.userData.sub;
    // can add token requirements here to frist part of jwt.sign
    const access_token = jwt.sign({sub: user_id},process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_TIME}) // payload
    const refresh_token = generateRefreshToken(user_id);

    return res.json({status: true, message:  'Login Successful', data:{access_token: access_token, refresh_token: refresh_token}});

}

function generateRefreshToken(user_id) {

    const refresh_token = jwt.sign({sub: user_id},process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_TIME}) // payload

    redisClient.get(user_id.toString(), (err, data) => {
        if (err) throw err;

        // set refresh token in redis
        redisClient.set(user_id.toString(), JSON.stringify({token: refresh_token}));

        return refresh_token;

    });


    //Verify if token is in array !!!
    let storedRefreshToken = refreshTokens.find((item) => item.username === username );

    if(storedRefreshToken === undefined) {
        //Add refresh token to array
        refreshTokens.push({username: username, token: refresh_token});
    } else {
        //Update refresh token in array
        refreshTokens[refreshTokens.findIndex(x => x.username === username)].token = refresh_token;

    }
    return refresh_token;
}



module.exports = { Register, Login, Logout, GetAccessToken };