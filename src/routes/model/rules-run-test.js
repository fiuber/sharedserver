const assert=require("chai").assert;
const rulesRun=require("./rules-run");
const rules=require("./rules");
const businessUsers=require("./business-users")

const defaultUser={
    username:"Newton",
    password:"pepeword",
    name:"Isaac",
    surname:"Newton",
    roles:["admin","manager"]
}

describe("Rules are run",()=>{
    before(function(){
        
        return require("./tables").restart().then(()=>{
            return businessUsers.add(defaultUser);
        });
    });

    let law=null;//result is false if transactionTotal < 500
    it("Add a rule",()=>{
        return rules.addRule({
            "id": "string",
            "_ref": "string",
            "language": "node-rules",
            "lastCommit": "what",
            "blob": JSON.stringify(
                {
                    condition: 'function (R) {R.when(this && (this.transactionTotal < 500));}',
                    consequence: 'function (R) {this.result = false;R.next();}',
                    on: true
                }
            ),
            "active": "true"
        },"NOPE","NOPE",{
            username:"Newton"
        }).then((added)=>{
            assert.equal(added.businessUser.name,"Isaac");
            law=added;
            return added;
        })
    }).timeout(5000);

    let law2=null;//discount is true if transactionTotal<200
    it("Add a rule",()=>{
        return rules.addRule({
            "id": "string",
            "_ref": "string",
            "language": "node-rules",
            "lastCommit": "what",
            "blob": JSON.stringify(
                {
                    condition: 'function (R) {R.when(this && (this.transactionTotal < 200));}',
                    consequence: 'function (R) {this.discount = true;R.next();}',
                    on: true
                }
            ),
            "active": "true"
        },"NOPE","NOPE",{
            username:"Newton"
        }).then((added)=>{
            assert.equal(added.businessUser.name,"Isaac");
            law2=added;
            return added;
        })
    }).timeout(5000);

    it("run a rule",()=>{
        return rulesRun.runOne([{
            language:"node-rules-fact",
            blob:JSON.stringify({
                transactionTotal:100
            })
        }],law.lastCommit.ruleId,{}).then((result)=>{
            assert.isFalse(JSON.parse(result.result).result);
            assert.isUndefined(JSON.parse(result.result).discount)
        });
    }).timeout(5000);

    it("run all rules",()=>{
        return rulesRun.runMany({
            rules:[law.lastCommit.ruleId,law2.lastCommit.ruleId],
            facts:[{
                language:"node-rules-fact",
                blob:JSON.stringify({
                    transactionTotal:100
                })
            }]
        
        },{}).then((result)=>{
            assert.isFalse(JSON.parse(result.result).result);
            assert.isTrue(JSON.parse(result.result).discount);
        });
    }).timeout(5000);
})