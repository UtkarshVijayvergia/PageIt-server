const express = require('express');
const User = require('../model/userSchema'); // register schema (format)
const routes = express.Router();
const bcrypt = require('bcryptjs') // for hashing password & confirmPassword
const jwt = require('jsonwebtoken')
const verifiedUser = require("../middleware/verifiedUser");
const { Router } = require('express');

// passing cookies (user will only be able to enter dashboard page when cookies are also verified)
const cookieParser = require("cookie-parser");
routes.use(cookieParser()) 
//-----------------------------------------------------------------

routes.get('/', (req, res) => {
    res.send("hello from server side rotes");
});





// registeration....records added and checked if email already exists in mongoDB using promise
//-----------------------------------------------------------------------------------------------------------------------------------------
// routes.post('/register', (req, res) => {
//     // console.log(req.body);  // for getting all the info --- post method in mern => req.body.fieldName.....to get info about particaular field
//     // res.json({ message: req.body }); 

//     const { firstName, lastName, email, phone, password, confirmPassword } = req.body;
//     // console.log(firstName);  // now no need to use req.body....only field name is enough

//     if( !firstName || !lastName || !email || !phone || !password || !confirmPassword ){
//         return res.status(422).json({ error: "please fill all the fields" });
//     }

//     // 1 email id can only register once so check if that email exist....if not register
//     User.findOne({ email: email })
//     .then((emailExist) => {
//         if(emailExist){
//             return res.status(422).json({ error: "email already exists" })
//         }

//         const user = new User({ firstName, lastName, email, phone, password, confirmPassword });
//         // save the user or insert user info in mongodb atlas
//         user.save()
//         .then(() => {
//             res.status(201).json({ message: "user registered succesfully. please login to continue" });
//         })
//         .catch((err) => {
//             res.status(500).json({ error: "failed to register the user" });
//         })
//     })
//     .catch((err) => {
//         console.log(err);
//     })
// });
//-----------------------------------------------------------------------------------------------------------------------------------------







// using async await --> better choice
//-----------------------------------------------------------------------------------------------------------------------------------------
// the data from signup in react app will come here
routes.post('/register', async (req, res) => {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

    if( !firstName || !lastName || !email || !phone || !password || !confirmPassword ){
        return res.status(422).json({ error: "please fill all the fields" });
    }

    try{
        const emailExist = await User.findOne({ email: email })
        if(emailExist){
            return res.status(422).json({ error: "email already exists" })
        }
        else{
            const user = new User({ firstName, lastName, email, phone, password, confirmPassword });
            const saveUser = await user.save();
            if(saveUser){
                res.status(201).json({ message: "user registered succesfully. please login to continue" });
            }
            else{
                res.status(500).json({ error: "failed to register the user" });
            }
        }
    }

    catch(err){
        console.log(err);
    }

});
//-----------------------------------------------------------------------------------------------------------------------------------------










//------------------------------------------------------------------------------------------------------------LOGIN ROUTE
// the data from login of front end will come here
routes.post('/login', async (req, res) =>{
    // console.log(req.body);
    try{
        const { email, password } = req.body;
        if( !email || !password){
            console.log("Please fill all the fieds")
            // window.alert("Please fill all the fieds")
            // return res.status(400).json();
        }

        else{
            const userLogin = await User.findOne({ email: email });  
                // userlogin contains all the fields info (in array form)
    
        //--------------------------hashed password verification------------------------------
            if(userLogin){
                const isMatch = await bcrypt.compare(password, userLogin.password);
    
                
                const token = await userLogin.generateAuthToken();
                // store the token on cookies 
                res.cookie("jwtToken", token, {         // jwtToken is name of my cookie---> u can keep it anything
                    expires: new Date(Date.now() + 2592000000),
                    // 30 days in minisecond = 2592000000
                    httpOnly: true,
                    // because now it will work when site in not secured and right now localhost is not secured
                })
                // what we did is session management
            
                if(!isMatch){
                    console.log("Invalid Credentials. Please Register if new User")
                    // res.status(400).json();
                }
                else{
                    console.log("User signed in succesfully")
                    res.json({ message: "User Signed Successfully" })
                }
            }
        //-------------------------------------------------------------------------------------
            else{
                console.log("Invalid Credentials. Please Register if new User")
                // res.status(400).json();
            }
            
        }

    }

    catch(err){
        console.log(err);
    }
})

//-----------------------------------------------------------------------------------------------------------------------------------------




 



//-------Dashboard Page-----------------------------------------------------------------------------------------------------------------

routes.get('/dashboard', verifiedUser, (req, res) => {
    // console.log("dashboard from serve r side");  
    res.send(req.userDetails);
});

//-----------------------------------------------------------------------------------------------------------------------------------------


 



//-----------------------------------------------------------------------------------------------------------------------------------------

routes.post('/postdata', verifiedUser, async(req, res) => {
    try{
        const message =  req.body
        if(!message){
            return res.json({error: "please fill the textbox"});
        }

        const userInfo = await User.findOne({_id: req.userID});
        console.log(userInfo);
        if(userInfo){
            const userMessage = await userInfo.addMessage(message);
            await userInfo.save();
            res.status(201).json({message: "Data sent successfully"})
        }
    }
    catch(err){
        console.log(err);
    }
});


//-----------------------------------------------------------------------------------------------------------------------------------------
 





module.exports = routes