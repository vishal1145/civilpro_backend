var nodemailer = require('nodemailer'); /*use to send mail*/
var jade = require('jade');
var templateDir = 'template/';

module.exports = {
	sendEmail:sendEmail,
	randomString:randomString,
}

/**function for send mail
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function sendEmail(parameter) {
 var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: '',
	    pass: ''
	  }
 });
/*if template name otptemp then this part work*/
if (parameter.templateName == 'otptemp.jade') {
	var html = jade.renderFile(templateDir+'/'+parameter.templateName,{otp: parameter.otp});
} else {
	/*otherwise this part work*/
	var html = jade.
	renderFile(templateDir+'/'+parameter.templateName,{password: parameter.password});
}
/*mail parameter*/
var mailOptions = {
  from: 'AL <Artistlink>',
  to: parameter.to,
  subject: parameter.subject,
  text: parameter.message,
  html: html
};
/*to send mail*/
transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
 });
}

/**function to genrtate random string
 * @route /
 * @method post
 * @Param 
 * @response json array
*/
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

