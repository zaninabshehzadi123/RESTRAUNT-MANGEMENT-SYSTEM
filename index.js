const express = require("express");
const app = express();
const ejs = require("ejs");
path = require("path"),
mysql = require("mysql");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, "./public/images") },
    filename: function (req, file, cb) { cb(null, file.originalname) }
})
const upload = multer({ storage: storage });


const con = mysql.createConnection({ 
    host: "localhost",
    user: "root",
    password: "",
    database: "crudactivity",
  })
con.connect(function (err){
    if (err) throw err;
    console.log('connected')
})
app.set("view engine", "ejs");





app.post("/", upload.single("profile1"), (req,res)=>{
    if (!req.file) {
        return req.statusCode(404).send("No File Recieved!");
    }

    const name = req.body.name1;
    const email = req.body.email1;
    const pass = req.body.password1;
    const qual = req.body.qual;
    const city = req.body.city;
    const profilepicName = req.file.originalname;

    const Query = `INSERT INTO doctor VALUES ('${name}','${pass}','${email}','${qual}','${city}','${profilepicName}' )`;
    con.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect("/");
    })
})



app.post("/update", upload.single("profile1"), (req,res)=>{
    if (!req.file) {
        return req.statusCode(404).send("No File Recieved!");
    }

    const name = req.body.name1;
    const email = req.body.email1;
    const pass = req.body.password1;
    const qual = req.body.qual;
    const city = req.body.city;
    const profilepicName = req.file.originalname;

    const Query = `Update doctor set name='${name}', email='${email}',qual='${qual}', city='${city}', pic='${profilepicName}' where email='${email}' `;
    con.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect("/");
    })
})

// static files
app.use(express.static(path.join(__dirname, "public")));

// starting the server
app.listen(5002, () => {
  console.log(`server on port 5002`);
});

app.get("/", (req, res) => {


    con.query('SELECT * FROM doctor',function (err,result){
    if(err) throw err;
    console.log(result);
    res.render("index", {data: result});
});
});



app.get("/update/:id", (req, res)=>{

    const mail = req.params.id;
    con.query(`SELECT * FROM doctor where email='${mail}'`,function (err,result){
        if(err) throw err;
        console.log(result);

    res.render("update", {data: result});
})
});


app.get("/addnew", (req, res)=> {
    res.render('addnew');
})




