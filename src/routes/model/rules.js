const lastCommits  =require("./tables").lastCommits;
const commits       =require("./tables").commits;
const businessUsers=require("./business-users");
exports.addRule=function(rule,nonexistent,badRevision,me){
    rule.message="asd";
    rule.timestamp=new Date().getTime();
    rule.businessUsername=me.username;
    rule.ruleId=0;

    let createdCommitId=0;
    return commits.create(rule)
    .then((created)=>{
        createdCommitId=created.id;
        
        let o={
            commitId:created.id,
            _ref:Math.random()*1000+""
        }
        return lastCommits.create(o);
    }).then((createdRule)=>{
        

        return commits
            .update({id:createdCommitId},{ruleId:createdRule.ruleId})
            .then(()=>createdRule);

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
        return getCommit(0,read.commitId,nonexistent).then((readCommit)=>{
            readCommit.lastCommit=read;
            return readCommit;
        })
    })
}

function getCommit(ruleId,commitId,nonexistent){
    return commits
    .readOne({id:commitId},nonexistent)
    .then((readCommit)=>{
        if(readCommit==nonexistent){
            return nonexistent;
        }
        return businessUsers.get(readCommit.businessUsername,"UNKNOWN AUTHOR").then((businessUser)=>{
            return {
                commit:readCommit,
                businessUser:businessUser
            }
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
        rule.ruleId=ruleId;
        return commits.create(rule).then((created)=>{
            let o={
                commitId:created.id,
                _ref:Math.random()*1000+""
            }
            return lastCommits.update({ruleId},o);
        });
    })
}


//exports.getCommits=function()
