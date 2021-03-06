let assert=require("chai").assert;
var request = require('supertest');
const log=require("debug")("fiuber:tests")

describe("using /trips",function(){
    var app;
    let agent=null;
    let authValue="";
    let serverId="";
    let soyyo5159=null;
    let fayo5159=null;
    let trip=null;
    let adminAuthValue="";
    before(function(){
        this.timeout(25000);
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
                        R.when(this && (this.driver.username === "soyyo5159"));\
                    }',
                    consequence: 'function (R) {this.cost = 1000;R.next();}',
                    on: true
                }
            ),
            "active": "true"
        }).expect(201);
    }).timeout(25000);

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
    }).timeout(25000);





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
    }).timeout(25000);
    
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
    }).timeout(25000);



    let startPoint={
        timestamp:4865454687,
        address:{
            street:"zeballos",
            location:{
                lat:-34.637818,
                lon:-58.362485
            }
        }
    }

    let endPoint={
        timestamp:4865454700,
        address:{
            street:"las heras",
            location:{
                lat:-34.633766,
                lon:-58.365210
            }
        }
    }

    let route=[
        {
            timestamp:4865454689,
            location:{
                lat:-34.635629, 
                lon:-58.364073
            }
        },

        {
            timestamp:4865454693,
            location:{
                lat:-34.634322, 
                lon:-58.364856
            }
        }
        

    ]

    
    let troubleTripId="";

    it("add the troubleTrip",()=>{
        let troubleTrip={
            "paymethod":{
               "paymethod":"card",
               "parameters":{
                  "expiration_month":"1",
                  "ccvv":"87564564-5656",
                  "type":"ARS",
                  "number":"123456789",
                  "expiration_year":"2"
               }
            },
            "trip":{
               "passenger":"5",
               "driver":"6",
               "cost":{"currency": "ARS", "value": 0},
               "totalTime":5362.041787862778,
               "applicationOwner":"",
               "id":"",
               "distance":45165008056828.71,
               "end":{
                  "timestamp":1511723168.054185,
                  "address":{
                     "location":{
                        "lat":42.460387,
                        "lon":-71.3489306
                     }
                  }
               },
               "route":[
                  {
                     "timestamp":1511717865.774226,
                     "location":{
                        "lat":10,
                        "lon":20
                     }
                  },
                  {
                     "timestamp":1511717889.940686,
                     "location":{
                        "lat":10,
                        "lon":20
                     }
                  },
                  {
                     "timestamp":1511717960.605871,
                     "location":{
                        "lat":42.3598335,
                        "lon":-71.0598776
                     }
                  },
                  {
                     "timestamp":1511717983.571844,
                     "location":{
                        "lat":42.3598335,
                        "lon":-71.0598776
                     }
                  },
                  {
                     "timestamp":1511718012.119315,
                     "location":{
                        "lat":42.3598335,
                        "lon":-71.0598776
                     }
                  },
                  {
                     "timestamp":1511718057.095626,
                     "location":{
                        "lat":42.3598335,
                        "lon":-71.0598776
                     }
                  },
                  {
                     "timestamp":1511723167.716334,
                     "location":{
                        "lat":42.460387,
                        "lon":-71.3489306
                     }
                  }
               ],
               "travelTime":5110.958556890488,
               "waitTime":251.08323097229004,
               "start":{
                  "timestamp":1511717806.012397,
                  "address":{
                     "location":{
                        "lat":42.3598335,
                        "lon":-71.0598776
                     }
                  }
               }
            }
         }

        troubleTrip.trip.passenger=soyyo5159.id;
        troubleTrip.trip.driver=fayo5159.id;

        return agent
        .post("/trips")
        .set("authorization", authValue)
        .send(troubleTrip)
        .expect((res)=>{
            troubleTripId=res.body.trip.id;
            /*
            trip=res.body.trip;
            assert.equal(trip.start.address.location.lat,-34.637818);
            assert.equal(trip.passenger,fayo5159.id);
            assert.equal(trip.cost.currency,"ARS");
            assert.equal(trip.cost.value,1000,"the rule was used");
            */
        }).expect(201) 
    })




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
                "route": route,
                "cost": {
                    "currency":"platita",
                    "value":193
                }
            },
            paymethod:{
                parameters: {
                    "ccvv": 123,
                    "expiration_month": 11,
                    "expiration_year": 2019,
                    "number": "12145687",
                    "type": "credit",
                    
                },
                "paymethod": "card"
            }
        }).expect((res)=>{
            console.log(res.body);
            
            trip=res.body.trip;
            assert.equal(trip.start.address.location.lat,-34.637818);
            assert.equal(trip.passenger,fayo5159.id);
            assert.equal(trip.cost.currency,"ARS");
            assert.equal(trip.cost.value,1000,"the rule was used");
        }).expect(201)
    }).timeout(25000);

    it("The list of trips returns only one trip",()=>{
        return agent
        .get("/trips")
        .set("authorization", authValue)
        .then((e)=>{
            console.log("-------------------------")
            console.log(e.body);
            assert.lengthOf(e.body.trips,2)
        })
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
            "route": route,
            "cost": {
                "currency":"platita",
                "value":193
            },
            paymethod:{
                parameters: {
                    "ccvv": 123,
                    "expiration_month": 11,
                    "expiration_year": 2019,
                    "number": "12145687",
                    "type": "credit"
                },
                "paymethod": "card"
            }
        }).expect((res)=>{
            let trip=res.body.trip;
            console.log(res.body);
            assert.equal(trip.start.address.location.lat,-34.633766 );
            assert.equal(trip.passenger,fayo5159.id);
            assert.equal(trip.cost.currency,"ARS");
            assert.equal(trip.cost.value,1000,"the rule was used");
        }).expect(201)
    }).timeout(25000);

    it("that trip is obtained",()=>{
        
        return agent
        .get("/trips/"+trip.id)
        .set("authorization", authValue)
        .expect((res)=>{
            console.log(res.body);
            trip=res.body.trip;
            assert.equal(trip.start.address.location.lat,-34.637818);
            assert.equal(trip.passenger,fayo5159.id);
            assert.equal(trip.cost.currency,"ARS");
        }).expect(200)
    }).timeout(25000);

    it("that trip is obtained through the driver",()=>{
        return agent
        .get("/users/"+soyyo5159.id+"/trips")
        .set("authorization", authValue)
        .expect((res)=>{
            log(res.body)
            let good=res.body.trips.some((s)=>{
                return s.passenger == fayo5159.id;
            })
            assert.isTrue(good,"the trip was not found")
        }).expect(200)
    }).timeout(25000);

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
    }).timeout(25000);

    it("the balance of fayo5159 is 0",()=>{
        return agent
        .get("/users/"+fayo5159.id)
        .set("authorization", authValue)
        .expect((res)=>{
            let balance = res.body.user.balance;
            assert.equal(balance[0].value,0);
            assert.equal(balance[0].currency,"ARS");
            assert.equal(balance.length,1);
        })
    })

    it("fayo5159 has two transactions",()=>{
        return agent
        .get("/users/"+fayo5159.id+"/transactions")
        .set("authorization", authValue)
        .expect((res)=>{
            assert.equal(res.body.transactions.length,2);
        })
    })

    it("fayo5159 pays a trip (again)",()=>{
        return agent
        .post("/users/"+fayo5159.id+"/transactions")
        .set("authorization", authValue)
        .send({
            id:"a",
            trip: trip.id,
            timestamp: 51,
            cost: {
                currency:"ARS",
                value:"48"
            },
            description: 'I pay again cuz I got money',
            data: {
                parameters: {
                    "ccvv": 123,
                    "expiration_month": 11,
                    "expiration_year": 2019,
                    "number": "12145687",
                    "type": "credit"
                },
                "paymethod": "card"
            }
        })
        .expect((res)=>{
            let transaction=res.body.transaction;
            
            assert.notEqual(transaction.id,"a");
            assert.equal(transaction.trip,trip.id);
            assert.notEqual(transaction.timestamp,51);
            assert.deepEqual(transaction.cost,{
                currency:"ARS",
                value:48
            });
            assert.equal(transaction.description,'I pay again cuz I got money');
            assert.deepEqual(transaction.data,{
                parameters: {
                    "ccvv": 123,
                    "expiration_month": 11,
                    "expiration_year": 2019,
                    "number": "12145687",
                    "type": "credit"
                },
                "paymethod": "card"
            });

        })
    }).timeout(25000);
    
    it("fayo5159 has two transactions",()=>{
        return agent
        .get("/users/"+fayo5159.id+"/transactions")
        .set("authorization", authValue)
        .expect((res)=>{
            assert.equal(res.body.transactions.length,3);
        })
    })
    
    it("the balance of fayo5159 is positive",()=>{
        return agent
        .get("/users/"+fayo5159.id)
        .set("authorization", authValue)
        .expect((res)=>{
            let balance = res.body.user.balance;
            assert.equal(balance[0].value,48);
            assert.equal(balance[0].currency,"ARS");
            assert.equal(balance.length,1);
        })
    })

    it("get paymethods",()=>{
        return agent
        .get("/paymethods")
        .set("authorization", authValue)
        .expect((res)=>{
            console.log(res.body);
        })
    }).timeout(25000);

})