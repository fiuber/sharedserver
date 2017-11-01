const assert=require("chai").assert;
const rules=require("./rules");
const businessUsers=require("./business-users");


const defaultUser={
    username:"Newton",
    password:"pepeword",
    name:"Isaac",
    surname:"Newton",
    roles:["admin","manager"]
}

describe.only("Usage of rules",function(){
    this.timeout(5000);
    
    before(function(){
        
        return require("./tables").restart().then(()=>{
            return businessUsers.add(defaultUser);
        });
    });

    it("Attempt to get a nonexisten rule",function(){
        return rules.getRule(7,"NORULE").then((res)=>{
            assert.equal(res,"NORULE");
        })
    })

    let law=null;
    it("Add a rule",()=>{
        return rules.addRule({
            "id": "string",
            "_ref": "string",
            "language": "maths",
            "lastCommit": "what",
            "blob": "F=m*a",
            "active": "true"
        },"NOPE","NOPE",{
            username:"Newton"
        }).then((added)=>{
            assert.equal(added.businessUser.name,"Isaac");
            assert.equal(added.commit.blob,"F=m*a");
            law=added;
            return added;
        })
    }).timeout(5000);

    it("The rule looks fine",()=>{
        console.log("El otro test");
        console.log(law);
        return rules.getRule(law.lastCommit.ruleId,"NOPE").then((rule)=>{
            console.log(rule);
            assert.equal(rule.businessUser.name,"Isaac");
            assert.equal(rule.commit.blob,"F=m*a");
        })
    })



})

