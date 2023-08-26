/**this will have the logic to route the request to differernt controllers */

const authController=require('../controllers/auth.controller');
module.exports=(app)=>{
    /**
     * define the route for signup
     * POST /crm/api/v1/authsignup-> auth controller signup method
     */
    app.post("/crm/api/v1/auth/signup",authController.signup);

    /**define the route for signin
     * POST /crm/api/v1/auth/signin-> auth controller signin method
     */
    app.post("/crm/api/v1/auth/signin",authController.signin);

}