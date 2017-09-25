
const assert=require("chai").assert;
const businessUsers=require("./business-users");

const defaultUser={
    username:"pepenacho",
    password:"pepenacho-is-cool",
    name:"José Ignacio",
    surname:"Sbruzzszszsz",
    roles:["admin","manager"]
}

describe("Usage of businessUsers",function(){
    beforeEach(function(){
        this.timeout(5000);
        return require("./tables").restart();
    });

    it("An added business user exists",function(){
        return businessUsers
        .add(defaultUser)
        .then(()=>{
            return businessUsers.exists(defaultUser.username);
        })
        .then((exists)=>{
            assert.isTrue(exists)
        })
    })

    it("A random user doesnt exist",function(){
        return businessUsers.exists(defaultUser.username).then((exists)=>{
            assert.isFalse(exists);
        });
    })

    it("Checking existence with wrong password",function(){
        return businessUsers
        .add(defaultUser)
        .then(()=>{
            return businessUsers.exists(defaultUser.username,"q");
        })
        .then((exists)=>{
            assert.isFalse(exists)
        })
    })

})