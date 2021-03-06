/**
 * @module
 * @description business-user model. Doesn't know about request or responses.
 */
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
exports.token=function(body,nonexistent,badRevision,me){
    let un=body.username;
    let token=Math.random()*1000+" "+un;
    var expiresAtDate = new Date();
    expiresAtDate.setMinutes(expiresAtDate.getMinutes()+10);//10 minutes
    var expiresAt = expiresAtDate.getTime();
    return udb
    .update({username:un},{token:token,expiresAt:expiresAt})
    .read({username:un}).then((rows)=>{
        if(rows.length==0){
            return nonexistent;
        }else if(rows[0].password !== body.password){
            return nonexistent;
        }else{

            if(me){
                me.username=un;
                me.token=new Buffer(token).toString("base64");
            }
            let o=rows[0]
            o.token=new Buffer(token).toString("base64");
            return o;
        }
    })

};
exports.token.shape={
    username:"string",
    password:"string"
};


exports.get=function(username,nonexistent){
    return udb.exists({username:username}).then((exists)=>{
        if(exists){
            //console.log("ACÁ ESTA SALIENDO UN USER");
            return udb.read({username:username}).then(getWithRoles).then((all)=>all[0])
            /*
            .then((u)=>{
                console.log(u);
                return u;
            })
            */
        }else{
            //console.log("ESE USER NO EXISTEEE")
            return nonexistent;
        }
    })

}

exports.getMe=function(nonexistent,badRevision,me){
    return exports.get(me.username,nonexistent,badRevision,me);
}

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
        return udb.read({username:user.username}).then(getWithRoles).then((rows)=>rows[0]);
    })
}
exports.add.shape=userShape;

// testeado
exports.list=function(nonexistent,badRevision,me,query){
    let businessUsers=[];
    return udb
    .readQuery(query)
    .then(getWithRoles)
    .then((withRoles)=>{
        return udb.count(query).then((q)=>{
            return {
                businessUsers:withRoles,
                quantity:q
            }
        })
        
    })
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

function updateUser(body,username,changeRoles,nonexistent){
    return udb.exists({username:username}).then((exists)=>{
        if(exists){
            let updationPromise = udb.update({username:username},body);//bad name

            if(changeRoles){
                updationPromise=updationPromise.then(()=>{
                    let deletionPromise =rolesdb.delete({username:username});
                    return deletionPromise.then(()=>{
                        let promises=body.roles.map((role)=>{
                            return rolesdb.create({username:body.username,role:role});
                        })
                        return Promise.all(promises);
                    })
                })
            }
            
            return updationPromise
            .then(()=>udb.read({username:body.username}))
            .then(getWithRoles)
            .then((rows)=>rows[0]);
        }else{
            return nonexistent;
        }
    })
}

exports.update=function(body,username,nonexistent){
    return updateUser(body,username,true,nonexistent);
}
exports.update.shape=userShape;

exports.updateMe=function(body,nonexistent,badRevision,me){
    return updateUser(body,me.username,false,nonexistent)
}
exports.updateMe.shape=userShape;

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
        }else if(rows[0].token !== token){
            return false;
        }else{
            let expiresAt=rows[0].expiresAt;
            return expiresAt > (new Date()).getTime();
        }
    })
}

/**
 * @method authorizedRoles
 * @description A method that creates authorizers.
 * @param ... All arguments are authorized roles.
 * @return An authorizer that authorizes cretain roles.
 */
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
