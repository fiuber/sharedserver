
const assert=require("chai").assert;
const businessUsers=require("./business-users");

const defaultUser={
    username:"pepenacho",
    password:"pepeword",
    name:"José Ignacio",
    surname:"Sbruzzszszsz",
    roles:["admin","manager"]
}

const juanperez={
    username:"juanperez",
    password:"juanpassword",
    name:"Juan",
    surname:"Perezszszsz",
    roles:["user"]
}

const mariagonzales={
    username:"mariagonzales",
    password:"mariaword",
    name:"Maria",
    surname:"Gonzaleszszszsz",
    roles:["manager"]
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

    const pepenachoPepeword={
        username:"pepenacho",
        password:"pepeword"
    }

    it("Not any token is correct",function(){
        let me={};
        return businessUsers.token(pepenachoPepeword,"x","x",me).then((u)=>{
            //assert.equal(me.username,"pepenacho");
            //assert.equal(me.token,u.token);
            let decodedToken=new Buffer(u.token,"base64").toString("ascii");

            return Promise.all([
                businessUsers.tokenCorrect("pepenacho","asd").then((r)=>assert.isFalse(r)),
                businessUsers.tokenCorrect("q","asd").then((r)=>assert.isFalse(r)),
                businessUsers.tokenCorrect("q",decodedToken).then((r)=>assert.isFalse(r)),
                businessUsers.tokenCorrect("pepenacho",decodedToken).then((r)=>assert.isTrue(r))
            ]);
        });
    })

    it("Tokens are invalid after logout",function(){
        return businessUsers.token(pepenachoPepeword,"x").then((u)=>{
            let decodedToken=new Buffer(u.token,"base64").toString("ascii");
            return businessUsers.tokenCorrect("pepenacho",decodedToken).then((correct)=>{
                assert.isTrue(correct);
                return businessUsers.expireToken(pepenachoPepeword).then(()=>{
                    return businessUsers.tokenCorrect("pepenacho",decodedToken).then((correct)=>{
                        assert.isFalse(correct);
                    });
                })
            })
        });
    })

    it("The right user is authorized, and it is correctly identified",function(){
        let identity=null;
        function catchit(i){
            identity=i;
        }
        return businessUsers.token(pepenachoPepeword,"x").then((u)=>{
            let decodedToken=new Buffer(u.token,"base64").toString("ascii");
            return businessUsers.authorizedRoles("admin")({username:"pepenacho",token:decodedToken},catchit)
            .then((authorized)=>{
                assert.isTrue(authorized);
                assert.equal(identity.username,"pepenacho");
                assert.include(identity.roles,"admin");
                assert.include(identity.roles,"manager");
                assert.equal(identity.roles.length,2);
            })
        });
        
    })

    it("The user is authorized only if it has the right roles",function(){
        let identity=null;
        function catchit(i){
            identity=i;
        }
        return businessUsers.token(pepenachoPepeword,"x").then((u)=>{
            return businessUsers.authorizedRoles("user")({username:"pepenacho",token:u.token},catchit)
            .then((authorized)=>{
                assert.isFalse(authorized);
            })
        });
    })

    it("Random token is not authorized",function(){
        let identity=null;
        function catchit(i){
            identity=i;
        }
        return businessUsers.token(pepenachoPepeword,"x").then((u)=>{
            return businessUsers.authorizedRoles("user")({username:"pepenacho",token:"ppp"},catchit)
            .then((authorized)=>{
                assert.isFalse(authorized);
            })
        });
    })

    it("Random user is not authorized",function(){
        let identity=null;
        function catchit(i){
            identity=i;
        }
        return businessUsers.token(pepenachoPepeword,"x").then((u)=>{
            return businessUsers.authorizedRoles("user")({username:"luis",token:u.token},catchit)
            .then((authorized)=>{
                assert.isFalse(authorized);
            })
        });
    })

    it("Testing list",function(){
        return businessUsers.add(mariagonzales).then(()=>{
            return businessUsers.add(juanperez).then(()=>{
                return businessUsers.list().then((all)=>{

                    let bu = all.businessUsers;
                    assert.equal(bu.length,3);
                    assert.equal(all.quantity,3);
                    assert.nestedInclude(bu[0],{username:"pepenacho"});
                    assert.nestedInclude(bu[1],{username:"mariagonzales"});
                    assert.nestedInclude(bu[2],{username:"juanperez"});

                    assert.includeMembers(bu[0].roles,["admin","manager"])
                    assert.includeMembers(bu[1].roles,["manager"])
                    assert.includeMembers(bu[2].roles,["user"])
                })
            })
        })
    })

    it("Testing deletion",function(){
        return businessUsers.delete("pepenacho").then(()=>{
            return businessUsers.list().then((all)=>{
                assert.equal(all.businessUsers.length,0);
                assert.equal(all.quantity,0);
            })
        })
    })

    it("Update, and check roles are kept",function(){
        return businessUsers.update({
            username:"cj",
            password:"cjgangsta",
            name:"carl",
            surname:"Johnson",
            roles:["user"]
        },"pepenacho")
        .then(()=>businessUsers.list())
        .then((all)=>{
            let bu=all.businessUsers;
            assert.equal(bu.length,1);
            assert.equal(all.quantity,1);
            let carl=bu[0];
            assert.include(carl,{
                username:"cj",
                password:"cjgangsta",
                name:"carl",
                surname:"Johnson"
            })

            assert.equal(carl.roles.length,1);
            assert.equal(carl.roles[0],"user");
        })
    })
    

})