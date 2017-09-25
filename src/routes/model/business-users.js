const udb=require("./tables").users;
const rolesdb=require("./tables").roles;
/*
const usersSchema={
    _ref:"varchar(40)",
    username:"varchar(40)",//no id. username is the id
    password:"varchar(40)",
    name:"varchar(40)",
    surname:"varchar(40)",
    token
}

const rolesSchema={
    username:"varchar(40)",
    role:"varchar(40)"
}
*/

const userShape={
    username:"password",
    password:"password",
    name:"name",
    surname:"surname",
    roles:[]
}

exports.add=function(user){
    user._ref=Math.random()*1000+"";
    user.token="000";
    user.expiresAt=0;
    let roles=user.roles;
    return udb.create(user)
    .then(()=>{
        let promises=roles.map((r)=>rolesdb.create({role:r,username:user.username}));
        return Promise.all(promises);
    }).then(()=>{
        return exports.newToken(user.username,user.password);
    }).then(()=>{
        return udb.read({username:user.username});
    })
}
exports.add.shape=userShape;



exports.exists=function(username,password){
    if(password){
        return udb.exists({username:username,password:password});
    }else{
        return udb.exists({username:username});
    }
}

exports.getRoles=function(username){
    return rolesdb.read({username:username}).then(function(rows){
        return rows.map((row)=>row.role);
    })
}


exports.newToken=function(username,password){
    let token=Math.random()*1000+"";
    var expiresAtDate = new Date();
    expiresAtDate.setMinutes(expiresAtDate.getMinutes()+10);//10 minutes
    var expiresAt = expiresAtDate.getTime();
    return udb
    .update({username:username},{token:token,expiresAt:expiresAt})
    .read({username:username}).then((rows)=>rows[0])
}

exports.expireToken=function(username){
    var expiresAtDate = new Date();
    var expiresAt = expiresAtDate.getTime();
    return udb.update({username:username},{expiresAt:expiresAt});
}

exports.tokenCorrect=function(username,token){
    return udb.read({username:username}).then(function(rows){
        if(!rows){
            return false;
        }else if(rows.length==0){
            return false;
        }else if(rows[0].token != token){
            return false;
        }else{
            let expiresAt=rows[0].expiresAt;
            return expiresAt > (new Date()).getTime();
        }
    })
}

exports.authorizedRoles=function(){
    let allowedRoles=Array.prototype.slice.call(arguments);
    return function(credentials,identify){
        let un=credentials.username;
        let token=credentials.token;
        return exports.tokenCorrect(un,token).then((correct)=>{
            if(correct){
                return exports.getRoles(un).then((roles)=>{
                    if(     allowedRoles.includes("public") 
                        ||  allowedRoles.some((allowed)=>roles.includes(allowed))){
                        identify({username:un,roles:roles});
                        return true;
                    }else{
                        return false;
                    }
                })
            }else{
                return false;
            }
        })
    }
}
