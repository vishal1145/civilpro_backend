var mongoose = require('mongoose');
var countries = require('./data/countries').countries;
var cities = require('./data/cities').cities;
var states = require('./data/states').states;
var gender = require('./data/gender').gender;
var client_categories = require('./data/client_categories').client_categories;
var agency_categories = require('./data/agency_categories').agency_categories;
var level = require('./data/level').level;
var profession = require('./data/profession').profession;
var phone_code = require('./data/phone_code').phone_code;
var language = require('./data/language').language;
var hair_color = require('./data/hair_color').hair_color;
var eye_color = require('./data/eye_color').eye_color;
var model_type = require('./data/model_type').model_type;
var hair_type = require('./data/hair_type').hair_type;
var hair_length = require('./data/hair_length').hair_length;
var products = require('./data/products').products;

require('../all-models').toContext(global);


//------------------------
// ADD SEEDS BELOW
//------------------------


// suggested module for generating fake contextual data
// var Faker = require('faker');


// For Example
/*seed for model type list*/
Model_type.create(model_type)

.then(() => {
  console.log("Model type Seed complete!")  
  mongoose.connection.close();
});

/*seed for eye color list*/
Eye_color.create(eye_color)

.then(() => {
  console.log("Eye color Seed complete!")  
  mongoose.connection.close();
});

/*seed for language list*/
Language.create(language)

.then(() => {
  console.log("Language Seed complete!")  
  mongoose.connection.close();
});

/*seed for phone code list according to counrty*/
Phone_code.create(phone_code)

.then(() => {
  console.log("Phone code Seed complete!")  
  mongoose.connection.close();
});

/*seed for hair color list*/
Hair_color.create(hair_color)

.then(() => {
  console.log("Hair color code Seed complete!")  
  mongoose.connection.close();
});

/*seed for country list*/
Country.create(countries)

.then(() => {
  console.log(" Country Seed complete!")  
  mongoose.connection.close();
});

/*seed for state list*/
States.create(states)

.then(() => {
  console.log("States Seed complete!")  
  mongoose.connection.close();
});

/*seed for city list*/
City.create(cities)

.then(() => {
  console.log(" City Seed complete!")  
  mongoose.connection.close();
});

/*seed for gender list*/
Gender.create(gender)

.then(() => {
  console.log("Gender Seed complete!")  
  mongoose.connection.close();
});

/*seed for Client category list*/
Client_category.create(client_categories)

.then(() => {
  console.log("Client category Seed complete!")  
  mongoose.connection.close();
});

/*seed for agency category list*/
Agency_category.create(agency_categories)

.then(() => {
  console.log("Agency category Seed complete!")  
  mongoose.connection.close();
});

/*seed for level(professional) list*/
Level.create(level)

.then(() => {
  console.log("Level type Seed complete!")  
  mongoose.connection.close();
});

/*seed for profession list*/
Profession.create(profession)

.then(() => {
  console.log("Profession type Seed complete!")  
  mongoose.connection.close();
});

Hair_length.create(hair_length)

.then(() => {
  console.log("Hair length type Seed complete!")  
  mongoose.connection.close();
});

Hair_type.create(hair_type)

.then(() => {
  console.log("Hair type Seed complete!")  
  mongoose.connection.close();
});

Products.create(products)

.then(() => {
  console.log("products type Seed complete!")  
  mongoose.connection.close();
});
// be sure to close the connection once the queries are done

