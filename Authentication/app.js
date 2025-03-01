require("dotenv").config();
require("./config/database").connect();
const express = require('express');
var bcrypt = require('bcrypt');
var app = express();
const jwt = require('jsonwebtoken')
var path = require('path');
app.use(express.json());
//var hashPassword;
// var salt = bcrypt.genSalt(10);
var salt = "random";
//middleware
const auth = require("./middleware/auth");
app.use(express.urlencoded({extended:true}))

app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
//Logic Goes  Here

module.export = app ;
//importing user context
var User = require("./model/user");
const { secureHeapUsed } = require("crypto");
//=====================
// ROUTESr },
//=====================
// Showing home page
app.get("/", function (req, res) {
res.render('index', {
title: 'Website',
// name: '',
// email: '',
// password: ''    
})
});
// Showing secret page
// app.get("/home", isLoggedIn, function (req, res) {
// res.render("home");
// });
// Showing register form
app.get("/register", function (req, res) {
res.render('register', {
title: 'Registration Page',
first_name: '',
message:'Welcome to the registration page kindly fill the details below',
last_name: '',
email: '',
password: ''    
})
});

//Register
app.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    var { first_name, last_name, email, password,confirm_password } = req.body;
    // console.log(first_name);
    // console.log(last_name);
    // console.log(email);
    //  console.log(password);

    // Validate user input
    if (!(email && password && first_name && last_name && confirm_password)) {
      res.status(400).send("All input is required");
    }
    if(!(password===confirm_password)){
      return res.render('register',{
        title: 'Registration Page',
        first_name: '',
        message:'Passwords should match',
        last_name: '',
        email: '',
        password:'',
        confirm_password:''

      })
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    // console.log(oldUser.password);
    if (oldUser) {
      return res.render('login',
      {
        title :'Login Page',
        message:'User Already exists please login',
    })
  };

    //Encrypt user password
    // const encryptedPassword = bcrypt.genSalt(10, (err, salt) => {
    // bcrypt.hash(password, salt, function(err, hash) {
    //     // Store hash in the database
    // });

  //   const myPlaintextPassword = 's0/\/\P4$$w0rD';
  //   var encryptedPassword= bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
  //   // Store hash in your password DB.
  //   if(err){
  //     console.log(err);
  //   }
    
  //   //});
  // });
  
//    var securePassword = password;
//    const hashPassword = async (password, saltRounds = 10) => {
//     try {
//         // Generate a salt
//         const salt = await bcrypt.genSalt(saltRounds);

//         // Hash password
//         this.securePassword = await bcrypt.hash(password, salt);
//     } catch (error) {
//         console.log(error);
//     }

//     console.log(securePassword)
// //     // Return null if error
// //     return null;
//   }
// hashPassword(password);
// console.log(securePassword);
// // hashPassword(password);
// saltRounds = 10;

var securePassword = await bcrypt.hash(password,salt)
//console.log(password)
//console.log(securePassword);
  // Create user in our database
  var user = await User.create({
    first_name,
    last_name,
    email, // sanitize: convert email to lowercase
    password:securePassword
  })
console.log(user.password)

  // user.password = encryptedPassword;

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// .

//Login
//Showing login form
app.get("/login", function (req, res) {
res.render('login', {
title: 'Login',
message:'Welcome to login page please insert your credentials',
email: '',
password: ''     
})
});

// Our login logic starts here
app.post("/login",async (req,res) => {
  //Our Logic goes here

  try {
    // Get user input
    var { email, password } = req.body;
    console.log(password)
    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    console.log(user);
    //hash the password again
    // const saltRounds = 10;
    // const salt = await bcrypt.genSalt(saltRounds);
    // var securePassword = await bcrypt.hash(password,salt)
    // console.log(password)
    // console.log(securePassword)
    // password = securePassword;
      console.log(password);
      const validPassword= await bcrypt.compare(password, user.password )
        // ,(err,res) => {

      // if(err){
      //   console.log('Comparision Error', err);
      // }
    // });
    console.log(validPassword);
      if(validPassword) {
        return res.status(200).json(user); 
      }
  //   }).then(domatch => {
  //       if(domatch){
  //       // Create token
  //       const token = jwt.sign(
  //       { user_id: user._id, email },
  //         process.env.TOKEN_KEY,
  //       {
  //         expiresIn: "2h",
  //       }
  //     );

  //     // save user token
  //     user.token = token;

  //     // user
  //      return res.status(200).json(user);
  //   }
     else {res.status(400).send("Invalid Credentials");}
      
  //   });
  }
    catch (err) {
    console.log(err);
  }
  // Our register logic ends here

});


const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

//Server listening

app.listen(port,() => {
    console.log(`Server running on port ${port}`);
  });


