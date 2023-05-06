require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require("./config/db");

//connectDB();


//middleware
app.use(express.json());
connectDB();

// routes
const auth_routes = require('./routes/auth.Route');
const user_routes = require('./routes/user.Route');

app.use('/v1/auth', auth_routes);
app.use('/v1/user', user_routes);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

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

