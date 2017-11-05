const express=require("express");
const expressify=require("./expressify");

var router = express.Router();
const auth =require("./auth");
/*
router.get('/', (req, res) => {
    res.send('Hello world\n');
});
*/

//models
const serversModel=require("./model/servers.js");
const businessUsersModel=require("./model/business-users");
const usersModel=require("./model/users");
const rulesModel=require("./model/rules");
const rulesRunModel=require("./model/rules-run");
const tripsModel=require("./model/trips");
const transactionsModel=require("./model/transactions");

//authorization
const app=auth.middleware(serversModel.authorized);
const appOrUser=auth.middleware(serversModel.authorized,businessUsersModel.authorizedRoles("user","admin","manager"));
const appOrManager=auth.middleware(serversModel.authorized,businessUsersModel.authorizedRoles("admin","manager"));
const admin=auth.middleware(businessUsersModel.authorizedRoles("admin"));
const manager=auth.middleware(businessUsersModel.authorizedRoles("manager","admin"));
const user=auth.middleware(businessUsersModel.authorizedRoles("user","manager","admin"));
const public=auth.middleware(auth.any);

//servers
const sTranslator=require("./modelTranslate/servers.js");
const sTranslated=require("./modelTranslate")(serversModel,sTranslator);
const servers=expressify.all(sTranslated,{"version":"1"});

router.post("/servers/ping",app, servers.ping);
router.post("/servers",manager, servers.add);
router.put("/servers/:serverId",manager, servers.update);
router.post("/servers/:serverId",manager, servers.updateToken);
router.delete("/servers/:serverId",manager, servers.delete);
router.get("/servers",manager, servers.list);
router.get("/servers/:serverId",manager, servers.get);

//business-users
const buTranslator=require("./modelTranslate/business-users.js");
const buTranslated=require("./modelTranslate")(businessUsersModel,buTranslator);
const businessUsers=expressify.all(buTranslated,{"version":"1"});

router.post("/token", public,businessUsers.token);

router.get("/business-users/me", user, businessUsers.getMe);
router.put("/business-users/me", user, businessUsers.updateMe);

router.get("/business-users", admin, businessUsers.list);
router.post("/business-users", admin, businessUsers.add);
router.get("/business-users/:userId", user, businessUsers.get);
router.delete("/business-users/:userId", admin, businessUsers.delete);
router.put("/business-users/:userId", admin, businessUsers.update);

//business data model
const usersTranslator=require("./modelTranslate/users.js");
const usersTranslated=require("./modelTranslate")(usersModel,usersTranslator);
const users=expressify.all(usersTranslated,{"version":"1"});

router.get("/users",appOrUser,users.list)
router.post("/users",appOrManager,users.add)
router.delete("/users/:userId",appOrManager,users.delete)
router.get("/users/:userId",appOrUser,users.get)
router.put("/users/:userId",appOrManager,users.update)

router.post("/users/validate",appOrManager,users.validate)

router.get("/users/:userId/cars/",appOrUser,users.getCars)
router.post("/users/:userId/cars/",appOrManager,users.addCar)
router.delete("/users/:userId/cars/:carId",appOrManager,users.deleteCar)
router.get("/users/:userId/cars/:carId",appOrUser,users.getCar)
router.put("/users/:userId/cars/:carId",appOrManager,users.updateCar)


//rules CRUD
const rulesTranslator=require("./modelTranslate/rules.js");
const rulesTranslated=require("./modelTranslate")(rulesModel,rulesTranslator);
const rules=expressify.all(rulesTranslated,{"version":"1"});
router.get("/rules",manager,rules.getRules);
router.post("/rules",manager,rules.addRule);

router.get("/rules/:ruleId",manager,rules.getRule);
router.delete("/rules/:ruleId",manager,rules.deleteRule);
router.put("/rules/:ruleId",manager,rules.modifyRule);

router.get("/rules/:ruleId/commits",manager,rules.getCommits);
router.get("/rules/:ruleId/commits/:commitId",manager,rules.getCommit);

//running rules
const rulesRunTranslator=require("./modelTranslate/rules-run.js");
const rulesRunTranslated=require("./modelTranslate")(rulesRunModel,rulesRunTranslator);
const rulesRun=expressify.all(rulesRunTranslated,{"version":"1"});
router.post("/rules/run",admin,rulesRun.runMany);
router.post("/rules/:ruleId/run",admin,rulesRun.runOne);


//trips

const payer={
    pay:function(asd,efg){
        return Promise.resolve(true);
    },
    paymentMethods:function(){
        return Promise.resolve(["cheque"]);
    }
}

const costCalculator=rulesRunModel;

const tripsTranslator=require("./modelTranslate/trips.js");
const tripsTranslated=require("./modelTranslate")(tripsModel,tripsTranslator);
const trips=expressify.all(tripsTranslated,{"version":"1"});
tripsModel.addTrip(payer,costCalculator)
router.post("/trips",app,trips.addTripWithPayer);
router.get("/users/:userId/trips",app,trips.getUserTrips);
router.get("/trips/:tripId",app,trips.getTrip);
router.post("/trips/estimate",app,trips.estimate);



//running rules
transactionsModel.setPayer(payer);
const transactionsTranslator=require("./modelTranslate/transactions.js");
const transactionsTranslated=require("./modelTranslate")(transactionsModel,transactionsTranslator);
const transactions=expressify.all(transactionsTranslated,{"version":"1"});
router.post("/users/:userId/transactions",app,transactions.addTransaction);
router.get("/users/:userId/transactions",appOrUser,transactions.getTransactions);



module.exports = router;