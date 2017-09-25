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