/**This will be the route file for the user resource */
const userController =require("../controllers/user.controller");
const auth = require("../middlewares/authjwt");
module.exports=(app)=>{
    /**
     * GET /crm/api/v1/users  -> user controller, findAll method should be called
     */
    // [auth.verifyToken,auth.isAdmin] this is middleware chaining
    //here we have patched middleware between route and controller
    app.get("/crm/api/v1/users",[auth.verifyToken,auth.isAdmin],userController.findAll);

    /**
     * endpoint for updating the user
     * PUT /crm/api/v1/users/vish01 ->then it should make a call to the user controller ->
     * and then controller will make a call to the update method
     */
    app.put("/crm/api/v1/users/:id",[auth.verifyToken,auth.isAdminOrOwner],userController.update);
}

