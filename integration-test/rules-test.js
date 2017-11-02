let assert=require("chai").assert;
var request = require('supertest');

describe("using users",function(){
    var app;
    let agent=null;
    let authValue="";
    let serverId="";
    before(function(){
        this.timeout(5000);
        app =require("../server.js");
        agent=request.agent(app);
        
        return require("../restartDatabase.js")()
        .then(()=>{//login
            return agent
            .post("/token")
            .send({username:"admin",password:"admin"}).then((res)=>{
                authValue="api-key "+res.body.token.token;
                //hago request.set("authorization",authValue) todo el tiempo
                assert.equal(res.statusCode,201);
            })
        })
    });

    let rule=null;

    it("add a rule",function(){
        return agent
        .post("/rules")
        .set("authorization", authValue)
        .send({
                "id": "string",
                "_ref": "string",
                "language": "physics",
                "lastCommit": null,
                "blob": "f=m*a",
                "active": true            
        }).expect((res)=>{
            rule=res.body.rule;

            assert.equal(res.body.rule.blob,"f=m*a");
            assert.equal(res.body.rule.lastCommit.author.username,"admin");
            assert.equal(res.body.rule.lastCommit.message,"f=m*a");
        })
    })

    it("Modify the rule",function(){
        return agent
        .put("/rules/"+rule.id)
        .set("authorization", authValue)
        .send({
                "id": "string",
                "_ref": rule._ref,
                "language": "wachiturro",
                "lastCommit": null,
                "blob": "bigote",
                "active": true            
        }).expect((res)=>{
            assert.equal(res.body.rule.blob,"bigote");
            assert.equal(res.body.rule.lastCommit.author.username,"admin");
            assert.equal(res.body.rule.lastCommit.message,"bigote");
        })
    })

    let rule2=null;
    it("add a second rule",function(){
        return agent
        .post("/rules")
        .set("authorization", authValue)
        .send({
                "id": "string",
                "_ref": "string",
                "language": "english",
                "lastCommit": null,
                "blob": "everything",
                "active": true            
        }).expect((res)=>{
            rule2=res.body.rule;

            assert.equal(res.body.rule.blob,"everything");
            assert.equal(res.body.rule.lastCommit.author.username,"admin");
            assert.equal(res.body.rule.lastCommit.message,"everything");
        })
    })

    it("get all rules",function(){
        return agent
        .get("/rules")
        .set("authorization", authValue)
        .expect((res)=>{
            let rules=res.body.rules
            assert.lengthOf(rules,2);

            let hasOne=rules.some((rule)=>{
                return rule.blob==="bigote";
            })
            assert.isTrue(hasOne,"Doesn't have the first rule");

            let hasTwo=rules.some((rule)=>{
                return rule.blob==="everything";
            })
            assert.isTrue(hasTwo,"Doesn't have the second rule");
        })
    })

    it("delete a rule",function(){
        return agent
        .delete("/rules/"+rule2.id)
        .set("authorization", authValue)
        .expect(204);
    })

    it("get all rules (one should be deleted)",function(){
        return agent
        .get("/rules")
        .set("authorization", authValue)
        .expect((res)=>{
            let rules=res.body.rules
            assert.lengthOf(rules,1);

            let hasOne=rules.some((rule)=>{
                return rule.blob==="bigote";
            })
            assert.isTrue(hasOne,"Doesn't have the first rule");
        })
    })

    it("get all commits of the first rule",function(){
        return agent
        .get("/rules/"+rule.id+"/commits")
        .set("authorization", authValue)
        .expect((res)=>{
            let commits=res.body.commits
            assert.lengthOf(commits,2);

            let hasLast=commits.some((c)=>{
                return c.message==="bigote";
            })
            assert.isTrue(hasLast,"Doesn't have the last rule");

            let hasFirst=commits.some((c)=>{
                return c.message==="f=m*a";
            })
            assert.isTrue(hasFirst,"Doesn't have the first rule");
            
        })
    })

    it("get an old commit",function(){
        return agent
        .get("/rules/"+rule.id+"/commits/"+rule.lastCommit.id)//ese last commit es viejo
        .set("authorization", authValue)
        .expect((res)=>{
            assert.equal(res.body.rule.lastCommit.message,"f=m*a");
        })
    })

    //--------------------------------running the rules


    let law=null;
    it("add a rule",function(){
        return agent
        .post("/rules")
        .set("authorization", authValue)
        .send({
                "id": "string",
                "_ref": "string",
                "language": "node-rules",
                "lastCommit": null,
                "blob": JSON.stringify(
                    {
                        condition: 'function (R) {R.when(this && (this.transactionTotal < 500));}',
                        consequence: 'function (R) {this.result = false;R.next();}',
                        on: true
                    }
                ),
                "active": true            
        }).expect((res)=>{
            law=res.body.rule;
            assert.equal(res.body.rule.lastCommit.author.username,"admin");
        })
    })

    let law2=null;
    it("add a rule",function(){
        return agent
        .post("/rules")
        .set("authorization", authValue)
        .send({
                "id": "string",
                "_ref": "string",
                "language": "node-rules",
                "lastCommit": null,
                "blob": JSON.stringify(
                    {
                        condition: 'function (R) {R.when(this && (this.transactionTotal < 200));}',
                        consequence: 'function (R) {this.discount = true;R.next();}',
                        on: true
                    }
                ),
                "active": true            
        }).expect((res)=>{
            law2=res.body.rule;
            assert.equal(res.body.rule.lastCommit.author.username,"admin");
        })
    })

    it("run one rule",function(){
        return agent
        .post("/rules/"+law.id+"/run")
        .set("authorization", authValue)
        .send([{
            language:"node-rules-fact",
            blob:JSON.stringify({
                transactionTotal:100
            })
        }]).expect((res)=>{
            assert.equal(res.body.facts[0].language,"node-rules-fact");
            let json = JSON.parse(res.body.facts[0].blob);
            assert.isFalse(json.result);
            assert.isUndefined(json.discount);
        })
    })

    it("run many rules",function(){
        return agent
        .post("/rules/run")
        .set("authorization", authValue)
        .send({
            rules:[law.id,law2.id],
            facts:[{
                language:"node-rules-fact",
                blob:JSON.stringify({
                    transactionTotal:100
                })
            }]
        
        }).expect((res)=>{
            assert.equal(res.body.facts[0].language,"node-rules-fact");
            let json = JSON.parse(res.body.facts[0].blob);
            assert.isFalse(json.result);
            assert.isTrue(json.discount);
        })
    })




})