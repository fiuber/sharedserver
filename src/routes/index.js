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
const businessUsersModel=require("./model/business-users")
const usersModel=require("./model/users")

//authorization
const app=auth.middleware(serversModel.authorized);
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

router.get("/users",app,users.list)
router.post("/users",app,users.add)
router.delete("/users",app,users.delete)
router.get("/users/:userId",app,users.get)
router.put("/users/:userId",app,users.update)

router.post("/users/validate",app,users.validate)

router.get("/users/:userId/cars",app,users.getCars)
router.post("/users/:userId/cars",app,users.addCar)
router.delete("/users/:userId/cars/:carId",app,users.deleteCar)
router.get("/users/:userId/cars/:carId",app,users.getCar)
router.put("/users/:userId/cars/:carId",app,users.updateCar)

module.exports = router;