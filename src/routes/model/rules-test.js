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

describe("Usage of rules",function(){
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
        return rules.getRule(law.lastCommit.ruleId,"NOPE").then((rule)=>{
            assert.equal(rule.businessUser.name,"Isaac");
            assert.equal(rule.commit.blob,"F=m*a");
        })
    })

    let law2=null;
    //newton would have made relativity if he hadn't been so busy with the bible
    it("Add a rule",()=>{
        return rules.addRule({
            "id": "string",
            "_ref": "string",
            "language": "maths",
            "lastCommit": "what",
            "blob": "E=m*C^2",
            "active": "true"
        },"NOPE","NOPE",{
            username:"Newton"
        }).then((added)=>{
            assert.equal(added.businessUser.name,"Isaac");
            assert.equal(added.commit.blob,"E=m*C^2");
            law2=added;
            return added;
        })
    }).timeout(5000);


    it("getting all rules gets both rules",()=>{
        return rules.getRules().then((all)=>{
            assert.lengthOf(all.rules,2);
            assert.equal(all.quantity,2);
            let hasLaw=all.rules.some((r)=>r.lastCommit.ruleId==law.lastCommit.ruleId);
            let hasLaw2=all.rules.some((r)=>r.lastCommit.ruleId==law2.lastCommit.ruleId);
            assert.isTrue(hasLaw,"it doesnt have f=m*a");
            assert.isTrue(hasLaw2,"it doesnt have E=m*C^2");
        })
    })

    it("Delete a rule",()=>{
        return rules.deleteRule(law.lastCommit.ruleId);
    })

    it("getting all rules gets one rule",()=>{
        return rules.getRules().then((all)=>{
            assert.lengthOf(all.rules,1);
            let hasLaw2=all.rules.some((r)=>r.lastCommit.ruleId==law2.lastCommit.ruleId);
            assert.isTrue(hasLaw2,"it doesnt have E=m*C^2");
        })
    })

    it("Modify a rule",()=>{
        return rules.modifyRule({
            id:law2.lastCommit.ruleId,
            _ref:law2.lastCommit._ref,
            language:"wachiturro",
            blob:"bigote",
            active:"true"
        },law2.lastCommit.ruleId, "NOPE", "BADREF",{username:"Newton"});
    })

    it("getting all rules gets one changed rule",()=>{
        return rules.getRules().then((all)=>{
            assert.lengthOf(all.rules,1);
            let hasLaw2=all.rules.some((r)=>r.lastCommit.ruleId==law2.lastCommit.ruleId && r.commit.blob==="bigote");
            assert.isTrue(hasLaw2,"it doesnt have E=m*C^2");
        })
    })

    it("getting an older state of a rule",()=>{
        return rules.getCommit(law2.lastCommit.ruleId,law2.commit.id,"NOPE").then((oldLaw)=>{
            assert.equal(oldLaw.commit.blob,"E=m*C^2");
        })
    })

    it("getting all states of a rule",()=>{
        return rules.getCommits(law2.lastCommit.ruleId,"NOPE").then((commits)=>{
            let oldOne=commits.some((c)=>c.commit.blob=="E=m*C^2");
            let newOne=commits.some((c)=>c.commit.blob=="bigote");
            assert.isTrue(oldOne,"The old one doesn't exist");
            assert.isTrue(newOne,"The new one doesn't exist");
        })
    })

    



})

