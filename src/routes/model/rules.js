const lastCommits  =require("./tables").lastCommits;
const commits       =require("./tables").commits;
const businessUsers=require("./business-users");
exports.addRule=function(rule,nonexistent,badRevision,me){
    rule.message="asd";
    rule.timestamp=new Date().getTime();
    rule.businessUsername=me.username;


    return commits.create(rule)
    .then((created)=>{
        let o={
            commitId:created.id,
            _ref:Math.random()*1000+""
        }
        return lastCommits.create(o)
    }).then((created)=>{
        return exports.getRule(created.ruleId);
    })
}

exports.getRule=function(ruleId,nonexistent){
    return lastCommits.readOne({ruleId:ruleId},nonexistent)
    .then((read)=>{
        if(read==nonexistent){
            return nonexistent;
        }
        return commits.readOne({id:read.commitId},nonexistent).then((res)=>{
            return {lastCommit:read,commit:res}
        });
    }).then((read)=>{
        if(read==nonexistent){
            return nonexistent;
        }
        return businessUsers.get(read.commit.businessUsername,"UNKNOWN AUTHOR").then((businessUser)=>{
            read.businessUser=businessUser;
            return read;
        })
    })
}

exports.getRules=function(){
    return lastCommits.read().then((all)=>{
        let promises=all.map((r)=>exports.getRule(r.ruleId))
        return Promise.all(promises);
    });
}

exports.deleteRule=function(ruleId,nonexistent){
    return lastCommits.delete({ruleId:ruleId});
}

exports.modifyRule=function(rule,ruleId,nonexistent,badRevision,me){
    return lastCommits.readOne({ruleId},nonexistent).then((read)=>{
        if(read==nonexistent){
            return nonexistent;
        }
        if(read._ref!=rule._ref){
            return badRevision;
        }
        rule.message="nomessage";
        rule.timestamp=new Date().getTime();
        rule.businessUsername=me.username;
        return commits.create(rule).then((created)=>{
            let o={
                commitId:created.id,
                _ref:Math.random()*1000+""
            }
            return lastCommits.update({ruleId},o);
        });
    })
    
}