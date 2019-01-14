const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const request = require('request');
const userValidationSchema = require('./scripts/userScript');

module.exports = {
  userRegistrationValidation: userRegistrationValidation,
  userLoginValidation:userLoginValidation,
  completeProfileValidation:completeProfileValidation,
  resendOtpValidation:resendOtpValidation,
  verifyOtpValidation:verifyOtpValidation,
  forgotPassword:forgotPassword,
  userLogout:userLogout,
  searchCity:searchCity,
  profession:profession,
  advanceSearch:advanceSearch,
  nearMeValidation:nearMeValidation,
  addAndRemoveFavourite:addAndRemoveFavourite,
  myFavouriteList:myFavouriteList,
  fullProfileClient:fullProfileClient,
  fullProfileAgency:fullProfileAgency,
  fullProfileProfessional:fullProfileProfessional,
} 

/** function for user complete profile validation
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function completeProfileValidation(req, res, next) {
    // Get type
    var type = ['Client','Professional','Agency'];
    if (typeof req.body.role_type == 'undefined' || !type.includes(req.body.role_type)) {
        return res.status(422)
          .json({
            status: 'failed',
            message: 'Select role type and wrote in correct way.'
          });
    }

    let role_type = {};
    role_type['Client'] = ['first_name','last_name','latitude','longitude','country','city','category','user_id',];
    role_type['Professional'] = ['first_name','last_name','country','gender','profession','level','user_id','latitude','longitude','dob','city'];
    role_type['Agency'] = ['agency_name','agency_address','country','city','category','user_id','latitude','longitude'];
    
    let sechema = {};
    for(let i = 0; i < role_type[req.body.role_type].length; i++) {
        sechema[role_type[req.body.role_type][i]] = userValidationSchema[role_type[req.body.role_type][i]];
    }

    req.checkBody(sechema);    

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
          // return error if there is validation error
          return res.status(422)
          .json({
            status: 'failed',
            data: result.array(),
            message: 'Validation Failed'
          });
        } else {
          return next();
        }
    });
}

/** function for user registration validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function userRegistrationValidation(req, res, next) {
  req.checkBody({
    'email': {
        notEmpty: {
            errorMessage: 'email is required'
        },
        isEmail: {
            errorMessage: 'Please enter valid email'
        },
        errorMessage: 'email is required'
    },
    'password': {
        notEmpty: {
            errorMessage: 'password is required'
        },
        isLength: {
            options: [{ min: 4, max: 20 }],
            errorMessage: 'Your password contain at least 4 characters'
        },
        errorMessage: 'password is required'
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/** function for user login validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function userLoginValidation(req, res, next) {
    var type = ['facebook','gmail','linkedin','manually'];
    if (typeof req.body.login_type == 'undefined' || !type.includes(req.body.login_type)) {
        return res.status(422)
          .json({
            status: 'failed',
            message: 'Select login_type and wrote in correct way.'
          });
    }

    let login_type = {};
    login_type['facebook'] = [];
    login_type['gmail'] = [];
    login_type['linkedin'] = [];
    login_type['manually'] = ['email','password'];
    
    let sechema = {};
    for(let i = 0; i < login_type[req.body.login_type].length; i++) {
        sechema[login_type[req.body.login_type][i]] = userValidationSchema[login_type[req.body.login_type][i]];
    }

    req.checkBody(sechema);

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/** function for verify otp validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function forgotPassword(req, res, next) {
  req.checkBody({
    'email': {
        notEmpty: {
            errorMessage: 'email is required'
        },
        isEmail: {
            errorMessage: 'Please enter valid email'
        },
        errorMessage: 'email is required'
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/** function for resendotp validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function resendOtpValidation(req, res, next) {
  req.checkBody({
    'user_id': {
        notEmpty: {
            errorMessage: 'user_id is required'
        },
        isLength: {
            options: [{ min: 1, max: 2000 }],
            errorMessage: 'Your id must contain exactly 4 numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'id should only contain at least one numbers'
        },
        errorMessage: 'id is required'
    },
    'phone': {
        notEmpty: {
            errorMessage: 'phone is required'
        },
        isLength: {
            options: [{ min: 20, max: 20 }],
            errorMessage: 'Your id must contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'phone should only contain numbers'
        },
        errorMessage: 'phone is required'
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/** function for verify otp validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function verifyOtpValidation(req, res, next) {
  req.checkBody({
    'user_id': {
        notEmpty: {
            errorMessage: 'user_id is required'
        },
        isLength: {
            options: [{ min: 1, max: 2000 }],
            errorMessage: 'Your id must contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'id should only contain numbers'
        },
        errorMessage: 'id is required'
    },
    'otp': {
        notEmpty: {
            errorMessage: 'otp is required'
        },
        errorMessage: 'otp is required'
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/** function for advance search validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function advanceSearch(req, res, next) {
  req.checkBody({
    'level': {
        notEmpty: {
            errorMessage: 'level is required'
        },
        isLength: {
            options: [{ min: 1 , max: 2000}],
            errorMessage: 'level should contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'level should only contain numbers'
        },
        errorMessage: 'level is required'
    },
    'profession': {
        notEmpty: {
            errorMessage: 'profession is required'
        },
        errorMessage: 'profession is required'
    },
    'city': {
        notEmpty: {
            errorMessage: 'city is required'
        },
        isLength: {
            options: [{ min: 1 , max: 20000 }],
            errorMessage: 'city should contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'city should only contain numbers'
        },
        errorMessage: 'city is required'
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/** function for user logout validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function userLogout(req, res, next) {
  req.checkBody({
    'user_id': {
        notEmpty: {
            errorMessage: 'user_id is required'
        },
        isLength: {
            options: [{ min: 1, max: 2000 }],
            errorMessage: 'id must contain numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'id should contain at least one numbers'
        },
        errorMessage: 'id is required'
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}


/** function for search city vaidation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function searchCity(req, res, next) {
  req.checkBody({
    'country_id': {
        notEmpty: {
            errorMessage: 'country_id is required'
        },
        isLength: {
            options: [{ min: 1, max: 2000 }],
            errorMessage: 'country_id must contain numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'country_id should contain at least one numbers'
        },
        errorMessage: 'country_id is required'
    },
    /*'search': {
        notEmpty: {
            errorMessage: 'search field is required'
        },
        matches: {
            options: [/^[a-zA-Z\s]*$/i],
            errorMessage: 'country_id should contain letters only'
        },
        errorMessage: 'country_id is required'
    },*/
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/** function for profession list validtion
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function profession(req, res, next) {
  req.checkBody({
    'gender_type': {
        notEmpty: {
            errorMessage: 'gender_id is required'
        },
        isLength: {
            options: [{ min: 1, max: 2000 }],
            errorMessage: 'gender_id must contain numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'gender_id should contain at least one numbers'
        },
        errorMessage: 'gender_id is required'
    },
    'parent_id': {
        notEmpty: {
            errorMessage: 'parent_id is required'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'parent_id should contain letters only'
        },
        errorMessage: 'parent_id is required'
    },
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}


/** function for near me validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function nearMeValidation(req, res, next) {
  req.checkBody({
    'latitude': {
        notEmpty: {
            errorMessage: 'latitude is required'
        },
        isLength: {
            options: [{ min: 1 , max: 2000 }],
            errorMessage: 'latitude should only contain numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'latitude should contain at least one numbers'
        },
        errorMessage: 'latitude is required'
    },
    'longitude': {
        notEmpty: {
            errorMessage: 'longitude is required'
        },
        isLength: {
            options: [{ min: 1 , max: 2000 }],
            errorMessage: 'longitude should contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'longitude should only contain numbers'
        },
        errorMessage: 'longitude is required'
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}


/** function for addAndRemoveFavourite validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function addAndRemoveFavourite(req, res, next) {
  req.checkBody({
    'favourite_to': {
        notEmpty: {
            errorMessage: 'favourite_to is required'
        },
        isLength: {
            options: [{ min: 1 , max: 2000 }],
            errorMessage: 'favourite_to should contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'favourite_to should only contain numbers'
        },
        errorMessage: 'favourite_to is required'
    },
    'favourite_by': {
        notEmpty: {
            errorMessage: 'favourite_by is required'
        },
        isLength: {
            options: [{ min: 1 , max: 2000 }],
            errorMessage: 'favourite_by should contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'favourite_by should only contain numbers'
        },
        errorMessage: 'favourite_by is required'
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}


/** function for myFavouriteList validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function myFavouriteList(req, res, next) {
  req.checkBody({
    'role_type': {
        notEmpty: {
            errorMessage: 'role_type is required'
        },
        errorMessage: 'role_type is required'
    },
    'favourite_by': {
        notEmpty: {
            errorMessage: 'favourite_by is required'
        },
        isLength: {
            options: [{ min: 1 , max: 2000 }],
            errorMessage: 'favourite_by should contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'favourite_by should only contain numbers'
        },
        errorMessage: 'favourite_by is required'
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}


/** function for fullProfileClient validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function fullProfileClient(req, res, next) {
  req.checkBody({
    'image': {
        notEmpty: {
            errorMessage: 'image is required'
        },
        errorMessage: 'image is required'
    },
    'portfolio': {
        notEmpty: {
            errorMessage: 'portfolio is required'
        },
        errorMessage: 'favourite_by is required'
    },
   'bio': {
      notEmpty: {
          errorMessage: 'bio is required'
      },
      errorMessage: 'bio is required'
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}


/** function for fullProfileAgency validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function fullProfileAgency(req, res, next) {
  req.checkBody({
    'logo': {
        notEmpty: {
            errorMessage: 'image is required'
        },
        errorMessage: 'image is required'
    },
    'portfolio': {
        notEmpty: {
            errorMessage: 'portfolio is required'
        },
        errorMessage: 'favourite_by is required'
    },
   'bio': {
      notEmpty: {
          errorMessage: 'bio is required'
      },
      errorMessage: 'bio is required'
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/** function for fullProfileProfessional validation
 * 
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function fullProfileProfessional(req, res, next) {
  req.checkBody({
    'image': {
        notEmpty: {
            errorMessage: 'image is required'
        },
        errorMessage: 'image is required'
    },
    'portfolio': {
        notEmpty: {
            errorMessage: 'portfolio is required'
        },
        errorMessage: 'favourite_by is required'
    },
   'bio': {
      notEmpty: {
          errorMessage: 'bio is required'
      },
      errorMessage: 'bio is required'
    },
    'portfolio': {
      notEmpty: {
          errorMessage: 'portfolio is required'
      },
      errorMessage: 'portfolio is required'
    },
    'polaroids': {
      notEmpty: {
          errorMessage: 'polaroids is required'
      },
      errorMessage: 'polaroids is required'
    },
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {  
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'failed',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}
    