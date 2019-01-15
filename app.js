const winston = require('winston');


var debug = require('debug')('artist-link:server');
var http = require('http');
var CronJob = require('cron').CronJob;
var NotificationManager = require('./controllers/NotificationManager');
require('winston-mongodb');
require('express-async-errors');
var createError = require('http-errors');
var express = require('express');
var server = require('http').Server(express);
var path = require('path');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersAuthRouter = require('./routes/userAuth');
var mongoose = require('mongoose');
var connection = require('./models/connection-string');

var auth = require('./auth/verifyToken');
var bodyParser = require('body-parser');

var app = express();
var cors = require('cors');
app.use(cors())
var router = express.Router();
router.all('*', cors());

require('./models/Rentable');
require('./models/RentableBooking')
require('./models/Log')
require('./models/User')
require('./models/Category')
require('./models/UserDevice');
require('./models/PushNotification')
winston.handleExceptions(
 new winston.transports.Console({colorize:true},{prettyPrint:true}),
 new winston.transports.File({filename:'uncaughtExceptions.log'})
 );

process.on('unhandledRejection', (ex)=>{
throw ex;
});

winston.add(winston.transports.File, {filename:'logfile.log'});
winston.add(winston.transports.MongoDB, {db:'mongodb://localhost/artist',level:'info'});

router.use(bodyParser.json({ limit: '500mb' }));
router.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 50000 }));

router.use(function (req, res, next) {
  
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./models/connection-string'));
}
mongoose.set('debug', true);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// set middleware for auth user.
//app.use(auth.verifyJWTToken);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
app.use('/', indexRouter);
app.use('/users',usersRouter);
app.use('/auth',auth.verifyJWTToken,usersAuthRouter);
app.use(function(err, req, res, next){
	winston.error(err.message, err);
	res.status(500).send(`Some internal error:${err}`);
});

require('./chat')(app,server);

require('./routes/routes')(app)

var configManager = require('./config/configManager.js');
configManager.getConfigValueByKey('database');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var mongoPromise = mongoose.connect(configManager.getConfigValueByKey('database'), {
  useMongoClient: true
//  },function(){
//   new CronJob('* * * * * *', function () {
//     console.log("Executing notificatin service");
//     var notManager = new NotificationManager();
//     //notManager.SENDNOT();
// }, null, true, 'America/Los_Angeles');

});
	mongoPromise.then(() => {
	  console.log('Connected to Database');
	});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




// error handler
app.use(function(req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Get port from environment and store in Express.
 */

var port = 9100;
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, function(){
  console.log('listening on port:' + port)
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


//module.exports = app;
