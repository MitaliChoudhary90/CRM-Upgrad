/**here we should have two methods-:
 * 1- middlewares to validate the access tokens */
const jwt=require('jsonwebtoken');
const config=require("../configs/auth.config");
const userModel = require('../models/user.model');
 verifyToken=(req,res,next)=>{
    /**if the token is present */
    const token=req.headers['x-access-token'];//token will be in header
    if(!token){
        return res.status(403).send({
            message: "No token provided"
        });
    }
    /**if the token is valid */
    jwt.verify(token,config.secret,(err, decoded)=>{
        if(err){
            return res.status(401).send({
                message:"invalid token"
            });
        }
        console.log("token is valid");

        /**Fetch the userId from token and set it to the request object */
        req.userId=decoded.id; //decoded.id is the userId
        next();
    })
}

/**middleware to go and check if the user is ADMIN */

const isAdmin=async (req,res,next)=>{
    const user =await userModel.findOne({userId:req.userId});
    if(user && user.userType == "ADMIN"){
        next();
    }else{
        return res.status(403).send({
            message:"Only ADMIN user allowed"
        });
    }
}

/**Middleware to check if the user id Admin or the owner */

const isAdminOrOwner=async(req,res,next)=>{
    const callingUser=await userModel.findOne({userId:req.userId});

    if(callingUser.userType=="ADMIN" || callingUser.userId==req.params.id){
        if(req.body.userStatus && callingUser.userType != 'ADMIN'){
            return res.status(403).send({
                message:"Only ADMIN is allowed to change the Status"
            });
        }
        next();
    }else{
        return res.status(403).send({
            message: "only admin or owner of the resource is allowed to update"
        });
    }
}


module.exports={
    verifyToken: verifyToken,
    isAdmin:isAdmin,
    isAdminOrOwner:isAdminOrOwner
}