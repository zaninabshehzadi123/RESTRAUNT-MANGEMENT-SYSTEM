
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const control = require("../controllers/controller");
const {Authentication,Authentication1} = require("../middlewares/auth");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const path = require("path");
const mysql = require("mysql");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cookieParser());
router.use(
    session({
        secret: "@@11223344@@",
        resave: false,
        saveUninitialized: true,
        cookie: { path: "/", httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
    })
);

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

router.get("/signup", (req, res) => { res.render("signup"); });
router.post("/signup", control.signUp);

//2nd step

router.get("/signin", (req, res) => { res.render("signin");});
router.post("/signIn", control.signIn);

//3rd step
//router.get("/admin", (req, res) => { res.render("admin");});
//router.get("/user", (req, res) => { res.render("user");});
router.get("/dashboard", Authentication, control.dashboard);
router.get("/dashboard1", Authentication1, control.dashboard1);

//remaining steps
router.get("/contact", (req, res) => { res.render("contact"); });
router.get("/menu", (req, res) => { res.render("menu");});
router.get("/menu1", (req, res) => { res.render("menuuser");});
router.get("/services", (req, res) => { res.render("services");});
router.get("/billpay", (req, res) => { res.render("billpay");});

router.get("/ratings", (req, res) => { res.render("ratings");});

router.get("/clock", (req, res) => { res.render("clock");});
router.get("/bill", (req, res) => { res.render("bill");});


router.get("/logout", (req,res)=>{
    req.session.admin = null;
    req.cookies.CurrentRole = "";
    res.redirect("/");
})

router.get("/logoutUser", (req,res)=>{
    req.session.user = null;
    req.cookies.CurrentRole = "";
    res.redirect("/");
})


router.get("/", control.index);
router.get("/index1", control.index1);
router.get("/addnew", (req, res) => {
  res.render("addnew");
});

router.post("/addnew",upload.single("profile1"),control.addnew);
router.post("/update/:id", upload.single("profile1"),control.update);
router.get("/update/:id",control.update1);
router.get("/del/:id",control.delete1);

router.get("/comment", (req, res) => {
  res.render("comment");
});

router.post("/comment",control.comment);


router.get("/fried",control.fried);
router.get("/baked",control.baked);
router.get("/cooked",control.cooked);
router.post("/searchByName",control.name); 
  

router.get('/products',control.product)
router.get('/p1',control.product123)
  


  
 
module.exports = router;