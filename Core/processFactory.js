module.exports = function () {

  //  var UserManager = require('../models/UserManager.js');
   // var AuthManager = require('../models/AuthManager.js');
    //var CommonManager = require('../models/CommonManager.js');
 
    var chatGroupManager = require('../controllers/chatGroupManager.js');
    var RentableManager = require('../controllers/RentableManager.js');
    var BookingManager = require('../controllers/BookingManager.js');
    var CategoryManager = require('../controllers/CategoryManager.js');
    var DeviceManager = require('../controllers/DeviceManager.js');
    
    this.getProcessManagerById = function (processId) {
        var manager = null;
        switch (processId) {
            // case "User":
            //     manager = new UserManager();
            //     break;
            // case "Auth":
            //     manager = new AuthManager();
            //     break;
            // case "Common":
            //     manager = new CommonManager();
            //     break;
           
            case "ChatGroup":
                manager = new chatGroupManager();
                break;
            case "Rentable":
                manager = new RentableManager();
                break;
            case "RentableBooking":
                manager = new BookingManager();
                break;
            case "Category":
                manager = new CategoryManager();
                break;
            case "UserDevice":
                manager = new DeviceManager();
                break;
          
        }
        return manager;
    }
}