const express = require("express");
const app = express();
var nodemailer = require('nodemailer');
const mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: "ayrish123",
    password: "123",
    
    database: "final",
  });
  con.connect(function (err) {
    if (err) throw err;
    console.log("connected");
  });
  
//ist step

  const signUp = (req, res) => {

    const UserName = req.body.username;
 
    const Role = req.body.Role;

    console.log(UserName);
    
    console.log(Role);


    var  code = generateCode();

    res.render('html', {UserName, code} ,function(err,html){
    const mailOptions = {
        from: 'azraunt@gmail.com', // sender address
        to: UserName, // list of receivers
        subject: `Welcome to AZ restraunt`, // Subject line
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
//2nd step
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
    const user = { username: UserName, password: Password };
                req.session.user = user;
                res.cookie("CurrentRole", "user");
                res.redirect("/dashboard1");
    }

};

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'azraunt@gmail.com',
           pass: 'lbmwkymugxpkdzaa'
       }
   });
   
///3rd step
const dashboard = (req, res) => {


    res.render("admin");
   
}
const dashboard1 = (req, res) => {


  res.render("user");
 
}

//code generate for email verification
function generateCode()
{
    var min=100000;
    var max=999999;
    return Math.floor(Math.random()* (max-min+1))+min;
}



const index = (req, res) => {

    con.query("SELECT * FROM crud", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render("index", { data: result });
      });

};

const index1 = (req, res) => {

  con.query("SELECT * FROM crud", function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render("indexuser", { data: result });
    });

};
const addnew =(req,res)=>
{
    if (!req.file) {
        return req.statusCode(404).send("No File Recieved!");
      }
    
      const name = req.body.name1;
      const ID = req.body.email1;
      const des = req.body.password1;
      const type = req.body.qual;
      const address = req.body.city;
      const profilepicName = req.file.originalname;
    
      const Query = `INSERT INTO crud VALUES ('${name}','${ID}','${des}','${type}','${address}','${profilepicName}' )`;
      con.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect("/");
      });
};

const delete1 = (req,res)=>{
    const mail = req.params.id;
    con.query(`Delete FROM crud where email='${mail}'`, function (err, result) {
      if (err) throw err;
      console.log(result);
  
      res.redirect("/");
    });
}
const comment = (req,res)=>{
  if (!req.file) {
      return req.statusCode(404).send("No File Recieved!");
    }
  
    const name = req.body.name1;
    const ID = req.body.email1;
    const type = req.body.city;
    const comment = req.body.qual;
    
    const Query = `INSERT INTO comment VALUES ('${name}','${ID}','${type}','${qual}', )`;
    con.query(Query, function (err, result) {
      if (err) throw err;
      res.redirect("/menu");
    });
};

const update=(req,res)=>
{
    if (!req.file) {
        return req.statusCode(404).send("No File Recieved!");
      }
    
      const name = req.body.name1;
      const Id = req.body.email1;
      
      const type = req.body.qual;
      const city = req.body.city;
      const profilepicName = req.file.originalname;
    
    
      const Query = `Update crud set name='${name}', email='${Id}',qual='${type}', city='${city}', pic='${profilepicName}' where email='${Id}' `;
      con.query(Query, function (err, result) {
        if (err) throw err;
        console.log('successfully');
        console.log(name);
        console.log(Id);
        console.log(type);
        console.log(city);

        res.redirect("/");
      });
}

const cooked=(rea,res)=>{

  con.query("SELECT * FROM crud Where city='Cooked' ", function (err, result) {
    if (err) throw err;
    console.log(result);
    res.render("index", { data: result });
  });
}

const baked=(rea,res)=>{

  con.query("SELECT * FROM crud  Where city='baked' ", function (err, result) {
    if (err) throw err;
    console.log(result);
    res.render("index", { data: result });
  });

}
const fried=(rea,res)=>{

  con.query("SELECT * FROM crud  Where city='fried' ", function (err, result) {
    if (err) throw err;
    console.log(result);
    res.render("index", { data: result });
  });

}
const name=(req,res)=>{
  console.log(req.body.docName);
  // let name = req.body.docName;
  //console.log(req.params.name1);
  con.query(`SELECT * FROM crud where name='${req.body.docName}'`, function (err, result) {
    if (err) throw err;
    console.log(result);  
    res.render("index", { data: result });
  });
}
const update1=(req,res)=>{
    const mail = req.params.id;
    con.query(
      `SELECT * FROM crud where email='${mail}'`,
      function (err, result) {
        if (err) throw err;
        console.log(result);
  
        res.render("update", { data: result });
      }
    );
}

const product =(req,res)=>{
  const countQ = "SELECT COUNT(*) FROM crud";
   con.query(countQ, function (err, result) {
       if (err) throw err;

       let dataCount = result[0]["COUNT(*)"];
       let pageNo = req.query.page ? req.query.page : 1;
       let dataPerPages = req.query.data ? req.query.data : 2;
       let startLimit = (pageNo - 1) * dataPerPages;
       let totalPages = Math.ceil(dataCount / dataPerPages);

       const Query = `SELECT * FROM crud LIMIT ${startLimit}, ${dataPerPages}`;
       con.query(Query, function (err, result) {
           if (err) throw err;
           res.render("pagedData", {
               data: result,
               pages: totalPages,
               CurrentPage: pageNo,
               lastPage: totalPages
           });
       })
   })

}

const product123 =(req,res)=>{
  const countQ = "SELECT COUNT(*) FROM crud";
   con.query(countQ, function (err, result) {
       if (err) throw err;

       let dataCount = result[0]["COUNT(*)"];
       let pageNo = req.query.page ? req.query.page : 1;
       let dataPerPages = req.query.data ? req.query.data : 2;
       let startLimit = (pageNo - 1) * dataPerPages;
       let totalPages = Math.ceil(dataCount / dataPerPages);

       const Query = `SELECT * FROM crud LIMIT ${startLimit}, ${dataPerPages}`;
       con.query(Query, function (err, result) {
           if (err) throw err;
           
           res.render("pagedDatauser", {
               data: result,
               pages: totalPages,
               CurrentPage: pageNo,
               lastPage: totalPages
           });
       })
   })

}


module.exports = {
    signIn,
   
    product123,
    dashboard,
    dashboard1,
    transporter,
    signUp,
    comment,
    
    index1,
    index,
    addnew,
    update,
    update1,
    delete1,
    product,
    fried,
    baked,
    cooked,
    name

}