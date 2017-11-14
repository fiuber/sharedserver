const lastCommits  =require("./tables").lastCommits;
const commits      =require("./tables").commits;
const businessUsers=require("./business-users");

/**
 * @module
 * @description The rules model for representing the CRUD
 */

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
exports.addRule.shape={
    "id": "string",
    "_ref": "string",
    "language": "string",
    "blob": "string",
    "active": true
}

exports.getRule=function(ruleId,nonexistent){
    return lastCommits.readOne({ruleId:ruleId},nonexistent)
    .then((read)=>{
        //console.log("Tengo el coso!")
        if(read==nonexistent){
            return nonexistent;
        }
        return getCommit(read.commitId,nonexistent).then((readCommit)=>{
            readCommit.lastCommit=read;
            return readCommit;
        })
    })
}

function getCommit(commitId,nonexistent){
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

exports.getRules=function(nonexistent,badRevision,me,query){
    return lastCommits.readQuery(query).then((all)=>{
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
    }).then(()=>{
        return exports.getRule(ruleId);

    });
}

exports.modifyRule.shape={
    "id": "string",
    "_ref": "string",
    "language": "string",
    "blob": "string",
    "active": true
}


exports.getCommit=function(ruleId,commitId,nonexistent){
    return exports.getRule(ruleId,nonexistent).then((rule)=>{
        if(rule==nonexistent){
            return nonexistent;
        }
        return getCommit(commitId,nonexistent).then((commit)=>{
            rule.businessUser=commit.businessUser;
            rule.commit=commit.commit;
            return rule;
        })
    })
}

exports.getCommits=function(ruleId,nonexistent){
    return commits.read({ruleId:ruleId}).then((selectedCommits)=>{
        let promises = selectedCommits.map((c)=>getCommit(c.id,nonexistent))
        return Promise.all(promises)
    })
}

exports.getRuleString=function(ruleId){
    return exports.getRule(ruleId,{nope:"nope"}).then((rule)=>{
        //console.log("%%%%estoy en getRuleString, sale:",rule);
        if(rule.commit.active==="true"){
            return rule.commit.blob;
        }else{
            return null;
        }
        
    });
}