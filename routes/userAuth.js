var express = require('express');
var router = express.Router();
var user = require('../controllers/users');
var validation = require('../validation/input_validation');
var auth = require('../auth/verifyToken');

/* routing for user registration for all three type */
router.post('/userRegistration',validation.userRegistrationValidation,user.userRegistration);

/*routing for user registration for all three type and social login*/
router.post('/login',validation.userLoginValidation,user.userLogin);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
