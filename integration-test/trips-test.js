let assert=require("chai").assert;
var request = require('supertest');

describe.only("using /trips",function(){
    var app;
    let agent=null;
    let authValue="";
    let serverId="";
    let soyyo5159=null;
    let fayo5159=null;
    let trip=null;
    let adminAuthValue="";
    before(function(){
        this.timeout(5000);
        app =require("../server.js");
        agent=request.agent(app);
        
        return require("../restartDatabase.js")()
        .then(()=>{//login
            return agent
            .post("/token")
            .send({username:"admin",password:"admin"}).then((res)=>{
                authValue="api-key "+res.body.token.token;
                adminAuthValue="api-key "+res.body.token.token;
                //hago request.set("authorization",authValue) todo el tiempo
                assert.equal(res.statusCode,201);
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
                authValue="api-key "+token;
                serverId=res.body.server.server.id;
            })
        })
    });

    it("add a rule that checks for soyyo5159 as driver",()=>{
        return agent
        .post("/rules")
        .set("authorization", adminAuthValue)
        .send({
            "id": "string",
            "_ref": "string",
            "language": "node-rules",
            "lastCommit": "what",
            "blob": JSON.stringify(
                {
                    condition: 'function (R) { \
                        console.log("################################333");\
                        console.log(this);\
                        R.when(this && (this.driver.username === "soyyo5159"));\
                    }',
                    consequence: 'function (R) {this.cost = 1000;R.next();}',
                    on: true
                }
            ),
            "active": "true"
        }).expect(201);
    })

    it("add a rule that checks for NOT soyyo5159 as driver",()=>{
        return agent
        .post("/rules")
        .set("authorization", adminAuthValue)
        .send({
            "id": "string",
            "_ref": "string",
            "language": "node-rules",
            "lastCommit": "what",
            "blob": JSON.stringify(
                {
                    condition: 'function (R) {R.when(this && (this.driver.username !== "soyyo5159"));}',
                    consequence: 'function (R) {this.cost = 1;R.next();}',
                    on: true
                }
            ),
            "active": "true"
        }).expect(201);
    })





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
        }).expect((res)=>{
            soyyo5159=res.body.user;
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
        }).expect((res)=>{
            fayo5159=res.body.user;
        }).expect(201)
    })



    let startPoint={
        timestamp:4865454687,
        address:{
            street:"zeballos",
            location:{
                lat:348.15162342,
                lon:1516.3482342
            }
        }
    }

    let endPoint={
        timestamp:4578999874,
        address:{
            street:"las heras",
            location:{
                lat:123.456789,
                lon:456.789123
            }
        }
    }


    it("add a trip",()=>{
        return agent
        .post("/trips")
        .set("authorization", authValue)
        .send({
            "trip": {
                "id": "string",
                "applicationOwner": "admin",
                "driver": soyyo5159.id,
                "passenger": fayo5159.id,
                "start":startPoint,
                "end": endPoint,
                "totalTime": 0,
                "waitTime": 0,
                "travelTime": 0,
                "distance": 0,
                "route": [],
                "cost": {
                    "currency":"platita",
                    "value":193
                }
            },
            "paymethod": null
        }).expect((res)=>{
            trip=res.body.trip;
            assert.equal(trip.start.address.location.lat,348.15162342);
            assert.equal(trip.passenger,fayo5159.id);
            assert.equal(trip.cost.currency,"ARS");
            assert.equal(trip.cost.value,1000,"the rule was used");
        }).expect(201)
    })


    it("estimate a trip that is opposite",()=>{
        return agent
        .post("/trips/estimate")
        .set("authorization", authValue)
        .send({
            "id": "string",
            "applicationOwner": "admin",
            "driver": soyyo5159.id,
            "passenger": fayo5159.id,
            "start":endPoint,
            "end": startPoint,
            "totalTime": 0,
            "waitTime": 0,
            "travelTime": 0,
            "distance": 0,
            "route": [],
            "cost": {
                "currency":"platita",
                "value":193
            },
            "paymethod": null
        }).expect((res)=>{
            let trip=res.body.trip;
            assert.equal(trip.start.address.location.lat,123.456789);
            assert.equal(trip.passenger,fayo5159.id);
            assert.equal(trip.cost.currency,"ARS");
            assert.equal(trip.cost.value,1000,"the rule was used");
        }).expect(201)
    })

    it("that trip is obtained",()=>{
        
        return agent
        .get("/trips/"+trip.id)
        .set("authorization", authValue)
        .expect((res)=>{
            trip=res.body.trip;
            assert.equal(trip.start.address.location.lat,348.15162342);
            assert.equal(trip.passenger,fayo5159.id);
            assert.equal(trip.cost.currency,"ARS");
        }).expect(200)
    })

    it("that trip is obtained through the driver",()=>{
        return agent
        .get("/users/"+soyyo5159.id+"/trips")
        .set("authorization", authValue)
        .expect((res)=>{
            let good=res.body.trips.some((s)=>{
                return s.passenger == fayo5159.id;
            })
            assert.isTrue(good,"the trip was not found")
        }).expect(200)
    })

    it("that trip is obtained through the driver",()=>{
        return agent
        .get("/users/"+fayo5159.id+"/trips")
        .set("authorization", authValue)
        .expect((res)=>{
            let good=res.body.trips.some((s)=>{
                return s.passenger == fayo5159.id;
            })
            assert.isTrue(good,"the trip was not found")
        }).expect(200)
    })

})