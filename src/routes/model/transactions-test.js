const trips=require("./trips");
const users=require("./users");
const assert=require("chai").assert;
const transactions=require("./transactions");

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


describe.only("Using the trips model",function(){
    let firstId=null;
    let secondId=null;
    let firstRef=null;
    let createdServerToken="";
    let soyyo=null;
    let pirulo=null;

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
            }).then((added)=>{
                
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
            soyyo=ret;
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
            pirulo=ret;
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
                "driver": soyyo.id,
                "passenger": pirulo.id,
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
            assert.equal(added.passenger,pirulo.id);
            assert.equal(added.costCurrency,"ARS");
            assert.equal(added.costValue,35);
            addedTrip=added;
        })

    })

    it("the balance of pirulo is 0",()=>{

        return transactions.getBalance(pirulo.id).then((balance)=>{
            assert.deepEqual(balance,[ { value: 0, currency: 'ARS' } ]);
        })
    })

    it("pirulo pays that trip again 2 dollars",()=>{
        return transactions.addTransaction({
            trip:addedTrip.id,
            timestamp:300,
            cost:{
                currency:"USS",
                value:2
            },
            description:"I pay again cuz i got money",
            data:{
                creditCard:"inifnityForever"
            }
        },pirulo.id).then((paid)=>{//desdoblar este assert
            assert.equal(paid.userId,pirulo.id);
            assert.equal(paid.tripId,addedTrip.id);
            assert.equal(paid.timestamp,300);
            assert.equal(paid.costCurrency,"USS");
            assert.equal(paid.costValue,2);
            assert.equal(paid.description,"I pay again cuz i got money");
            assert.equal(paid.data,'{"creditCard":"inifnityForever"}' );
        })
    })

    it("there are 3 transactions now",()=>{
        return transactions.getTransactions(pirulo.id).then((all)=>{//desdoblar este assert
            assert.lengthOf(all,3);
        })
    })

    it("the balance of pirulo is 0 ARS and 2 USS",()=>{
        return transactions.getBalance(pirulo.id).then((balance)=>{
            assert.deepEqual(balance[0],{ value: 0, currency: 'ARS' });
            assert.deepEqual(balance[1],{ value: 2, currency: 'USS' });
        })
    })

    


})