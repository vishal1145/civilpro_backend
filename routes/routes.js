var common = require('../helper/common');

/*Models*/
const userModel = require('../models/User');
const logModel = require('../models/Log');
//const teacherModel = require('../model/Teacher');
//const sessionModel = require('../model/Session');
const ChatGroupModel = require('../models/ChatGroup');
const MessageModel = require('../models/Message');
const RentableModel = require('../models/Rentable');
const BookingModel = require('../models/RentableBooking');
//const CategoryModel = require('../model/Category');
//const ProductModel = require('../model/Product');

module.exports = function (app) {
   
    //require('../controller/init')(app); // for all public routes
  //  require('../controller/auth')(app); // for authentication
    require('../controllers/shared')(app); // for all api to get data 

}