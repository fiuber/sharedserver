let assert=require("chai").assert;
var request = require('supertest');

describe("using users",function(){
    var app;
    let agent=null;
    let authValue="";
    let serverId="";
    before(function(){
        this.timeout(5000);
        app =require("../server.js");
        agent=request.agent(app);
        return require("../restartDatabase.js")()
        .then(()=>{//login
            return agent
            .post("/token")
            .send({username:"admin",password:"admin"}).then((res)=>{
                authValue="api-key "+new Buffer(res.body.token.token+" admin").toString("base64");
                //hago request.set("authorization",authValue) todo el tiempo
            })
        }).then(()=>{//POST a new server and keep the id
            var datosEnviados={
                "id":"asder",
                "_ref" :"asder",
                "createdBy":"jiji",
                "createdTime":50,
                "name":"server",
                "lastConnection":1998
            };
            return agent
            .post("/servers")
            .set("authorization",authValue)
            .send(datosEnviados)
            .expect((res)=>{
                assert.equal(res.statusCode,201);
                let token = res.body.server.token.token;
                authValue="api-key "+new Buffer(token).toString("base64");
                serverId=res.body.server.server.id;
            })
        })
    });

    it("add a not-fb user",function(){
        return agent
        .post("/users")
        .set("authorization", authValue)
        .send({
            _ref:"1",
            type:"passenger",
            username:"soyyo5159",
            password:"5159",
            firstName:"José",
            lastName:"Ignacio",
            country:"Argentina",
            email:"soyyo5159@hotmail.com",
            birthdate:"oneday",
            images:[
                "serio.png",
                "muy serio.png",
                "playa.png"
            ]
        })
    })

    describe("login as that user",function(){
        it("login as a normal user",function(){
            return agent
            .post("/users/validate")
            .set("authorization", authValue)
            .send({
                username:"soyyo5159",
                password:"5159"
            }).expect(201)//fuera de la documentación, pero arreglarlo es demasiado complejo
        })
    
        it("login as a fb user",function(){
            return agent
            .post("/users/validate")
            .set("authorization", authValue)
            .send({
                username:"soyyo5159",
                facebookAuthToken:"face"
            }).expect(400)
        })
    
        it("login as a normal user,bad credentials",function(){
            return agent
            .post("/users/validate")
            .set("authorization", authValue)
            .send({
                username:"soyyo5159",
                password:"52"
            }).expect(400)
        })
    })
    

    it("add a fb user",function(){
        return agent
        .post("/users")
        .set("authorization", authValue)
        .send({
            _ref:"78",
            type:"passenger",
            username:"fayo5159",
            fb:{
                userId:"face",
                authToken:"face"
            },
            firstName:"Facé",
            lastName:"Igfacio",
            country:"Argentina",
            email:"soyyo5159@hotmail.com",
            birthdate:"oneday",
            images:[
                "serio.png",
                "muy serio.png",
                "playa.png"
            ]
        }).expect(201)
    })

    describe("Login as that user",function(){
        it("login as a fb user",function(){
            return agent
            .post("/users/validate")
            .set("authorization", authValue)
            .send({
                username:"fayo5159",
                facebookAuthToken:"face"
            }).expect(201)
        })
    
        it("login as normal user",function(){
            return agent
            .post("/users/validate")
            .set("authorization", authValue)
            .send({
                username:"fayo5159",
                password:"face"
            }).expect(400)
        })
    
        it("login as fb user, bad credentials",function(){
            return agent
            .post("/users/validate")
            .set("authorization", authValue)
            .send({
                username:"fayo5159",
                facebookAuthToken:"57"
            }).expect(400)
        })
    })


    describe("deleting modifying and getting users",function(){
        let id_soyyo5159="";
        let id_fayo5159="";
        let ref_soyyo5159="";
        it("listings show those users",function(){
            return agent
            .get("/users")
            .set("authorization", authValue)
            .expect(200)
            .expect(function(res){
                let owner_soyyo5159=null;
                let has_soyyo5159=res.body.users.some((u)=>{
                    if(u.username==="soyyo5159"){
                        id_soyyo5159=u.id;
                        ref_soyyo5159=u._ref;
                        owner_soyyo5159=u.applicationOwner;
                    }
                    return u.username==="soyyo5159"
                })
                assert.isTrue(has_soyyo5159,"doesnt have soyyo5159")
                assert.equal(owner_soyyo5159,serverId)
                
                let owner_fayo5159=""
                let has_fayo5159=res.body.users.some((u)=>{
                    if(u.username==="fayo5159"){
                        id_fayo5159=u.id;
                        owner_fayo5159=u.applicationOwner;
                    }
                    return u.username==="fayo5159"
                })
                assert.isTrue(has_fayo5159,"doesnt have fayo5159")
                assert.equal(owner_fayo5159,serverId)
            })
        })
    
        it("the user can be deleted",function(){
            return agent
            .delete("/users/"+id_fayo5159)
            .set("authorization", authValue)
            .expect(204)
        })

        it("The user cannot be modified with bad ref",function(){
            return agent
            .put("/users/"+id_soyyo5159)
            .set("authorization", authValue)
            .send({
                _ref:"1",
                type:"passenger",
                username:"soyyo5159",
                password:"5159",
                firstName:"asd",
                lastName:"Ignacio",
                country:"Argentina",
                email:"soyyo5159@hotmail.com",
                birthdate:"q",
                images:[
                    "serio.png",
                    "muy serio.png",
                    "playa.png"
                ]
            }).expect(400)
        })

        it("The user can be modified with good ref",function(){
            return agent
            .put("/users/"+id_soyyo5159)
            .set("authorization", authValue)
            .send({
                _ref:ref_soyyo5159,
                type:"driver",
                username:"soyyo5159",
                password:"5159",
                firstName:"Josecito",
                lastName:"Ignacito",
                country:"Argentina",
                email:"soyyo5159@hotmail.com",
                birthdate:"q",
                images:[
                    "serio.png",
                    "muy serio.png",
                    "playa.png"
                ]
            }).expect(200)
            .expect(function(res){
                assert.include(res.body.user,{
                    name:"Josecito",
                    birthdate:"q"
                })
            })
        })

    })
    



})