/**
 * @module
 * @description This module interacts with node-rules.
 */

const RuleEngine=require("node-rules");

/**
 * @method runStrings
 * @description Executes the passed rules with the given facts. All should be strings.
 * @param {Array<string>} rules an array of strings, every string is a rule.
 * @param {Array<string>} facts an array of strings, every string is a fact. 
 * This means, it is a json fact. The facts are transformed to js objects and then merged.
 * @return {Object} the result of the execution.
 */
exports.runStrings=function(rules,facts){
    let ruleEngine=new RuleEngine();
    ruleEngine.fromJSON("["+rules.join(",")+"]");
    
    
    let objects=facts.map((s)=>JSON.parse(s));
    let fact=Object.assign.apply({},[{}].concat(objects));

    return new Promise((resolve,reject)=>{
        ruleEngine.execute(fact,resolve);
    });
}
