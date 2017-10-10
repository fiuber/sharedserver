const users=require("./users");
const assert=require("chai").assert;

//SEGUIR POR LA PARTE DE AUTOSSSSSS

describe("Using the users model",function(){
    let firstId=null;
    let secondId=null;
    let firstRef=null;

    before(function(){
        return require("./tables").restart();
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
            serverId:"myserver"
        }).then((ret)=>{
            firstId=ret.id;
            firstRef=ret._ref;
            assert.notEqual(ret,"nonexistent")
            assert.notEqual(ret,"badRevision")
        })
    });

    it("The user is validated",function(){
        return users.validate({
            username:"soyyo5159",
            password:"5159"
        },"nonexistent","badRevision").then((res)=>{
            assert.notEqual(res,"nonexistent")
            assert.notEqual(res,"badRevision")
        })
    });

    it("The user is not validated with fb",function(){
        return users.validate({
            username:"soyyo5159",
            facebookAuthToken:"5159"
        },"nonexistent","badRevision").then((res)=>{
            assert.equal(res,"badRevision")
        })
    });

    it("The user is not validated with wrong password",function(){
        return users.validate({
            username:"soyyo5159",
            password:"buena"
        },"nonexistent","badRevision").then((res)=>{
            assert.equal(res,"badRevision")
        })
    });

    it("Another user is added",function(){
        return users.add({
            _ref:"1",
            type:"passenger",
            username:"q-man",
            password:"q",
            firstName:"Qosé",
            lastName:"qIgnacio",
            country:"qArgentina",
            email:"qsoyyo5159@hotmail.com",
            birthdate:"qoneday",
            images:[
                "serio.png",
                "muy serio.png",
                "playa.png"
            ]
        },
        "nonexistent",
        "badRevision",
        {
            serverId:"myserver"
        }).then((ret)=>{
            secondId=ret.id;
            assert.notEqual(ret,"nonexistent")
            assert.notEqual(ret,"badRevision")
        })
    });

    it("Listings shows both users",function(){
        return users.list().then((allUsers)=>{
            let soyyo5159=allUsers.some((u)=>u.username==="soyyo5159");
            let qman=allUsers.some((u)=>u.username==="q-man");
            assert.isTrue(soyyo5159,"soyyo5159 not included")
            assert.isTrue(qman,"q-man not included")
        })
    })

    it("A user can be removed",function(){
        return users.delete(secondId);
    })

    it("A user can not be edited with a bad ref",function(){
        return users.update(firstId,{
            _ref:"hola",
            type:"passenger",
            username:"soyyo5159",
            password:"5159",
            firstName:"José",
            lastName:"Gil",
            country:"Gillandia",
            email:"soyyo5159@hotmail.com",
            birthdate:"oneday",
            images:[
                "serio.png",
                "muy serio.png",
                "playa.png"
            ]
        },"nonexistent","badRevision").then((v)=>{
            assert.equal(v,"badRevision");
        })
    })

    it("A user can be edited with a good ref",function(){
        return users.update(firstId,{
            _ref:firstRef,
            type:"passenger",
            username:"soyyo5159",
            password:"5159",
            firstName:"José",
            lastName:"Gil",
            country:"Gillandia",
            email:"soyyo5159@hotmail.com",
            birthdate:"oneday",
            images:[
                "serio.png",
                "muy serio.png",
                "playa.png"
            ]
        },"nonexistent","badRevision").then((v)=>{
            assert.notEqual(v,"badRevision");
            assert.notEqual(v,"nonexistent");
        })
    })

    it("Listings dont show the deleted user",function(){
        return users.list().then((allUsers)=>{
            let soyyo5159=allUsers.some((u)=>
                u.username==="soyyo5159"
                && u.surname==="Gil"
                && u.country==="Gillandia"
            );
            let qman=allUsers.some((u)=>u.username==="q-man");
            assert.isTrue(soyyo5159,"soyyo5159 not included")
            assert.isFalse(qman,"q-man not deleted")
        })
    })

    describe("cars",function(){
        let myCar=null;

        it("I get a car",function(){
            return users.addCar(firstId,{
                id:"7",
                _ref:"me",
                owner:firstId,
                properties:[
                    {
                        name:"ventana",
                        value:100.50
                    },
                    {
                        name:"asiento",
                        value:10000.33
                    }
                ]
            })
        });

        let myCarId=null;
        let myCarRef=null;

        it("the car is there",function(){
            return users.getCars(firstId).then((cars)=>{
                let windowIncluded=cars[0].properties.some((prop)=>
                    prop.name==="ventana" && prop.value==="100.5"
                )
                assert.isTrue(windowIncluded,"The window is not included");

                let seatIncluded=cars[0].properties.some((prop)=>
                    prop.name==="asiento" && prop.value==="10000.33"
                )
                assert.isTrue(seatIncluded,"The seat is not included");
                
                myCarId=cars[0].id;
                myCarRef=cars[0]._ref;
            })
        })

        it("the car changes",function(){
            return users.updateCar(firstId,myCarId,{
                id:myCarId,
                _ref:myCarRef,
                owner:firstId,
                properties:[
                    {
                        name:"rota",
                        value:4.08
                    },
                ]
            })
        })

        it("the new car is there",function(){
            return users.getCar(firstId,myCarId).then((car)=>{
                let seatIncluded=car.properties.some((prop)=>
                    prop.name==="rota" && prop.value==="4.08"
                )
                assert.isTrue(seatIncluded,"The seat is not included");
            })
        })

        it("the car is removed",function(){
            return users.deleteCar(myCarId);
        })

        it("the new car is nonexistent",function(){
            return users
            .getCar(firstId,myCarId,"NOPE")
            .then((ret)=>{
                assert.equal(ret,"NOPE");
            })
        })

        it("The user has no cars",function(){
            return users.getCars(firstId).then((cars)=>{
                assert.equal(cars.length,0);
            })
        })

        

    })

    


})