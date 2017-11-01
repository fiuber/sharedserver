
let businessUser=require("./business-users").get;

function rule(string,number,array,from){
    return {
        rule:{
            id:from("lastCommit",string("ruleId")),
            _ref:from("lastCommit",string("_ref")),
            language:from("commit",string("language")),
            lastCommit:{
                author:from("businessUser",businessUser(string,number,array,from).businessUser),
                message:from("commit",string("blob")),
                timestamp:from("commit",number("timestamp"))
            },
            blob:from("commit",string("blob")),
            active:from("commit",string("active"))
        }
    }
}

exports.getRule=rule;
exports.modifyRule=rule;
exports.addRule=rule;

exports.getRules=function(string,number,array,from){
    let ruleShape=rule(string,number,array,from).rule;
    return {
        rules:array(ruleShape)
    }
}

exports.getCommit=rule;

exports.getCommits=function(string,number,array,from){
    let commitShape=rule(string,number,array,from).rule.lastCommit;
    return {
        commits:array(commitShape)
    }

}