const { response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema")


const verifiedUser = async (req, res, next) => {
    try{
        // get token
        const token = req.cookies.jwtToken; // jwtToken is name of my cookie
        // console.log(token);
        // verify token
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifyToken); // verify has all the data now 
        // check that user and get info of all the fields of that user from database
        const userDetails = await User.findOne({ _id: verifyToken._id, "tokens.token": token }) // tokens.token because our token is save in an array token which is inseide tokens object ----> check userSchema
        // console.log(userDetails);

        if(!userDetails){
            throw new Error("User not found")
        }

        // console.log(req.token);
        req.token = token;
        // console.log(req.token);

        // console.log(req.userDetails);
        req.userDetails = userDetails;
        // console.log(req.userDetails)

        // console.log(req.userID);
        req.userID = userDetails._id;
        // console.log(req.userID);

        next();


    }
    catch(err){
        response.status(401).send("Unauthorized: No token provided");
        console.log(err);
    }
}


module.exports = verifiedUser;