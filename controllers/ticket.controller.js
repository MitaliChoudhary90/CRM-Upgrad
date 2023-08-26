/**Controller method for creating tickets 
 * 1. User is authenticated  -- this is already taken care by auth middleware
 * 2. req body is validated -- done in middleware
 * 3. insert the ticket body
*/

const userModel = require("../models/user.model");
const ticketModel = require("../models/ticket.model");
exports.createTicket = async (req, res) => {
    //Create the ticketObject from the request body
    try {
        const reqObj = {
            title: req.body.title,
            ticketPriority: req.body.ticketPriority,
            description: req.body.description,
            status: req.body.status,
            reporter: req.userId// this userId will be retrived from the access token

        }

        /**
         * I need to assign one engineer to this ticket
         * Assignment:
         * change the below code to assign that engineer.... 
         * ...who has least number of tickets assigned
         */

        const engineer = await userModel.findOne({
            userType: "ENGINEER",
            userStatus: "APPROVED"
        });
        if (engineer) {
            reqObj.assignee = engineer.userId;
        }
        const ticketCreated = await ticketModel.create(reqObj);
        if (ticketCreated) {
            /**
             * need to update the customer document
             */
            const customer = await userModel.findOne({ userId: req.userId });
            customer.ticketsCreated.push(ticketCreated._id);
            await customer.save();

            /**
             * update the engineer document if assigned
             */
            if (engineer) {
                engineer.ticketAssigned.push(ticketCreated._id);
                await engineer.save();
            }
            res.status(201).send(ticketCreated);

        }
    } catch (err) {
        console.log("error while creating the ticket", err.message);
    }

}
/**
 * Method to fetch all the users
 */
exports.getTickets = async (req, res) => {
    try {
        /**
         * first fetch the details of the user who is making the call
         */
        const userId = req.userId;
        const callingUserObj = await userModel.findOne({ userId: userId });

        const queryObj = {};

        /**Then make the query object based on the type of user */

        if (callingUserObj.userType == "CUSTOMER") {
            queryObj.reporter = req.userId;
        } else if (callingUserObj.userType == "ENGINEER") {
            queryObj.$or = [{ reporter: req.userId }, { assignee: req.userId }];
            console.log(queryObj);
        }

        /**finally return the result */
        const tickets = await ticketModel.find(queryObj);
        return res.status(200).send(tickets);
    } catch(err) {
        console.log("error while fetching tickets, err.message");
        res.status(500).send({
            message:"Internal Server Error"
        });

    }

}