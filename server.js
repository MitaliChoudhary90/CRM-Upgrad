/** This should be the starting point of the application
 */

/**
 * we need the port number which is present in the config folder
 */
const serverconfig= require('./configs/server.config');
const express=require('express');
const dbconfig=require('./configs/db.config');
const app=express();
const bodyParser=require('body-parser');
const User=require('./models/user.model');
const bcrypt=require("bcryptjs");
app.use(bodyParser.json());//convert JSON into JS Object and vice versa

/** if extended:false, that means it wil encode the URL if it contains just pure string
 * but if extended:true means the Url may contain some special characters 
 * and it will still understand the URL and will parse it... that's what URL encoding means
 */
app.use(bodyParser.urlencoded({extended:true}));

/**
 * i need to connect to the database
 */

const mongoose=require('mongoose');
mongoose.connect(dbconfig.DB_URL);
/**TO CHECK IF THE CONNECTION WAS A SUCCESS OR FAILURE WE HAVE USED mongoose.connection event */
const db= mongoose.connection;
db.on('error',()=>{
    console.log("error connecting to the DB");
});
db.once("open",()=>{
    console.log("Connected to the Database");
    /**write the logic to clean and initialise the DB */
    

    //init(); 


    //commented out the above line so that...
    //... we don't need to make cust, engg or admin again and again in db
});

async function init(){
    /**delete the user collection if it's already present */
    await User.collection.drop();
    /**we should create one ADMIN user ready from the backend */
    const user= await User.create({
        name:"vishwa",
        userId:"admin",
        password: bcrypt.hashSync("welcome1",8),
        email:"knkvish@gmail.com",
        userType:"ADMIN"
    });
    console.log(user);
}
/**pluggin in the route */
require("./routes/auth.route")(app);
require("./routes/user.routes")(app);
require("./routes/ticket.route")(app);
//to start the server
app.listen(serverconfig.PORT,()=>{
    console.log('Server started on the port number :', serverconfig.PORT);
})