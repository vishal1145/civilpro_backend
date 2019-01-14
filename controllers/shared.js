var common = require('../helper/common.js');
var Core = require('../Core/core.js');
var ProcessFactory = require('../Core/processFactory.js');
var CustomError = require('../Core/custom-error');
module.exports = function (app) {

    var jwt = require('jsonwebtoken');
    var bcrypt = require('bcryptjs');
    var Logs = common.mongoose.model('Logs');
    var env = process.env.NODE_ENV || 'dev';
    var config = require('../config/' + env + '.config');

    async function verifyToekn(req) {
        return new Promise((resolve, reject) => {
            if (config.env == "prod") {
                var token = req.headers['x-access-token'];
                if (!token) resolve(401);
                jwt.verify(token, config.secret, function (err, decoded) {
                    if (err) resolve(500);
                    else resolve(200);
                });
            } else {
                resolve(200);
            }
        });
    }

    app.post('/api/manager', async function (req, res, next) {
       let isVerified = 200
        if (isVerified == 401) {
            res.status(401).send({
                auth: false,
                message: 'No token provided.'
            });
        } else if (isVerified == 500) {
            res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
            return;
        } else {
            var param = {
                process_id: req.body.PRCID,
                method_id: req.body.Method,
                request_object: req.body.Data,
                created_time: new Date()
            };

            console.log(param);
            var toReturn = null;
            var core = new Core();
                var incoming = new Logs(param);
                let incomingObj = await incoming.save(incoming);

            try {
                
                res.setHeader('Content-Type', 'application/json');

                await common.validateIds(param);
                
                var process = new ProcessFactory().getProcessManagerById(param.process_id); // core.getMangerByprocess_id(cnt);
                try {
                    let methodResponse = await process[param.method_id](param.request_object, {});
                    toReturn = core.wrapResponse(methodResponse);
                } catch (ex) {
                    if (ex instanceof CustomError){
                    toReturn = core.wrapResponse(null, ex.code);}
                    else{
                    toReturn = core.wrapResponse(null, "PRC002");}
                    incomingObj.Exception = ex;
                    incomingObj.message = ex.message
                    incomingObj.stack = ex.stack;
                    incomingObj.save();
                }
            } catch (ex) {
                toReturn = core.wrapResponse(null, "PRC001");
                incomingObj.Exception = ex;
                incomingObj.message = ex.message
                incomingObj.stack = ex.stack;
                incomingObj.save();
            }
            res.status(200).send(toReturn);
        }
    });
}