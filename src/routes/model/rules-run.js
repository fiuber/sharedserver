const rulesModel=require("./rules");
const runner=require("./ruleRunner");

/**
 * @module
 * @description The model for running rules. Interacts with ruleRunner
 */

exports.runOne=function(body,ruleId,nonexistent){
    return rulesModel.getRuleString(ruleId).then((str)=>{
        if(str==null){
            return nonexistent;
        }
        let strFacts=body.map((f)=>f.blob);
        return runner.runStrings([str],strFacts).then((result)=>{
            return [{result:JSON.stringify(result)}];
        });
    })
}

exports.runOne.shape=[
    {
        language:"string",
        blob:"string"
    }
]

exports.runMany=function(body,nonexistent){
    let ruleIds=body.rules;
    let ruleStrings=ruleIds.map((ruleId)=>{
        return rulesModel.getRuleString(ruleId);
    })

    return Promise.all(ruleStrings).then((strings)=>{
        if(strings.some((s)=>s==null)){
            return nonexistent;
        }

        let strFacts=body.facts.map((f)=>f.blob);
        return runner.runStrings(strings,strFacts).then((result)=>{
            return [{result:JSON.stringify(result)}];
        });
    })
}
exports.runMany.shape={
    rules:["string"],
    facts:[
        {
            language:"string",
            blob:"string"
        }
    ]
}

exports.calculateCost=function(fact){
    return rulesModel.getRules().then((rules)=>{
        let ruleStrings=rules.rules.map((rule)=>{
            return rule.commit.blob;
        })
        return ruleStrings;
    }).then((strings)=>{
        if(strings.some((s)=>s==null)){
            return nonexistent;
        }

        let strFacts=[JSON.stringify(fact)];
        return runner.runStrings(strings,strFacts).then((result)=>{
            return result.cost || 0;//{result:JSON.stringify(result)};
        });
    });
}