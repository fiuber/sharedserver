
const assert=require("chai").assert;
const businessUsers=require("./business-users");

const defaultUser={
    username:"pepenacho",
    password:"pepeword",
    name:"José Ignacio",
    surname:"Sbruzzszszsz",
    roles:["admin","manager"]
}

describe("Usage of businessUsers",function(){
    beforeEach(function(){
        this.timeout(5000);
        return require("./tables").restart()
        .then(()=>{
            return businessUsers.add(defaultUser)
        });
    });

    it("An added business user exists",function(){
        return businessUsers
        .exists(defaultUser.username)
        .then((exists)=>{
            assert.isTrue(exists)
        })
    })

    it("A random user doesnt exist",function(){
        return businessUsers
        .exists("pp")
        .then((exists)=>{
            assert.isFalse(exists);
        });
    })

    it("Checking existence with wrong password",function(){
        return businessUsers
        .exists(defaultUser.username,"q")
        .then((exists)=>{
            assert.isFalse(exists)
        })
    })

    it("roles can be obtained",function(){
        return businessUsers.getRoles("pepenacho").then((roles)=>{
            assert.include(roles,"admin");
            assert.include(roles,"manager");
            assert.equal(roles.length,2);
        });
    })

    it("the roles of an unexistent user are void",function(){
        return businessUsers.getRoles("asd").then((roles)=>{
            assert.equal(roles.length,0);
        });
    })

    it("Not any token is correct",function(){
        return businessUsers.newToken("pepenacho","pepeword").then((u)=>{
            return Promise.all([
                businessUsers.tokenCorrect("pepenacho","asd").then((r)=>assert.isFalse(r)),
                businessUsers.tokenCorrect("q","asd").then((r)=>assert.isFalse(r)),
                businessUsers.tokenCorrect("q",u.token).then((r)=>assert.isFalse(r)),
                businessUsers.tokenCorrect("pepenacho",u.token).then((r)=>assert.isTrue(r))
            ]);
        });
    })

    it("Tokens are invalid after logout",function(){
        return businessUsers.newToken("pepenacho","pepeword").then((u)=>{
            return businessUsers.tokenCorrect("pepenacho",u.token).then((correct)=>{
                assert.isTrue(correct);
                return businessUsers.expireToken("pepenacho").then(()=>{
                    return businessUsers.tokenCorrect("pepenacho",u.token).then((correct)=>{
                        assert.isFalse(correct);
                    });
                })
            })
        });
    })
    

})