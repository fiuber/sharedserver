let assert=require("chai").assert;
var request = require('supertest');
const run=require("./run");

describe("testing /business-users", function(){
    let app=null;
    let agent=null;
    let authValue="";

    function restart(){
        if(app!=null) app.close();

        app =require("../server.js");
        agent=request.agent(app);
        return require("../restartDatabase.js")()
    }

    function loginAdmin(){
        return agent
        .post("/token")
        .send({username:"admin",password:"admin"}).then((res)=>{
            authValue="api-key "+res.body.token.token;
        })
    }

    describe("POST a business user and then DELETE it",function(){
        before(function(){
            return restart().then(loginAdmin);
        })

        it("POST /business-users returns a good user",function(){
            return agent
            .post("/business-users")
            .set("authorization",authValue)
            .send({
                username:"pepenacho",
                password:"pepeword",
                name:"jose",
                surname:"sbru",
                roles:[
                    "user"
                ]
            })
            .expect(201)
            .expect((res)=>{
    
                assert.include(res.body.businessUser,{
                    username:"pepenacho",
                    password:"pepeword",
                    name:"jose",
                    surname:"sbru",
                })
                assert.sameMembers(res.body.businessUser.roles,["user"]);
            })
        })

        it("POST the same user again returns 500",function(){
            return agent
            .post("/business-users")
            .set("authorization",authValue)
            .send({
                username:"pepenacho",
                password:"pepeword",
                name:"jose",
                surname:"sbru",
                roles:[
                    "user"
                ]
            })
            .expect(500)
        })

        it("UPDATE the user",function(){
            return agent
            .put("/business-users/pepenacho")
            .set("authorization",authValue)
            .send({
                username:"pepenacho",
                password:"perejil",
                name:"jose",
                surname:"sbru",
                roles:[
                    "user"
                ]
            })
            .expect(200)
        })

        

        it("GET the same user gets the info again",function(){
            return agent
            .get("/business-users/pepenacho")
            .set("authorization",authValue)
            .expect(200)
            .expect((res)=>{
                assert.include(res.body.businessUser,{
                    username:"pepenacho",
                    password:"perejil",
                    name:"jose",
                    surname:"sbru"
                })
            })
        })



        it("GETting me gets th admin",function(){
            return agent
            .get("/business-users/me")
            .set("authorization",authValue)
            .expect(200)
            .expect((res)=>{
                assert.include(res.body.businessUser,{
                    username:"admin",
                    password:"admin",
                })
            })
        })

        it("PUT me",function(){
            return agent
            .put("/business-users/me")
            .set("authorization",authValue)
            .send({
                username:"admin",
                password:"admin",
                name:"macho",
                surname:"sbru",
                roles:[
                    "user"//SE IGNORA!
                ]
            })
            .expect(200)
        })

        it("GETting me gets the info again",function(){
            return agent
            .get("/business-users/me")
            .set("authorization",authValue)
            .expect(200)
            .expect((res)=>{
                assert.include(res.body.businessUser,{
                    username:"admin",
                    password:"admin",
                    name:"macho",
                    surname:"sbru"
                })
            })
        })

        it("GET /business-users returns both users",function(){
            return agent
            .get("/business-users")
            .set("authorization",authValue)
            .expect(200)
            .expect((res)=>{
                let result1=res.body.businessUser.some((u)=>{
                    return u.username==="admin" && u.password==="admin";
                })
                let result2=res.body.businessUser.some((u)=>{
                    return u.username==="pepenacho" && u.password==="perejil";
                })

                assert.isTrue(result1,"admin is contained");
                assert.isTrue(result2,"pepenacho is contained");
            })
        })

        it("DELETE the user",function(){
            return agent
            .delete("/business-users/pepenacho")
            .set("authorization",authValue)
            .expect(204);
        })

        it("DELETE the user again gives 404",function(){
            return agent
            .delete("/business-users/pepenacho")
            .set("authorization",authValue)
            .expect(404);
        })

        it("GET /business-users returns only admin",function(){
            return agent
            .get("/business-users")
            .set("authorization",authValue)
            .expect(200)
            .expect((res)=>{
                assert.deepInclude(res.body.businessUser[0],{
                    username:"admin",
                    password:"admin"
                });
                assert.equal(res.body.businessUser.length,1);
            })
        })
    })

    describe("A Manager is unathorized for most things",function(){
        before(function(){
            return restart().then(loginAdmin);
        })

        it("POST to /business-users",function(){
            return agent
            .post("/business-users")
            .set("authorization",authValue)
            .send({
                username:"pepenacho",
                password:"pepeword",
                name:"jose",
                surname:"sbru",
                roles:[
                    "manager"
                ]
            })
            .expect(201)
        })

        it("login as that user",function(){
            return agent
            .post("/token")
            .send({
                username:"pepenacho",
                password:"pepeword"
            })
            .expect(201)
            .expect((res)=>{
                authValueOther="api-key "+res.body.token.token;
                assert.isAbove(res.body.token.expiresAt,Date.now());
            })
        })

        it("Profile user cant create businessusers",function(){
            return agent
            .post("/business-users")
            .set("authorization",authValueOther)
            .send({
                username:"gomez",
                password:"pepeword",
                name:"jose",
                surname:"sbru",
                roles:[
                    "user"
                ]
            })
            .expect(401);
        })

        it("Profile user cant get all businessusers",function(){
            return agent
            .get("/business-users")
            .set("authorization",authValueOther)
            .expect(401);
        })

        it("Profile user cant remove a businessusers",function(){
            return agent
            .delete("/business-users/admin")
            .set("authorization",authValueOther)
            .expect(401);
        })

        it("Profile user cant update a businessusers",function(){
            return agent
            .put("/business-users/admin")
            .set("authorization",authValueOther)
            .send({
                username:"gomez",
                password:"pepeword",
                name:"jose",
                surname:"sbru",
                roles:[
                    "user"
                ]
            })
            .expect(401);
        })

    })

    describe("login attempts",function(){
        before(function(){
            return restart();
        })

        it("bad everything",()=>{
            return agent
            .post("/token")
            .send({
                username:"yo",
                password:"ca",
            })
            .expect(404)
        })

        it("bad pw",()=>{
            return agent
            .post("/token")
            .send({
                username:"admin",
                password:"ca",
            })
            .expect(404)
        })

        it("bad un",()=>{
            return agent
            .post("/token")
            .send({
                username:"yo",
                password:"admin",
            })
            .expect(404)
        })

        it("alright",()=>{
            return agent
            .post("/token")
            .send({
                username:"admin",
                password:"admin",
            })
            .expect(201)
        })
    })
/*
    describe("Pagination",function(){
        it("add 10")
    })
*/

})