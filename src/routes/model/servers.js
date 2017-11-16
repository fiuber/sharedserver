const sdb=require("./tables").servers;
/**
 * @module
 * @description A model for handling the servers CRUD
 */
exports.shape={
    "id": "string",
    "_ref": "string",
    "createdBy": "string",
    "createdTime": 0,
    "name": "string",
    "lastConnection": 0
};

function keepFirst(array){
    return array[0];
}

exports.serverIdFromToken=function(token){
    if(token==null){
        return Promise.resolve(null);
    }
    return sdb.read({token:token}).then((servers)=>{
        if(servers.length>0){
            return servers[0].id;
        }else{
            let decoded=Buffer(token, 'base64').toString();
            return sdb.read({token:decoded}).then((servers)=>{
                return servers[0].id;
            })
        }
    })
}

function ifExists(id,fun,nonexistent){
    
    return sdb.exists({id:id}).then((exists)=>{
        if(exists){
            return fun();
        }else{
            return nonexistent;
        }
    })
}

exports.ping=function(nonexistent,badRevision,me){
    console.log("ENTRA")
    let expiresAtDate = new Date();
    expiresAtDate.setDate(expiresAtDate.getDate()+3);
    let expiresAt = expiresAtDate.getTime();

    let newToken=Math.random()*1000+"";
    

    return sdb.update({id:me.id},{token:newToken,expiresAt:expiresAt}).then((up)=>{
        return exports.get(me.id,nonexistent);
    })
}
exports.ping.shape={};

function base64Token(row){
    row.token=new Buffer(row.token).toString("base64");
    return row;
}

exports.add=function(server,nonexistent,badRevision,me){
    server.token=0;
    server.expiresAt=0;
    server._ref=Math.random()*1000+"";
    
    server.createdTime=(new Date()).getTime();
    console.log(me);
    server.createdBy=me.username;
    
    return sdb.create(server).then(function(created){
        return exports.updateToken(created.id,"id not found, how's that possible?");
    });
}

/***
 * Updates only the name of the server with the received ID
 */
exports.update=function(body,id,nonexistent,badRevision){
    return ifExists(id,()=>{
        return sdb.read({id:id}).then(function(got){
            if(got[0]._ref==body._ref){
                let new_ref=Math.random()*1000+"";
                return sdb.update({id:id},{name:body.name,new_ref}).read({id:id}).then((rows)=>base64Token(rows[0]));
            }else{
                //console.log("EL REF POSTA ES ",got[0]._ref," EL REF Q ME DISTE ES ",body._ref);
                return badRevision
            }
        })
        
    },nonexistent)
}


exports.updateToken=function(id,nonexistent){
    var token =Math.random()*1000+"";
    var expiresAtDate = new Date();
    expiresAtDate.setDate(expiresAtDate.getDate()+3);
    var expiresAt = expiresAtDate.getTime();
    let new_ref=Math.random()*1000+"";
    return ifExists(id,()=>{
        return sdb
        .update({id:id},{token:token,expiresAt:expiresAt,_ref:new_ref})
        .read({id:id})
        .then(keepFirst)
        .then(base64Token);
    },nonexistent)
            
}
exports.updateToken.shape={}



exports.delete=function(id,nonexistent){
    return ifExists(id,()=>{
        return sdb.delete({id:id});
    },nonexistent)
}
exports.delete.shape={}

/***
 * no pongo el METADATA correspondiente porque no entiendo qué significa
 */
exports.list=function(nonexistent,badRevision,me,query){
    return sdb.readQuery(query).then((servers)=>{
        return sdb.read().then((all)=>{
            return {
                servers:servers,
                quantity:all.length
            }
        })
    });
}
exports.list.shape={};

exports.get=function(id,nonexistent){
    return ifExists(id,()=>{
        return sdb.read({id:id}).then(keepFirst).then(base64Token)
    },nonexistent);  
}
exports.get.shape={};

/**
 * @method authorized
 * @description determines wether the client is authorized.
 * 
 * @arg credentials an object containing a "token" property
 * @arg identifyAs a function that takes an object that identifies the client
 */
exports.authorized=function(credentials,identifyAs){
    let token = credentials.token;
    return sdb.read({token:token}).then((rows)=>{
        if(rows.length==0){
            return false;
        }else{
            let now = (new Date()).getTime();
            return sdb.update({token:token},{lastConnection:now}).then((updated)=>{
                identifyAs(rows[0]);
                let expiresAt=rows[0].expiresAt;
                return expiresAt > (new Date()).getTime();
            })
            
        }
    });
}