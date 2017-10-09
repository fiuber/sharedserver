const users=require("./users");
const assert=require("chai").assert;

describe.only("Using the users model",function(){
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

    it("Listings doesnt show the deleted user",function(){
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


})