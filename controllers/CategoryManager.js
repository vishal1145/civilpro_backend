var fs = require('fs');
var common = require('../helper/common.js');
var Category = common.mongoose.model('Category');


module.exports = function(){
    var  CategoryArray = [
        {
            "name": "Photo Studio",
            "type": "Apartment",
            "subs": [
                {
                    "name": "Photo Studio",
                "type": "Apartment"
            }
            ]
        },
        {
            "name": "Gallery",
            "type": "Apartment",
            "subs": []
        },
        {
            "name": "CoWorkingSpace",
            "type": "Apartment",
            "subs": []
        },
        {
            "name": "Showroom",
            "type": "Apartment",
            "subs": []
        },
        {
            "name": "Outspace",
            "type": "Apartment",
            "subs": []
        },
        {
            "name": "Camera",
            "type": "Equipment",
            "subs": []
        },
        {
            "name": "Studio",
            "type": "Equipment",
            "subs": []
        },
        {
            "name": "Electronics",
            "type": "Equipment",
            "subs": []
        },
        {
            "name": "Travels",
            "type": "Equipment",
            "subs": []
        }
    ]

  
    this.ADDCATEGORY = async function(data,options) {
        var addcategory = [];
        for(var i=0;i<CategoryArray.length;i++){
    var allcategory = new Category(CategoryArray[i]);
    let categoryresult = await allcategory.save();
       addcategory.push(categoryresult);
       for(var j=0;j<CategoryArray[i].subs.length;j++){
           var addsubcategory = new Category(CategoryArray[i].subs[j]);
           addsubcategory.parentid = categoryresult._id;
           let addresult = await addsubcategory.save();
           addcategory.push(addresult);
       } 
      }
      if(addcategory){
          return addcategory
      }
}
}