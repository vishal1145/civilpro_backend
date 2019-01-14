const mongoose = require('mongoose'); /*Require mongoose package for db*/
const db = require('../models/all-models');/*Require all models*/
const auth = require('../auth/verifyToken');/*Require auth file for jwt token verify*/
const jwt = require('jsonwebtoken');/*Require jwt package*/
const request = require('request');/*Require request package*/
const helper =  require('../helper/helper');/*Requre helper file from helper folder*/
const bcrypt = require('bcrypt-nodejs');/*Require bcrypt-nodejs package to encrypt password*/
const generator = require('generate-password');/*To generate random password*/
const randomnumber = require('random-number');
const moment = require('moment');

module.exports = {
  userRegistration:userRegistration,
  manuallyLogin:manuallyLogin,
  userLogin:userLogin,
  socialLogin:socialLogin,
  checkSocialLoginExistancy:checkSocialLoginExistancy,
  countriesList:countriesList,
  forgotPassword:forgotPassword, 
  statesList:statesList,
  citiesList:citiesList,
  completeProfile:completeProfile,
  resendOtp:resendOtp,
  verifyOtp:verifyOtp,
  logout:logout,
  serchCity:serchCity,
  gender:gender,
  clientCategory:clientCategory,
  agencyCategory:agencyCategory,
  professionalLevel:professionalLevel,
  profession:profession,
  hireProfessional:hireProfessional,
  nearMe:nearMe,
  phoneCode:phoneCode,
  language:language,
  favCity:favCity,
  hairColor:hairColor,
  eyeColor:eyeColor,
  model_type:model_type,
  advanceSearch:advanceSearch,
  dataFilters:dataFilters,
  hairLength:hairLength,
  hairType:hairType,
  addAndRemoveFavourite:addAndRemoveFavourite,
  myFavouriteList:myFavouriteList,
  bookingRequest:bookingRequest,
  userDetails:userDetails,
  bookingRequest:bookingRequest,
  fullProfile:fullProfile,
}


/** Api for user registration professional,client,agency
 * @route /user/userRegester
 * @method post
 * @Param 
 * @response json array
*/
async function userRegistration(req, res, next) {
    /*check email in database*/
    var users = await db.User.findOne({email:req.body.email});
    if (!users) {
        /*covert password in encrypted form*/
        req.body.password = bcrypt.hashSync(req.body.password);
        /*save users information in users collection*/
        var saved_user = await db.User.create(req.body);
            if (saved_user) {
                /* create JWT authorization token */
                var token = await jwt.sign({saved_user},'artistlink321','');
                var options = {
                    min: 1000,
                    max: 9999,
                    integer: true
                }
                let otp = randomnumber(options);
                //saved_user.otp = otp;
                var parameter = {
                    to: saved_user.email,
                    subject:'AL || OTP verification',
                    message: `Your OTP is: ${otp}`,
                    templateName: 'otptemp.jade',
                    otp: otp
                }
                let update_otp = await db.User.update({_id:saved_user._id},{otp:otp});
                let send_mail = await helper.sendEmail(parameter);
                res.status(200).json({
                /*success responce*/
                    status : 'success',
                    message : 'User registered successfully.',
                    auth_token:token,
                    data : saved_user  
                });
            } else {
                /*failed responce*/
                res.status(400).json({
                    status : 'failed',
                    message : 'User not registered.'
                });
            }
    } else {
        /*failed responce*/
        res.status(409).json({
            status : 'failed',
            message : 'User already registered.'
        });
    } 
} 

/** Api for user complete profile on first time login after registration
 * @route /user/completeProfile
 * @method post
 * @Param 
 * @response json array
*/
async function completeProfile(req, res, next) {
    /*check user exists or not in user collection*/
    var user = await db.User.findOne({_id:req.body.user_id});
    if (!user) {
        res.status(200).json({
            status : 'failed',
            message : 'User not exist.',
        });
    } else {
        /*if flag is false then create new entry in collection*/
        if (user.profile_flag == false) {
            var country = await db.Country.findOne({id:req.body.country});
            if (country) {
                /*create entry in regarding collectin*/
                req.body.location = {
                   type: "Point",
                   coordinates: [req.body.longitude, req.body.latitude]
                };
                var userData = await db.User.findOneAndUpdate({_id:req.body.user_id},req.body,{new:true});
                if (req.body.role_type == 'Professional') {
                    var gender = await db.Gender.findOne({id:req.body.gender});
                    if (!gender) {
                        return res.status(400).json({
                            status : 'failed',
                            message : 'Invalid gender id.',
                        }); 
                    }
                }
                if (userData) {
                    /*change falag in user table after comletion of proccess*/
                    let status = await db.User.update({_id:req.body.user_id},{profile_flag: true });
                    res.status(200).json({
                        /*success responce*/
                        status : 'success',
                        message : 'User profile completed.',
                        data : userData
                    });
                } else {
                    res.status(422).json({
                        /*success responce*/
                        status : 'failed',
                        message : 'User profile not completed.',
                    });
                }
            } else {
                res.status(400).json({
                status : 'failed',
                message : 'Country not exists.',
                });   
            }
        } else {
            /*failed responce*/
            res.status(409).json({
                status : 'failed',
                message : 'Already completed Pofile.',
            }); 
        }
    }
}



/** Api for user social signup through linkedin,facebook,gmail
 * @route /user/userLogin
 * @method post
 * @Param 
 * @response json array
*/
async function userLogin(req, res, next) {
    /*get login type*/
    switch (req.body.login_type) {
    
        case 'facebook':
             await socialLogin(req,res,'facebook_id');
            break;
        
        case 'gmail':
            await socialLogin(req,res,'gmail_id');
            break;
        
        case 'linkedin':
            await socialLogin(req,res,'linkedin_id');
            break;
        case 'manually':
            await manuallyLogin(req,res,next); 
            break;
        
        default:
        /*call manuallyLogin function*/
         //await manuallyLogin(req,res,next);   
         res.status(422).json({
            status : 'error',
            message : 'Please enter login_type in correct way',
        });
    }
}


/** function used in user social signup through linkedin,facebook,gmail
 * @route /user/socialLogin
 * @method post
 * @Param 
 * @response json array
*/
async function socialLogin(req, res, key) {
    /*cantain fields which is update during social login or signup*/
    if (typeof req.body.android_device_id != 'undefined') {
        device_id = 'android_device_id';
        var deviceId = req.body.android_device_id;
    } else {
        device_id = 'ios_device_id';
        var deviceId = req.body.ios_device_id;
    }
    var data = {
            [device_id]:deviceId,
            verification_status:true,
            [key]: req.body.social_id
        }; 
    /*if get email and phone both from mobile team in social login*/
    if(req.body.email) {
        /*check or find email exists in db or not*/
        var user = await db.User.findOne({email: req.body.email});
        if (user) {
            /*if r email then update data regarding email*/
            var update = await db.User.update({email:req.body.email},data);
            var token = await jwt.sign({user},'artistlink321','');
            user['token'] = token;
            if(update) {
                res.status(200).json({
                    /*success responce*/
                    status : 'success',
                    message : 'You have logged in successfully.',
                    data : user
                });
            } else {
                /*failed responce*/
                res.status(422).json({
                    status : 'failed',
                    message : 'User not login successfully.'
                });
            }
        } else {
             /*if not then call checkSocialLoginExistancy*/
            await checkSocialLoginExistancy(req,res,key);
        }
        /*if get phone only from mobile team in social login*/
    } else {
        /*if not get any information like email,phone and social id then call checkSocialLoginExistancy*/
        await checkSocialLoginExistancy(req,res,key);
    }
}

/** function check user social login existancy.
 * @route /user/checkSocialLoginExistancy
 * @method post
 * @Param 
 * @response json array
*/
async function checkSocialLoginExistancy(req, res, key) {
    /*check or find social id exists in database or not*/
    var user = await db.User.findOne({[key]: req.body.social_id});
    if (typeof req.body.android_device_id != 'undefined') {
            device_id = 'android_device_id';
            var deviceId = req.body.android_device_id;
        } else {
            device_id = 'ios_device_id';
            var deviceId = req.body.ios_device_id;
        }
    //console.log(user);
    if(user) {
        var data = {
            [device_id]:deviceId,
            verification_status:true,
            [key]: req.body.social_id
        };
        /*if social id find in db then update data*/
        var update = await db.User.update({[key]:req.body.social_id},data);
        var token = await jwt.sign({user},'artistlink321','');
        user['token'] = token;
        if(update) {
            res.status(200).json({
                /*success responce*/
                status : 'success',
                message : 'You have logged in successfully.',
                data : user
            });
        } else {
            /*failed responce*/
            res.status(422).json({
                status : 'failed',
                message : 'User not login successfully.'
            });
        }
    } else {
        /*if not get any information like email,phone and social id then create user*/
        var user_create = await db.User.create({
            [device_id]:deviceId,
            verification_status:true,
            [key]:req.body.social_id
        });
        if (!user_create) {
            /*failed responce*/
            res.status(422).json({
                status : 'failed',
                message : 'User not login successfully.' 
            });
        } else {
            res.status(200).json({
                status : 'success',
                message : 'You have logged in successfully.',
                data : user_create
            });
        }
    }
}



/** Api for user login
 * @route /user/manuallyLogin
 * @method post
 * @Param 
 * @response json array
*/
async function manuallyLogin(req, res, next) {
    /*check or find email exists in database or not*/
    var user_login = await db.User.findOne({email:req.body.email});
    if(!user_login) {
        /* user is not registered */
        res.status(404).json({
            status : 'failed',
            message : 'User not registered. Please register first'
        }); 
    } else {
        //if (user_login.verification_status == true) {
            /* verify password */
            let verify_password = await bcrypt.compareSync(req.body.password, user_login.password);
            if(verify_password) {
                if (typeof req.body.android_device_id != 'undefined') {
                    device_id = 'android_device_id';
                    var deviceId = req.body.android_device_id;
                } else {
                    device_id = 'ios_device_id';
                    var deviceId = req.body.ios_device_id;
                }
                var update = await db.User.update({_id:user_login._id},{  [device_id]: deviceId });
                /* create JWT authorization token */
                var token = await jwt.sign({user_login},'artistlink321','');
                /* user successfully login */
                /*let user = {
                    _id: user_login._id,
                    email: user_login.email
                }*/
                res.status(200).json({
                    status : 'success',
                    message : 'Login successfully.',
                    auth_token : token,
                    data:user_login,
                }); 
            }else {
                /* if password is incorrect */
                res.status(409).json({
                status : 'failed',
                message : 'Password is incorrect.'
                });
            }     
       /* } else {
            res.status(402).json({
                status : 'failed',
                message : 'User not verified.Please verified first.',
                data : user_login
            });
        }*/
        
    }
}

/** Api for user country list
 * @route /user/countriesList
 * @method get
 * @Param 
 * @response json array
*/
async function countriesList(req, res, next) {
    /*find country list in db*/
    var country = await db.Country.find().sort( { id: 1 } );
    if(!country) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'Country list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'Country list found',
        data : country
        });
    }
}


/** Api for user state list
 * @route /user/statesList
 * @method get
 * @Param 
 * @response json array
*/
async function statesList(req, res, next) {
    /*find state list in db*/
    var states = await db.States.find().sort( { id: 1 } );
    if(!states) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'State list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'State list found',
        data : states
        });
    }
}


/** Api for user cities list
 * @route /user/citiesList
 * @method get
 * @Param 
 * @response json array
*/
async function citiesList(req, res, next) {
    /*find city list in db*/
    var city = await db.City.find().sort( { id: 1 } );
    if(!city) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'City list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'City list found',
        data : city
        });
    }
}


/** Api for user forget-password
 * @route /user/forgetPassword);
 * @method post
 * @Param 
 * @response json array
*/
async function forgotPassword(req, res, next) {
    /*find email in database*/
    let user = await db.User.findOne({email:req.body.email});
    /*If email not exists*/
    if(!user) {
        /*failed responce*/
        res.status(409).json({
            status : 'failed',
            message : 'Email not registered. Please enter valid email.'
        });
    } else {
        /*generate random password*/
        let password = generator.generate({
                length: 6,
                numbers: true
        });
        /*convert random generated password in encrypted(hash) form*/
        let hash = await bcrypt.hashSync(password);
         if (!hash) {
            /*failed responce*/
            res.status(409).json({
                status:'failed',
                message : 'Something went wrong'
              });
        } else {
            /*parameter to send email*/
            var parameter = {
                to: req.body.email,
                subject:'Reset || Password',
                message: `Your new password is: ${password}`,
                templateName: 'resettemp.jade',
                password: password
            }
            /*update new generated password in encrypted form in database*/
            let update = await db.User.update({email:req.body.email},{password:hash});
            if(!update) {
                /*failed responce*/
                res.status(409).json({
                    status:'failed',
                    message : 'Password not sent on your email.'
                });  
            } else {
                /*send email on registered email of user*/
                let send_mail = await helper.sendEmail(parameter);/*call helper fuction which is created in helper*/
                /*failed responce*/
                res.status(200).json({
                    status:'success',
                    message : 'Password Sent on your registered email.'
                });
            }
        }
    }  
} 

/** Api for resend otp
 * @route /user/resendOtp
 * @method post
 * @Param 
 * @response json array
*/
async function resendOtp(req, res ,next) {
    /*check user user id and phone number exists or not */
    var user = await db.User.findOne({_id:req.body.user_id,phone:req.body.phone});
    if (!user) {
        res.status(409).json({
            status:'failed',
            message : 'User not exists. Please enter correct details.'
        });
    } else {
        /*check user phone number matched with registered number*/
        // if (user.phone == req.body.phone) {
            //let url = '';
            //let send_otp_status = request(url);
            //if(send_otp_status) {}
             /* generate otp */
            var options = {
                    min: 1000,
                    max: 9999,
                    integer: true
                }
            let otp = randomnumber(options);
            /*parameters which is required to send mail*/
            var parameter = {
                    to: user.email,
                    subject:'AL || OTP verification',
                    message: `Your OTP is: ${otp}`,
                    templateName: 'otptemp.jade',
                    otp: otp
                }
            if(otp) {
                /* update otp in user table */
                let update_otp = await db.User.update({_id:req.body.user_id},{otp:otp});
                /*call send mail function*/
                let send_mail = await helper.sendEmail(parameter);
                /*failed responce*/
                res.status(200).json({
                    status : 'success',
                    message : 'Otp send successfully.'
                });
            }else {
                /*failed responce*/
                res.status(422).json({
                    status : 'failed',
                    message : 'Please try again.'
                });
            }
        //} else {
            /*failed responce*/
            /*res.status(422).json({
                status : 'failed',
                message : 'Phone number not matched with registered number.'
            });
        }*/   
    }
}

/** Api for verify otp
 * @route /user/verifyOtp
 * @method post
 * @Param 
 * @response json array
*/
async function verifyOtp(req,res,next) {
    /* check user is registered or not */
    var user = await db.User.findOne({_id:req.body.user_id,otp:req.body.otp});
    if(!user) {
        /* user is not registered or incorrect otp*/
        res.status(404).json({
            status : 'failed',
            message : 'User is not registered or entered otp is not correct.'
        }); 
    } else {
        var diff = moment().diff(moment(user.updatedAt, 'YYYY-MM-DD HH:mm:ss Z'), 'minutes');          
        if (diff <=3) {
            await db.User.update({_id:req.body.user_id},{verification_status: true})
                res.status(200).json({
                    status : 'success',
                    message : 'User successfully verified.'
                });
        } else {
            res.status(422).json({
                status : 'failed',
                message : 'Otp is expired.Please try again'
            });
        }
    }
}


/** Api for user Logout
 * @route /user/logout
 * @method get
 * @Param 
 * @response json array
*/
async function logout(req, res, next) {
    var user = await db.User.findOne({_id:req.body.user_id});
    if (!user) {
        /* user is not registered */
        res.status(402).json({
            status : 'failed',
            message : 'User is not registered.'
        });
    } else {
        if (typeof req.body.android_device_id != 'undefined') {
            device_id = 'android_device_id';
            var deviceId = req.body.android_device_id;
        } else {
            device_id = 'ios_device_id';
            var deviceId = req.body.ios_device_id;
        }
       //device_id =  user.ios_device_id.pull(deviceId)
       //return user.save()
        //console.log(device_id, deviceId)
        var update = await db.User.updateOne( {_id: user._id}, { $pull: {[device_id]: deviceId }});
        if (update) {
             res.status(200).json({
                    status : 'success',
                    message : 'User logout successfully.'
                });
        } else {
            res.status(402).json({
            status : 'failed',
            message : 'User not logout successfully.'
        });
        }
    }
}

/** Api for search city
 * @route /user/searchCity
 * @method get
 * @Param 
 * @response json array
*/
async function serchCity(req, res, next) {
    /*check or find country id in states collection*/
    var states = await db.States.find({country_id:req.body.country_id});
    /*create a new array and push state id in array*/
    var states_ids = new Array();
    for (var i = 0; i < states.length; i++) {
        states_ids.push(states[i].id);
    };
   // console.log(states_ids)
   // console.log(req.body.search)
    var search = (typeof req.body.search == 'undefined') ? '' : req.body.search;
    //console.log(search)
    /*now find state id in state collection*/
    var city = await db.City.find({ name: { $regex: '^'+search + '.*',$options: 'i' },
        state_id:{ $in: states_ids}});
    if (!city) {
        /* list not found */
        res.status(404).json({
            status : 'failed',
            message : 'List not found.'
        });
    } else {
        //var search = 
        /*list found in responce */
        res.status(200).json({
            status : 'success',
            message : 'List found successfully.',
            data : city
        });
    }
}


/** Api for user cities list
 * @route /user/gender
 * @method get
 * @Param 
 * @response json array
*/
async function gender(req, res, next) {
    /*find gender list in gendger collection*/
    var gender = await db.Gender.find().sort( { id: 1 } );
    if(!gender) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'Gender list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'Gender list found',
        data : gender
        });
    }
}


/** Api for client catagory list
 * @route /user/clientCategory
 * @method get
 * @Param 
 * @response json array
*/
async function clientCategory(req, res, next) {
    /*find client category list in client category collection*/
    var category = await db.Client_category.find().sort( { id: 1 } );
    if(!category) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'Client Category list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'Client Category list found',
        data : category
        });
    }
}


/** Api for client catagory list
 * @route /user/clientCategory
 * @method get
 * @Param 
 * @response json array
*/
async function agencyCategory(req, res, next) {
    /*find agency category list in agency category collection*/
    var category = await db.Agency_category.find().sort( { id: 1 } );
    if(!category) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'Agency Category list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'Agency Category list found',
        data : category
        });
    }
}


/** Api for Professional level list
 * @route /user/professionalLevel
 * @method get
 * @Param 
 * @response json array
*/
async function professionalLevel(req, res, next) {
    /*find level type list in level collection*/
    var level = await db.Level.find().sort( { id: 1 } );
    if(!level) {
        /*failed responce*/
        res.status(402).json({
        status : 'failed',
        message : 'Level type list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'Level type list found',
        data : level
        });
    }
}


/** Api for profession list
 * @route /user/profession
 * @method get
 * @Param 
 * @response json array
*/
async function profession(req, res, next) {
    /*get gender_id in gender_type*/
    let gender_type = [req.body.gender_type, 3];
    /*find gender type and parent id in profession collection*/
    let profession = await db.Profession.find({gender_type: {$in : gender_type}, parent_id: req.body.parent_id});
    if (profession.length >0) {
        /*success responce*/
        res.status(200).json({
            status : 'success',
            message : 'Profession type list found',
            data : profession
        });
    } else {
        /*failed responce*/
        res.status(402).json({
            status : 'failed',
            message : 'Level type list not found'
        });
    }
}


/** Api for profession hire search
 * @route /user/hireprofession
 * @method get
 * @Param 
 * @response json array
*/

async function hireProfessional(req, res, next) {
    /*If no parameter get validation message show*/
    if ((typeof req.body.level !='undefined' && req.body.level) || (typeof req.body.city !='undefined' && req.body.city) || (typeof req.body.profession !='undefined' && req.body.profession)) {
        let condition={};
        /*condition for search parameters according to requiement*/
        if (typeof req.body.level !='undefined' && req.body.level) {
            condition.level = req.body.level
        }
        condition.role_type = req.body.search;

        if (typeof req.body.city !='undefined' && req.body.city) {
            condition.city = { $in: req.body.city }
        }
        if (typeof req.body.profession !='undefined                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             ' && req.body.profession) {
            condition.profession = { $in: req.body.profession }
        }
        /*find professional users in professional collection according to level, profession, and city*/
        var search = await db.User.find(condition);
        if (search) {
            /*success responce*/
            res.status(200).json({
              status : 'success',
              message : 'Professional search list found',
              data : search
            });
        } else {
            /*failed responce*/
            res.status(409).json({
              status : 'failed',
              message : 'Professional search list found'
            });
        }
    } else {
        /*failed responce*/
        res.status(409).json({
            status : 'failed',
            message : "Please send at-least one parameter",
        });
    }
}

/** Api for profession list
 * @route /user/profession
 * @method get
 * @Param 
 * @response json array
*/
async function nearMe(req, res, next) {
    /*For find age from current date for ageto parameter*/
    var to = new Date();
    var dd = to.getDate();
    var mm = to.getMonth() + 1;
    var yyyy = to.getFullYear() - req.body.age_to;
    if (dd < 10) {
        dd = '0' + dd 
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    to = yyyy + '-' + mm + '-' + dd;

    /*For find age from current date for agefrom parameter*/
    var from = new Date();
    var dd = from.getDate();
    var mm = from.getMonth() + 1;
    var yyyy = from.getFullYear() - req.body.age_from;
    if (dd < 10) {
        dd = '0' + dd 
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    from = yyyy + '-' + mm + '-' + dd;
    /*find professional users location coordinates in professional collection*/
    var query = {
        location: {
            /*$near Mongo defalut function to calculate distance between*/
            $near: { 
                /*max distance*/
                $maxDistance: req.body.maxDistance*1000,
                $geometry: {
                    type: "Point",
                    coordinates: [ req.body.longitude, req.body.latitude]
                }
            }
        }
    };
    /*condition for search with loction parameters*/
    //query.role_type = req.body.search;
    
    if (typeof req.body.level != 'undefined' &&  req.body.level != '') {
        query.level = req.body.level
    }
    if (typeof req.body.age_to != 'undefined' &&  req.body.age_to != '' && typeof req.body.age_from != 'undefined' && req.body.age_from != '' ) {
        query.dob = {$gte:from,$lt:to}
    }
    if (typeof req.body.profession != 'undefined' &&  req.body.profession != '') {
        query.profession = { $in: req.body.profession }
    }
    if (typeof req.body.city != 'undefined' && req.body.city != '') {
        query.city = { $in: req.body.city }
    }
    if (typeof req.body.nationality != 'undefined' && req.body.nationality != '') {
        query.country = { $in: req.body.nationality }
    }
    /*find professional users in professional collection according to level, profession,city, nationality*/
    let location = await db.User.find(query);
    console.log(location);
    if (location.length>0){
        /*success responce*/
        return res.status(200).json({
            status: 'success',
            message: 'Near by location record found successfully',
            data: location
        }); 
    } else {
        /*failed responce*/
        return res.status(409).json({
            status: 'failed',
            message: 'No record found',
        });
    }
}

/** Api for Phone code list
 * @route /user/countryCode
 * @method get
 * @Param 
 * @response json array
*/
async function phoneCode(req, res, next) {
    /*find country code list in country_code collection*/
    var code = await db.Phone_code.find().sort( { id: 1 } );
    if(!code) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'Country code list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'Country code list found',
        data : code
        });
    }
}

/** Api for language list
 * @route /user/language
 * @method get
 * @Param 
 * @response json array
*/
async function language(req, res, next) {
    /*find language list in language collection*/
    var language = await db.Language.find().sort( { id: 1 } );
    if(!language) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'Country code list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'Country code list found',
        data : language
        });
    }
}

/** Api for favourite city search(in hire professional search)
 * @route /user/favCity
 * @method get
 * @Param 
 * @response json array
*/
async function favCity(req, res, next) {
    /*find cities registered in Professional collection
    and give count of that cities to show top cities on list*/
    var city = await db.User.aggregate([
        {"$group" : {_id:"$city", count:{ $sum:1 }}},
        {
            $project: {
                _id: 0,
                city_id:"$_id",
                count:1,  
            }
        }
    ]);
    if (city) {
        /*success responce*/
        res.status(200).json({
            status:'success',
            message : 'Cities list found',
            city:city
        });
    } else {
        /*error responce*/
        res.status(200).json({
            status:'failed',
            message : 'Cities list not found',
            city:city
        });
    }
}

/** Api for hair color type
 * @route /user/hairColor
 * @method get
 * @Param 
 * @response json array
*/
async function hairColor(req, res, next) {
    /*find hair color list in hair_color collection*/
    var hair = await db.Hair_color.find().sort( { id: 1 } );
    if(!hair) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'Hair list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'Hair list found',
        data : hair
        });
    }
}

/** Api for eye colors
 * @route /user/eyeColor
 * @method get
 * @Param 
 * @response json array
*/
async function eyeColor(req, res, next) {
    /*find eyecolor list in eye_color collection*/
    var eye = await db.Eye_color.find().sort( { id: 1 } );
    if(!eye) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'Eye color list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'Eye color list found',
        data : eye
        });
    }
}

/** Api for Model type
 * @route /user/model_type
 * @method get
 * @Param 
 * @response json array
*/
async function model_type(req, res, next) {
    /*find model type list in model_type collection*/
    var model_type = await db.Model_type.find().sort( { id: 1 } );
    if(!model_type) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'Model type list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'Model type list found',
        data : model_type
        });
    }
}


/** Api for advance search
 * @route /user/advanceSearch
 * @method get
 * @Param 
 * @response json array
*/
async function advanceSearch(req, res, next) {
    /*For find age from current date for ageto parameter*/
    var to = new Date();
        var dd = to.getDate();
        var mm = to.getMonth() + 1;
        var yyyy = to.getFullYear() - req.body.age_to;
        if (dd < 10) {
            dd = '0' + dd 
        }
        if (mm < 10) {
            mm = '0' + mm
        }
    to = yyyy + '-' + mm + '-' + dd;

    /*For find age from current date for agefrom parameter*/
    var from = new Date();
        var dd = from.getDate();
        var mm = from.getMonth() + 1;
        var yyyy = from.getFullYear() - req.body.age_from;
        if (dd < 10) {
            dd = '0' + dd 
        }
        if (mm < 10) {
            mm = '0' + mm
        }
    from = yyyy + '-' + mm + '-' + dd;
    var condition = {};
    /*condition for search with given parameters*/
    if (typeof req.body.level != 'undefined' &&  req.body.level != '') {
        condition.level = { $in: req.body.level }
    }
    condition.role_type = req.body.search;
    if (typeof req.body.city != 'undefined' &&  req.body.city != '') {
        condition.city = { $in: req.body.city }
    }
    if (typeof req.body.profession != 'undefined' &&  req.body.profession != '') {
        condition.profession = { $in: req.body.profession }
    }
    if (typeof req.body.age_to != 'undefined' &&  req.body.age_to != '' && typeof req.body.age_from != 'undefined' && req.body.age_from != '' ) {
        condition.dob = {$gte:from,$lt:to}
    }
    if (typeof req.body.nationality != 'undefined' && req.body.nationality != '') {
        condition.country = { $in: req.body.nationality }
    }

    /*find professional users in professional collection according to level, profession,city, nationality*/
    var search = await db.User.find(condition);
    if (search.length>0) {
        /*success responce*/
        res.status(200).json({
            status : 'success',
            message : 'Advance search list found',
            data : search
        });
    } else {
        /*failed responce*/
        res.status(409).json({
            status : 'failed',
            message : 'Advance search list not found',
        });
    }
}


async function dataFilters(req, res, next) { 
    /*for validation */
    var type = ['Agency_category','City','Client_category','Country','Eye_color','Gender','Hair_color','Hair_length','Hair_type','Language','Level','Model_type','States'];
    if (typeof req.body.filter_type == 'undefined' || !type.includes(req.body.filter_type)) {
        return res.status(422).json({
            status: 'failed',
            message: 'Select filter type and wrote in correct way.'
          });
    }
    /*to find data in requested collection*/
    var data = await db[req.body.filter_type].find().sort( { id: 1 } ); 
    if (data) {
        /*success responce*/
        res.status(200).json({
            status : 'success',
            message : `${req.body.filter_type} list found`,
            data : data
        });
    } else {
        res.status(409).json({
            status : 'failed',
            message : 'List not found.',
        });
    }
}

/** Api for hair length
 * @route /user/eyeColor
 * @method get
 * @Param 
 * @response json array
*/
async function hairLength(req, res, next) {
    /*find hair length list in Hair_length collection*/
    var hair_length = await db.Hair_length.find().sort( { id: 1 } );
    if(!hair_length) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'Hair length list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'Hair length list found',
        data : hair_length
        });
    }
}


/** Api for hair type
 * @route /user/hairType
 * @method get
 * @Param 
 * @response json array
*/
async function hairType(req, res, next) {
    /*find hair type list in Hair_type collection*/
    var hair_type = await db.Hair_type.find().sort( { id: 1 } );
    if(!hair_type) {
        /*failed responce*/
        res.status(400).json({
        status : 'failed',
        message : 'Hair length list not found'
        });
    } else {
        /*success responce*/
        res.status(200).json({
        status : 'success',
        message : 'Hair length list found',
        data : hair_type
        });
    }
}


/** Api for add or remove favourite
 * @route /user/favourite
 * @method get
 * @Param 
 * @response json array
*/
async function addAndRemoveFavourite(req, res, next) {
    let professional = await db.User.findOne({_id: req.body.favourite_to}).lean().exec();
    //console.log(professional)
    if (!professional) {
        /*failed responce*/
        res.status(409).json({
            status : 'failed',
            message : 'User not exists',
        });
    } else {
        /*find data in favourite collection*/
        var check = await db.User.findOne({favourite:{$in:req.body.favourite_to}});
        if (check) {
                /*failed responce*/
                res.status(400).json({
                    status : 'failed',
                    message : 'You have alredy done this.Please change the value.',
                });
            } 
        else {
            /*For create new entry*/
            var favourite = await db.User.update({_id:req.body.favourite_by},{$push:{favourite:req.body.favourite_to}},{new:true});
            if (favourite) {
                console.log(favourite)
                /*success responce*/
                res.status(200).json({
                    status : 'success',
                    message : 'This user added in your favourite list.',
                });
            } else {
                /*failed responce*/
                res.status(400).json({
                    status : 'failed',
                    message : 'Something went wrong.',
                });
            }
        }
    }
}


/** Api for my favourite list
 * @route /user/myfavourite
 * @method get
 * @Param 
 * @response json array
*/
async function myFavouriteList(req, res, next) {
    /*find data in requested collection*/
    var user = await db.User.findOne({_id:req.body.favourite_by});
    if (!user) {
        /*failed responce*/
        res.status(409).json({
            status : 'failed',
            message : 'User not exists',
        });
    } else {
        /*failed responce*/
        var list = await db.User.find({_id:req.body.favourite_by}).populate('favourite_to');
        if (list) {
            /*success responce*/
            res.status(200).json({
                status : 'success',
                message : 'Your favourite user list.',
                data : list
            });
        } else {
            /*failed responce*/
            res.status(400).json({
                status : 'failed',
                message : 'You have not added any user as a favourite.',
            });
        }
    }
}


/** Api for User Details
 * @route /user/bookingRequest
 * @method get
 * @Param 
 * @response json array
*/
async function userDetails(req, res, next) {
    var user = await db.User.findOne({_id:req.body.user_id});
    if (!user) {
        res.status(409).json({
            status : 'failed',
            message : 'User not exists',
        });
    } else {
        var role = await db.User.findOne({_id:req.body.user_id});
        if (role) {
            res.status(200).json({
                status : 'success',
                message : 'Your favourite user list.',
                data : role
            });
        } else {
            res.status(409).json({
                status : 'failed',
                message : 'User not exists',
            });
        }
    }
}



async function fullProfile(req, res, next) {
    var role = await db.User.findOne({_id:req.body.user_id,role_type:req.body.role_type});
    if (role) {
        var user = await db.User.findOneAndUpdate({_id:req.body.user_id},req.body,{new:true});
            if (user) {
                res.status(200).json({
                    status : 'success',
                    message : 'Your profile is completed.',
                    data : user
                });  
            } else {
                res.status(422).json({
                    status : 'failed',
                    message : 'Profile not updated.',
                });
            }
        } else {
            res.status(422).json({
                status : 'failed',
                message : 'User role type not match.',
            });
        }  
    }
    

/** Api for book professional request 
 * @route /user/bookingRequest
 * @method get
 * @Param 
 * @response json array
*/
async function bookingRequest(req, res, next) {
    var user = await db.User.findOne({_id:req.body.booked_by}); 
    if (!user) {
        res.status(409).json({
            status : 'failed',
            message : 'User not exists',
        });
   } else {
        var professional = await db.User.findOne({_id:req.body.booked_to,role_type:req.body.role_type});
        if (!professional) {
          res.status(409).json({
                status : 'failed',
                message : 'Professional not exists',
            });  
        } else {
            var booked = await db.Booking.create(req.body);  
            if (booked) {
                res.status(200).json({
                    status : 'success',
                    message : 'booking request successfully booked.',
                    data : booked
                });   
            } else {
                res.status(409).json({
                    status : 'failed',
                    message : 'booking request not successfully booked',
                });  
            }
        }
    }
}