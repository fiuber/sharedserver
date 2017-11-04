const RuleEngine=require("node-rules");

exports.runStrings=function(rules,facts){
    let ruleEngine=new RuleEngine();
    ruleEngine.fromJSON("["+rules.join(",")+"]");
    
    
    let objects=facts.map((s)=>JSON.parse(s));
    let fact=Object.assign.apply({},[{}].concat(objects));

    return new Promise((resolve,reject)=>{
        ruleEngine.execute(fact,resolve);
    });
}
