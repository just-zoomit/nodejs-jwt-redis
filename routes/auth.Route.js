const route = require('express').Router();
const user_controller = require('../controllers/user.controller');
const auth_middlewares = require('../middlewares/auth.middlewares');

route.post('/register', user_controller.Register);

route.post('/login', user_controller.Login);
route.post('/token', auth_middlewares.verifyRefreshToken, user_controller.GetAccessToken);
route.get('logout', auth_middlewares.verifyToken, user_controller.Logout);
module.exports = route;