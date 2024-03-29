﻿var common = require('../helper/common.js');
var Core = require('../Core/core.js');
var ProcessFactory = require('../Core/processFactory.js');
var CustomError = require('../Core/custom-error');
var mysql = require("mysql");
module.exports = function(app) {

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
                jwt.verify(token, config.secret, function(err, decoded) {
                    if (err) resolve(500);
                    else resolve(200);
                });
            } else {
                resolve(200);
            }
        });
    }

    app.post('/api/xlsx-download/:type', function(req, res, next) {

        console.log(req.body);

        var con = mysql.createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "",
            database: "attodayi_civilpro"
        });

        con.connect(function(err) {

            var $start_date = req.body.start_date;
            var $end_date = req.body.end_date;

            //$end_date = "3/1/2019";
            //$start_date = "1/1/2019";

            var finalQuery = "";

            var type = req.params.type;
            type = "1";
            if (type === "1") {
                finalQuery = `select u.card_date, e.first_name as emp_first_name, e.last_name as emp_last_name, p.Project_name, pt.task_name as work_type, 
                cl.first_name as cli_first_name , cl.last_name as cli_last_name,
                u.description, u.hours, 'yes' as billed, u.employee_id ,p.Project_id as project_id
                from time_card u
            inner join employee e on e.empl_id = u.employee_id
            inner join Project p on p.Project_id = u.project_name
            inner join Client cl on cl.id = p.Client_id
            inner join project_tasks pt on pt.id = u.taskid`;

            } else {
                finalQuery = `select p.Project_id, p.Project_name,'1/28/2019' as work_date , 'abc' as team , cl.first_name, cl.last_name , u.work_type, u.description,  u.hours, 'yes' as billed from time_card u
                inner join Project p on p.Project_id = u.project_name
                inner join Client cl on cl.id = p.Client_id`;
            }

            //if($start_date && $end_date){
            //finalQuery = finalQuery + " where STR_TO_DATE(u.card_date,'%m/%d/%Y') >= STR_TO_DATE('"+$start_date+"','%m/%d/%Y')";
            //finalQuery = finalQuery + " and STR_TO_DATE(u.card_date,'%m/%d/%Y') <= STR_TO_DATE('"+$end_date+ "','%m/%d/%Y')";
            //}

            if ($start_date && $end_date) {
                finalQuery = finalQuery + " where ( STR_TO_DATE(u.card_date,'%m/%d/%Y') >= STR_TO_DATE('" + $start_date + "','%m/%d/%Y') or STR_TO_DATE(u.card_date,'%Y-%m-%d') >= STR_TO_DATE('" + $start_date + "','%m/%d/%Y'))"
                finalQuery = finalQuery + "  and (STR_TO_DATE(u.card_date,'%m/%d/%Y') <= STR_TO_DATE('" + $end_date + "','%m/%d/%Y') or STR_TO_DATE(u.card_date,'%Y-%m-%d') <= STR_TO_DATE('" + $end_date + "','%m/%d/%Y'))"
            }

            console.log(finalQuery);

            con.query(finalQuery, [], function(error, results, fields) {

                if (error) throw error;
                con.end();

                res.setHeader('Cache-Control', 'private, max-age=3600');
                res.status(200).send(results);

            });
        });
    })



    app.post('/api/manager', async function(req, res, next) {
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
                    if (ex instanceof CustomError) {
                        toReturn = core.wrapResponse(null, ex.code);
                    } else {
                        toReturn = core.wrapResponse(null, "PRC002");
                    }
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


    app.post('/api/database', function(req, res, next) {
        var con = mysql.createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "",
            database: "attodayi_civilpro"
        });

        // con = mysql.createConnection({
        //     host: "localhost",
        //     port: "3306",
        //     user: "root",
        //     password: "",
        //     database: "civilpro"
        // });

        con.connect(function(err) {
            if (err) {
                console.log('Error connecting to Db');
                console.log(err);
                return;
            }
            console.log('Connection established');

            // load query.json and get object based on prcid 
            var queries = require('../query.json')
            var postData = {
                PRCID: req.body.PRCID,
                Data: req.body.Data
            };
            var query = '';
            var finalQuery = "";
            var queryOBj = null;
            for (var i = 0; i < queries.length; i++) {
                if (queries[i].PRCID == postData.PRCID) {
                    queryObj = queries[i];
                }
            }

            finalQuery = queryObj.QUERY;
            for (var p in postData.Data) {
                var pid = postData.Data[p]
                var aa = "$$$$" + p + "$$$$"
                finalQuery = finalQuery.replace(aa, pid)
            }

            console.log(finalQuery);

            con.query(finalQuery, [], function(error, results, fields) {

                //if (error) throw error;
                con.end();

                res.setHeader('Cache-Control', 'private, max-age=3600');
                if (queryObj.NORETURNDATA) {
                    res.status(200).send({ MSG: 'Operation success' });
                } else {
                    if (queryObj.ISSINGLEROWRETURN) {
                        res.status(200).send(results[0]);
                    } else {
                        res.status(200).send(results);
                    }
                }

            });
        });
    })



    app.get('/add-project-notificaion', async function(req, res) {
        try {
            let id = Number(req.query.userid);
            let pid = Number(req.query.projectid);
            var notifObj = {
                targetId: id,
                title: "Admin added you the project",
                text: "Admin added you the project",
                type: 'PROJECTUPDATE',
                isRead: false,
                refData: {
                    GroupId: pid
                }
            }

            var core = new Core();
            var notManager = new ProcessFactory().getProcessManagerById("Notification"); // core.getMangerByprocess_id(cnt);
            let methodResponse = notManager.CREATEPUSHNOTIFICATION(notifObj); //await process[param.method_id](param.request_object, {});
            var toReturn = core.wrapResponse(methodResponse);
            res.json(toReturn);
            // var notManager = new NotificationManager();
            // notManager.CREATEPUSHNOTIFICATION(notifObj);

            // var PushNotificationObj = new PushNotification(notifObj);
            // PushNotification.save(PushNotificationObj, function (err, logresult) {
            //           res.json(e)
            //         });

        } catch (e) {
            res.json(e)
        }

    })


}