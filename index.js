require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

//middleware
app.use(express.json());

let refreshTokens = [];

// routes

// login route
app.post('/login', (req, res) => {
    // Authenticate User
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) {
        return res.json({
            status: false,
            message: 'Invalid Username or Password'
        });
    } else if(username == 'Donte' && password == 'bot') {
        // Create JWT
        // can add token requirements here to frist part of jwt.sign
        const access_token = jwt.sign({sub: username},process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_TIME}) // payload
        const refresh_token = generateRefreshToken(username);
        return res.json({status: true, message:  'Login Successful', data:{access_token: access_token, refresh_token: refresh_token}});
    }

    // Send JWT as response
    return res.status(401).json({
        status: true,
        message: 'Login failed'
    });
});

app.post('/token', verifyRefreshToken , (req, res) => {

    const username = req.userData.sub;
    // can add token requirements here to frist part of jwt.sign
    const access_token = jwt.sign({sub: username},process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_TIME}) // payload
    const refresh_token = generateRefreshToken(username);

    return res.json({status: true, message:  'Login Successful', data:{access_token: access_token, refresh_token: refresh_token}});

    
});


// dashboard route
app.get('/dashboard', verifyToken,  (req, res) => {

    // Send response
    return res.json({
        status: true,
        message: 'Access granted',
    
    });
  
});

app.get('/logout', verifyToken,  (req, res) => {

    const username = req.userData.sub;

    //remove refresh token from array
    refreshTokens = refreshTokens.filter((item) => item.username !== username);

    // Send response
    return res.json({
        status: true,
        message: 'Access granted - Logout Successful',
    
    });
  
});


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

    //Presist Token: verify if token is in array !!!
    let storedRefreshToken = refreshTokens.find((item) => item.username === decoded.sub);

    if(storedRefreshToken === undefined) return res.status(401).json({ status:false, message: 'Refresh Token Not In Store'})

    if(storedRefreshToken.token != token) return res.status(401).json({ status:false, message: 'Refresh Token is not same in STORE'})

    next();   

    } catch (error) {

        return res.status(401).json({ status:true, message: 'Your Session is not valid', data: error})
    }

}
// Test Flow
// 1. Login with valid credentials
// 2. Copy Refresh Token
// 3. Paste Refresh Token in token endpoint body and get new Access Token
// 4. Send Request twice: First Should be successful, Second should fail with : Refresh Token is not same in STORE
// 3. Test Access Token with Dashboard Endpoint, enter token in Bearer Token
// 4. Access Token expires
// 5. Use Refresh Token to get new Access Token
// 6. Refresh Token expires
// 7. Login again

function generateRefreshToken(username) {

    const refresh_token = jwt.sign({sub: username},process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_TIME}) // payload

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


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});