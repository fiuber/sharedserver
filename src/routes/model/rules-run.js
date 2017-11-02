const rulesModel=require("./rules");
const runner=require("./ruleRunner");

exports.runOne=function(body,ruleId,nonexistent){
    return rulesModel.getRuleString(ruleId).then((str)=>{
        if(str==null){
            return nonexistent;
        }
        let strFacts=body.map((f)=>f.blob);
        return runner.runStrings([str],strFacts).then((result)=>{
            return JSON.stringify(result);
        });
    })
}

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
            return JSON.stringify(result);
        });
    })
}