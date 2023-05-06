const route = require('express').Router();
const auth_middlewares = require('../middlewares/auth.middlewares');


route.get('dashboard', auth_middlewares.verifyToken, (req, res) => {

    // Send response
    return res.json({ status: true,message: 'Access granted'});
  
});
module.exports = route;