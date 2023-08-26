/**need a function which take an array of user objects
 * remove the sensitive informations(like password) and then
 * return the response
 */

exports.userResponse=(users)=>{
    const userResult=[];
    users.forEach(user => {
        userResult.push({
            name :user.name,
            userId:user.userId,
            email:user.email,
            userType:user.userType,
            userStatus:user.userStatus

        });
        
    });
    return userResult;
}