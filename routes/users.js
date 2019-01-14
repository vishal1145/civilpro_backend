var express = require('express');
var router = express.Router();
var user = require('../controllers/users');
var validation = require('../validation/input_validation');
var auth = require('../auth/verifyToken');

/* routing for user registration for all three type */
//router.post('/userRegistration',validation.userRegistrationValidation,user.userRegistration);

/*routing for user registration for all three type and social login*/
//router.post('/login',validation.userLoginValidation,user.userLogin);

/* routing to get states field */
router.get('/statesList',user.statesList);

/* routing to get cities field */
router.get('/citiesList',user.citiesList);

/* routing to get countries field */
router.get('/countriesList',user.countriesList);

/* routing for forgot password */
router.post('/forgotPassword',validation.forgotPassword,user.forgotPassword);

/* routing for complete profile after registration */
router.post('/completeProfile',validation.completeProfileValidation,user.completeProfile);

/* routing for resend otp*/
router.post('/resendOtp',validation.resendOtpValidation,user.resendOtp);

/*routing for verify otp*/
router.post('/verifyOtp',validation.verifyOtpValidation,user.verifyOtp);

/*routing for user logout*/
router.post('/logout',validation.userLogout,user.logout);

/* routing for user search city*/
router.post('/serchCity',validation.searchCity,user.serchCity);

/* routing for gender api*/
router.get('/gender',user.gender);

/*routing for client category list*/
router.get('/clientCategory',user.clientCategory);

/*routing for agency category list*/
router.get('/agencyCategory',user.agencyCategory);

/*routing for professional level category list*/
router.get('/level',user.professionalLevel);

/*routing for professional level category list*/
router.post('/profession',validation.profession,user.profession);

/*routing for hire professional api*/
router.post('/hireProfessional',user.hireProfessional);

/*routing for nearby location*/
router.post('/nearMe',validation.nearMeValidation,user.nearMe);

/*routing for phone code api*/
router.get('/phoneCode',user.phoneCode);

/*routing for language api*/
router.get('/language',user.language);

/*routing for favourite city api*/
router.get('/favCity',user.favCity);

/*routing for Hair color api*/
router.get('/hairColor',user.hairColor);

/*routing for eye color api*/
router.get('/eyeColor',user.eyeColor);

/*routing for model type api*/
router.get('/model_type',user.model_type);

/*routing for advance search api*/
router.post('/advanceSearch',validation.advanceSearch,user.advanceSearch);

router.post('/dataFilters',user.dataFilters);

/*routing for hair length api*/
router.get('/hairLength',user.hairLength);

/*routing for hair type api*/
router.get('/hairType',user.hairType);

/*routing for add and remove from favourite api*/
router.post('/favourite',validation.addAndRemoveFavourite,user.addAndRemoveFavourite);

/*routing for my favourite list api*/
router.post('/myfavourite',user.myFavouriteList);

/*routing for user details list api*/
router.post('/userDetails',user.userDetails);

//router.post('/fullProfileClient',validation.fullProfileClient,user.fullProfileClient);
//router.post('/fullProfileAgency',validation.fullProfileAgency,user.fullProfileAgency);
router.post('/fullProfile',validation.fullProfileProfessional,user.fullProfile);
router.post('/bookingRequest',user.bookingRequest);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
