var express = require('express');
var router = express.Router();
var  lib = process.cwd();
var UserDevice = require(lib + '/models/UserDevice')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/updateUserDevice', async function(req, res){
  try{
  let id = Number(req.query.userid)
  let value = Boolean(Number(req.query.notification))
  UserDevice.update({user_id : id}, {$set:{notification_on : value}}, {new: true}, 
    function(err, result){
      if(!err){
        res.json(result)
      }else{
        res.json(err)
      }
  })
}catch(e){
  res.json(e)
}
})

module.exports = router;
