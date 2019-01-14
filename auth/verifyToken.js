const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const models = require('../models/all-models');
const request = require('request');

module.exports = {
    verifyJWTToken:verifyJWTToken,
}

/**
 * Name:verifyToken
 * Desc: This function help to verify token for valid users.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 function verifyJWTToken(req,res,next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader !=='undefined') {
        //split at the spac e
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        jwt.verify(req.token,'artistlink321',(err,authData) => {
            console.log(authData);
            if(err) {
                return res.status(403)
                .json({
                    status: 'not_authorized',
                    message: 'User not authorized.'
                });
            }else {
                return next();
            }
        });
    }else {
        // Forbidden
        return res.status(403)
        .json({
            status: 'not_authorized',
            message: 'User not authorized.'
        });
    }
}