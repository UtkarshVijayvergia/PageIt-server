const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')






//---------------------------------------------------------------------------------------- connecting to mongodb atlas

dotenv.config({ path: './config.env' });   // used dotenv for securing keys // just declare here to use env variables anywhere
require('./db/connection')

// new collection inside database
const User = require('./model/userSchema'); 

//--------------------------------------------------------------------------------------------------------------------


app.use(express.json());   // for testing purposes using postman



//---------------------------------------------- middleware (used for showing content avilable only after logging in)

// const middleware = (res, req, next) => {
//     console.log("middleware content");
//     next()
// }

//--------------------------------------------------------------------------------------------------------------------






//---------------------------------------------- link route files

app.use(require('./routes/auth'));

//--------------------------------------------------------------------------------------------------------------------






//--------------------------------------------------------------------------------------------------------------------

// app.get('/', (req, res) => {
//     res.send("hello from server side");
// });



// app.get('/login', (req, res) => {
//     res.send("login from server side");
// });


 
// app.get('/register', (req, res) => { 
//     res.send("signup from server side");
// });

 

// app.get('/dashboard', middleware, (req, res) => {
//     res.send("dashboard from server side");
// });


//--------------------------------------------------------------------------------------------------------------------


const port = process.env.PORT

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});