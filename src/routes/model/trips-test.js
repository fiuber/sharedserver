const trips=require("./trips");
const users=require("./users");
const assert=require("chai").assert;

const fakePayer={
    pay:function(asd,efg){
        return Promise.resolve(true);
    }
}

const fakeCalculator={
    calculateCost:function(o){
        return Promise.resolve(35);
    }
}


describe("Using the trips model",function(){
    let firstId=null;
    let secondId=null;
    let firstRef=null;
    let createdServerToken="";
    let soyyoId="";
    let piruloId="";

    before(function(){
        return require("./tables")
        .restart()
        .then(()=>{
            return require("./servers").add({
                "id":"89",
                "_ref":"no matter",
                "createdBy":"pepe",
                "createdTime":15,
                "name":"pepeserver",
                "lastConnection":45
            },"nonexistent","badRevision",{username:"pepe"}).then((added)=>{
                
                createdServerToken=added.token;
                //console.log("------- CREATED SERVE TOKEN -------")
                //console.log(createdServerToken);
            })
        });
    })

    it("a user is added",function(){
        return users.add({
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
        },
        "nonexistent",
        "badRevision",
        {
            token:createdServerToken
        }).then((ret)=>{
            soyyoId=ret.id;
            firstRef=ret._ref;
            assert.notEqual(ret,"nonexistent")
            assert.notEqual(ret,"badRevision")
        })
    });

    it("another user is added",function(){
        return users.add({
            _ref:"1",
            type:"passenger",
            username:"pirulo",
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
        },
        "nonexistent",
        "badRevision",
        {
            token:createdServerToken
        }).then((ret)=>{
            piruloId=ret.id;
            firstRef=ret._ref;
            assert.notEqual(ret,"nonexistent")
            assert.notEqual(ret,"badRevision")
        })
    });

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
    let addedTrip=null;
    it("a trip is added",()=>{
        return trips.addTrip(fakePayer,fakeCalculator)({
            "trip": {
                "id": "string",
                "applicationOwner": "admin",
                "driver": soyyoId,
                "passenger": piruloId,
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
        },"nonexistent","badRevision",
        {token:createdServerToken}).then((added)=>{
            assert.equal(added.startLat,348.15162342);
            assert.equal(added.passenger,piruloId);
            assert.equal(added.costCurrency,"ARS");
            assert.equal(added.costValue,35);
            addedTrip=added;
        })

    })

    it("that trip is obtained",()=>{
        return trips.getTrip(addedTrip.id).then((added)=>{
            assert.equal(added.startLat,348.15162342);
            assert.equal(added.passenger,piruloId);
            assert.equal(added.costCurrency,"ARS");
            assert.equal(added.costValue,35);
        })
    })

    it("that trip is obtained through the driver",()=>{
        return trips.getUserTrips(soyyoId).then((got)=>{
            let good=got.some((s)=>{
                return s.startLat==348.15162342 &&
                s.passenger == piruloId &&
                s.costCurrency == "ARS" &&
                s.costValue == 35
            })
            assert.isTrue(good,"that trip is not included")
        })
    })

    it("that trip is obtained through the passenger",()=>{
        return trips.getUserTrips(piruloId).then((got)=>{
            let good=got.some((s)=>{
                return s.startLat==348.15162342 &&
                s.passenger == piruloId &&
                s.costCurrency == "ARS" &&
                s.costValue == 35
            })
            assert.isTrue(good,"that trip is not included")
        })
    })


})