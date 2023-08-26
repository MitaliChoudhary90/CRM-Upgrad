/**this file will have the logic to signup and signin users */


/**create a function to allow the user to sign in
 * 
 * whenever the user calls the endpoint
 * 
 * POST /crm/api/v1/signup ,router should call this method
 * 
 * since router will call this method, so this method should be available outside
 * 
 * Also, user must have passed the JSON request body...
 * and we want this JSON req body to be available as JS Object...
 * ...for that we will need body-parser
 */
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const jwt = require("jsonwebtoken");
const authConfig = require('../configs/auth.config');
exports.signup = async (req, res) => {
    /**logic to handel the signup */

    /**first read the request body and create the JS Object to be inserted in the DB */
    try {
        const userObj = {
            name: req.body.name,
            userId: req.body.userId,
            email: req.body.email,
            userType: req.body.userType,
            /**user will send data as plain text but we should encrypt it using bcrypt 
             * this 8 is a salt...it could be a string or a number anything
            */
            password: bcrypt.hashSync(req.body.password, 8)
        }

        /**i need to set the user status */
        if (!userObj.userType || userObj.userType == "CUSTOMER") {
            userObj.userStatus = "APPROVED";

        } else {
            userObj.userStatus = "PENDING";
        }

        /**Second-Insert the data in the database */
        const savedUser = await User.create(userObj);
        /**we could have directly sent the savedUser but it will contain the password too
         * so we will create another obj named postResponse without password and will send it instead
         */
        const postResponse = {
            name: savedUser.name,
            userId: savedUser.userId,
            email: savedUser.email,
            userType: savedUser.userType,
            userStatus: savedUser.userStatus,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt
        }
        /**Return the success response to the customer */
        res.status(201).send(postResponse);
    } catch (err) {
        console.log("error while registering the user", err.message);
        res.status(500).send({
            message: "some internal server error"
        });
    }
}



/**controller code for the login */
exports.signin = async (req, res) => {
    try {
        /** Read the userId and Password from the request body */
        const userIdFromReq = req.body.userId;
        const password = req.body.password;


        /**Ensure the userId is valid */
        const userSaved = await User.findOne({ userId: userIdFromReq });
        //User.findOne returns promise and since it's futuristic event therefor using await
        if (!userSaved) {
            return res.status(401).send({
                message: "User id is not correct"
            });
        }

        /**Ensure that the password passed is valid
         * plain text password
         * in DB we have encrypted password(using bcrypt)
         */
        const isValidPassword = bcrypt.compareSync(password, userSaved.password);
        if (!isValidPassword) {
            return res.status(401).send({
                message: "Incorrect Password!"
            });
        }


/**check if the user is in the approved state */
if(userSaved.userStatus !="APPROVED"){
    return res.status(403).send({
        message:"user is not approved for the login"
    });
}



        /**We need to generate the JWT based token(access token) */
        /**jwt is an external lib with a method called sign
         * for sign we need a payload( on the basis of userId are we creating this payload)
         * plus we need to provide some secret key also to create it
         * we also give a TTL (TIME TO LIVE) here we gave it as 600sec
         */
        const token = jwt.sign({
            id: userSaved.userId //this id is a payload
        }, authConfig.secret,
            {
                expiresIn: 600
            });

        /**send the response */
        res.status(200).send({
            name: userSaved.name,
            userId: userSaved.userId,
            email: userSaved.email,
            userType: userSaved.userType,
            userStatus: userSaved.userStatus,
            accessToken: token
        });
    } catch (err) {
        console.log("error while login", err.message);
        res.status(500).send({
            message: "internal server error"
        });
    }
}