const express = require("express");
const app = express();
var nodemailer = require('nodemailer');


const signIn = (req, res) => {

    const UserName = req.body.Name;
    const Password = req.body.Password;
    const Role = req.body.Role;

    console.log(UserName);
    console.log(Password);
    console.log(Role);

    if(Role=="Admin")
    {
    const admin = { username: UserName, password: Password };
                req.session.admin = admin;
                res.cookie("CurrentRole", "Admin");
                res.redirect("/dashboard");
    }

    if(Role=="User")
    {
    const admin = { username: UserName, password: Password };
                req.session.admin = admin;
                res.cookie("CurrentRole", "Admin");
                res.redirect("/signin");
    }
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'docadvisormail@gmail.com',
           pass: 'wfjqvftdofsamysf'
       }
   });
   


const signUp = (req, res) => {

    const UserName = req.body.email;
 
    const Role = req.body.Role;

    console.log(UserName);
    
    console.log(Role);


    var  code = generateCode();

    res.render('html', {UserName, code} ,function(err,html){
    const mailOptions = {
        from: 'docadvisormail@gmail.com', // sender address
        to: UserName, // list of receivers
        subject: `Welcome to DocAdvisor`, // Subject line
        html: html
      };

      transporter.sendMail(mailOptions, function (err, info) {
         if(err)
           console.log(err)
         else
           console.log(info);
           res.redirect("/signin")
      });
    })
}

const dashboard = (req, res) => {


    res.render("dashboard");
   
}


function generateCode()
{
    var min=100000;
    var max=999999;
    return Math.floor(Math.random()* (max-min+1))+min;
}



module.exports = {
    signIn,
    dashboard,
    transporter,
    signUp

}