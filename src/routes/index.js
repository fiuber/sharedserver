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
//router.post("/logout", public,businessUsers.logout);

router.get("/business-users", admin, businessUsers.list);
router.post("/business-users", admin, businessUsers.add);
router.get("/business-users/:userId", user, businessUsers.get);
router.delete("/business-users/:userId", admin, businessUsers.delete);
router.put("/business-users/:userId", admin, businessUsers.update);

//router.get("/business-users/me", user, businessUsers.getMe);
//router.put("/business-users/me", user, businessUsers.updateMe);


module.exports = router;