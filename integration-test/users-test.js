let assert=require("chai").assert;
var request = require('supertest');

describe.only("using users",function(){
    var app;
    let agent=null;
    let authValue="";
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