const express=require("express");
const expressify=require("./expressify");

var router = express.Router();
const auth =require("./auth");

router.get('/', (req, res) => {
    res.send('Hello world\n');
});


//autorizacion
router.get("/login", auth.login);
router.get("/logout", auth.logout);
router.get("/register", auth.register);

const app=auth.middleware("app");
const admin=auth.middleware("admin");
const manager=auth.middleware("manager");
const user=auth.middleware("user");

//servers
const original=require("./model/servers.js");
const translator=require("./modelTranslate/servers.js");
const translated=require("./modelTranslate")(original,translator);
const servers=expressify.all(translated,{"version":"1"});

router.post("/servers/ping",app, servers.ping);
router.post("/servers",manager, servers.add);
router.put("/servers/:serverId",manager, servers.update);
router.post("/servers/:serverId",manager, servers.updateToken);
router.delete("/servers/:serverId",manager, servers.delete);
router.get("/servers",manager, servers.list);
router.get("/servers/:serverId",manager, servers.get);

module.exports = router;