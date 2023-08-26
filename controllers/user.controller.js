/**this file will contain the logic to fetch all the users
 * 
 * 1- make sure that the user who is trying to make a call to this controller is a valid user
 * 2- he should be ADMIN
 * above validation should be done as the part of the middleware
 */
const User=require("../models/user.model");
const objectConverter=require("../utils/objectConverter");
exports.findAll=async (req,res)=>{
    try{
        /**
         * Read the query params if any
         */
    const queryObj={};
    const userTypeQ=req.query.userType;
    if(userTypeQ){
        queryObj.userType=userTypeQ;
    }
    const userStatusQ=req.query.userStatus;
    if(userStatusQ){
        queryObj.userStatus=userStatusQ;
    }
    const users=await User.find(queryObj);
    res.status(200).send(objectConverter.userResponse(users));
    }catch(err){
        console.log("Error while fetching the users", err.message);
        res.status(500).send({
            message:"Internal server error while fetching the users"
        });
    }
}

/**
 * Controller method to update the user record
 * 1. Only the admin and the user is allowed to update the user record
 * 
 * this has to be done in the middleware
 */

exports.update=async (req,res)=>{
    try{
    /**
     * fetch the user object if it is present  
     */

        const user =await User.findOne({userId:req.params.id});
        if(!user){
            return res.status(404).send({
                message:"user with the given id to be updated is not found"
            });
        }
    /**
     * and update the user object based on the request
     * 
     * the user object is the transient object, 
     * i.e. the user object is tied to the document in the database
     * so if we want to make any change in this user object, following is the way
     */
    user.name=req.body.name != undefined ?req.body.name : user.name;
    user.userStatus=req.body.userStatus != undefined ?req.body.userStatus : user.userStatus;
    user.userType=req.body.userType != undefined ?req.body.userType : user.userType;
    /**
     * save the user object and return the updated object
     * this save methode allows us to push all the changes made into the object here into the document 
     */

    const updatedUser=await user.save();
    res.status(200).send({
        name:updatedUser.name,
        userId:updatedUser.userId,
        userStatus:updatedUser.userStatus,
        email:updatedUser.email,
        userType:updatedUser.userType
    })

    }catch(err){
        console.log("Error while updating the user ", err.message);
        res.status(500).send({
            message: "Internal Server error while updating the records"
        });

    }
    
}