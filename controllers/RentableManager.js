var common = require('../helper/common.js');
var mongoose = require('mongoose');
var GroupModifier = require('../chats/groupModifier.js');
var groupModifier = new GroupModifier();

module.exports = function () {
    //setting default value
     var Core = require('../Core/core.js')
    var fs = require('fs');
    var ObjectId = require('mongodb').ObjectId;
    var ChatGroup = common.mongoose.model('ChatGroup');
    var Rentable = common.mongoose.model('Rentable');
    var User = common.mongoose.model('User');
    var _ = require('underscore');
    var CustomError = require('../Core/custom-error');



  
    this.ADDRENTABLE = async function(data,options){
      var  addrentable  = new  Rentable(data);
        let addresult = await addrentable.save();
          if(addresult){
              return addresult;
          }
          else{
           throw new CustomError("PRE002");    
          }
    }

    this.GETRENTABLE = async function(data,options){
        var rentableresult = await Rentable.find({status:"Published"});
        if(rentableresult){
            return rentableresult
        }
        else{
            throw new CustomError("ACC008");     
        }
    }
    
    this.GETRENTABLEBYID = async function(data,options){
        var rentableresult = await Rentable.findById(data.Id);
        if(rentableresult){
            return rentableresult
        }
        else{
            throw new CustomError("ACC008");     
        }
    }

    this.ADDREVIEW = async function(data,options){
     var updaterentable = await Rentable.findByIdAndUpdate(data.Id,{
            $push:{
              "reviews":{
                  userid:data.userid,
                  star:data.star,
                  comment:data.comment
              }
            }
        },
        {
            new:true
        }
    
        );
        if(updaterentable){
            
         return    updaterentable;
        }
        else{
            throw new CustomError("PRE002");
        }
   
    }

    function distance(lat1, lon1, lat2, lon2, unit) {
        unit = unit || "K";
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
    }
    
    this.GETRENTABLEBYLOCATION = async function(data,options){
        var rentables=[]
       
        var rentableresult = await Rentable.find({type:data.type,status:"Published"});

        if(rentableresult){
        for(var i=0;i<rentableresult.length;i++){
           if (distance(data.latitude, data.longitude, rentableresult[i].latitude, rentableresult[i].longitude) <= data.distance ) {
                rentables.push(rentableresult[i]);
            }
          }
        if(rentables){
        
            return rentables;
        }
        else{
            throw [];
        }
      }
        else{
            throw [];     
        }
    }

    this.UPDATESTATUS = async function(data,options){
        var updateresult = await Rentable.findByIdAndUpdate(data.Id,{
            $set:{
                status:data.status
            }
        },
        {
            new : true
        });
        if(updateresult){
            return updateresult
        }
        else{
            throw new CustomError("PRE002")
        }
    }

}