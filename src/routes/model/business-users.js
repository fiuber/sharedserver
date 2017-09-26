const udb=require("./tables").businessUsers;
const rolesdb=require("./tables").roles;
const userShape={
    username:"password",
    password:"password",
    name:"name",
    surname:"surname",
    roles:[]
}

//testeado
exports.token=function(body,nonexistent){
    let un=body.username;
    let token=Math.random()*1000+"";
    var expiresAtDate = new Date();
    expiresAtDate.setMinutes(expiresAtDate.getMinutes()+10);//10 minutes
    var expiresAt = expiresAtDate.getTime();
    return udb
    .update({username:un},{token:token,expiresAt:expiresAt})
    .read({username:un}).then((rows)=>{
        if(rows.length==0){
            return nonexistent;
        }else{
            return rows[0];
        }
    })

};
exports.token.shape={
    username:"string",
    password:"string"
};

//testeado
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
        return exports.token({username:user.username,password:user.password});
    }).then(()=>{
        return udb.read({username:user.username});
    })
}
exports.add.shape=userShape;

// testeado
exports.list=function(){
    let businessUsers=[];
    return udb
    .read()
    .then(getWithRoles);
}
exports.list.shape={}

//testeado
exports.delete=function(username,nonexistent){
    return udb.exists({username:username}).then((exists)=>{
        if(exists){
            return udb.delete({username:username});
        }else{
            return nonexistent;
        }
    })
}
exports.delete.shape={}


function getWithRoles(businessUsers){
    return Promise.all(businessUsers.map(function(bUser){
        return exports.getRoles(bUser.username).then((roles)=>{
            bUser.roles=roles;
            return bUser;
        })
    }))
}
//testeado
exports.update=function(body,username,nonexistent){
    return udb.exists({username:username}).then((exists)=>{
        if(exists){
            return udb.update({username:username},body).then(()=>{
                return rolesdb.delete({username:username}).then(()=>{
                    let promises=body.roles.map((role)=>{
                        return rolesdb.create({username:body.username,role:role});
                    })
                    return Promise.all(promises);
                })
            })
            .then(()=>udb.read({username:body.username}))
            .then(getWithRoles)
            .then((rows)=>rows[0]);
        }else{
            return nonexistent;
        }
    })
}

//testeado
exports.exists=function(username,password){
    if(password){
        return udb.exists({username:username,password:password});
    }else{
        return udb.exists({username:username});
    }
}

//testeado
exports.getRoles=function(username){
    return rolesdb.read({username:username}).then(function(rows){
        return rows.map((row)=>row.role);
    })
}

//testeado
exports.expireToken=function(body){
    var expiresAtDate = new Date();
    var expiresAt = expiresAtDate.getTime();
    return udb.update({username:body.username},{expiresAt:expiresAt});
}
exports.expireToken.shape={
    username:"string"
}

//testeado
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

//testeado
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
