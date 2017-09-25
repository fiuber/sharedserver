const udb=require("./tables").users;
const rolesdb=require("./tables").roles;

exports.exists=function(username,password){
    if(password){
        return udb.exists({username:username,password:password});
    }else{
        return udb.exists({username:username});
    }
}

exports.newToken=function(username,password){
    let token=Math.random()*1000+"";
    var expiresAtDate = new Date();
    expiresAtDate.setMinutes(expiresAtDate.getMinutes()+10);//10 minutes
    var expiresAt = expiresAtDate.getTime();
    return udb.update({username:username},{token:token,expiresAt:expiresAt});
}

exports.expireToken=function(username,password){
    var expiresAtDate = new Date();
    var expiresAt = expiresAtDate.getTime();
    return udb.update({username:username},{expiresAt:expiresAt});
}

exports.tokenCorrect=function(username,token){
    return udb.read({username:username,token:token}).then(function(rows){
        if(rows.length==0){
            return false;
        }else{
            let expiresAt=rows[0].expiresAt;
            return new Date(expiresAt) > new Date();
        }
    })
}

exports.getRoles=function(username){
    rolesdb.read({username:username}).then(function(rows){
        return rows.map((row)=>row.role);
    })
}