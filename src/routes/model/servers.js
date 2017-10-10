const sdb=require("./tables").servers;

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
    return sdb.read({token:token}).then((servers)=>{
        return servers[0].id;
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

/**
 * No se agrega porque no se sabe cuál es el server 
 * que me está pegando porque no están implementadas las autorizaciones
 */
exports.ping=function(){
    return "pong";
}

exports.add=function(server){
    server.token=0;
    server.expiresAt=0;
    server._ref=Math.random()*1000+"";
    return sdb.create(server).then(function(created){
        return exports.updateToken(created.id,"id not found, how's that possible?");
    });
}

/**
 * Updates only the name of the server with the received ID
 */
exports.update=function(body,id,nonexistent,badRevision){
    return ifExists(id,()=>{
        return sdb.read({id:id}).then(function(got){
            if(got[0]._ref==body._ref){
                let new_ref=Math.random()*1000+"";
                return sdb.update({id:id},{name:body.name,new_ref}).read({id:id}).then((rows)=>rows[0]);
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
        .then(keepFirst);
    },nonexistent)
            
}
exports.updateToken.shape={}



exports.delete=function(id,nonexistent){
    return ifExists(id,()=>{
        return sdb.delete({id:id});
    },nonexistent)
}
exports.delete.shape={}

/**
 * no pongo el METADATA correspondiente porque no entiendo qué significa
 */
exports.list=function(){
    return sdb.read();
}
exports.list.shape={};

exports.get=function(id,nonexistent){
    return ifExists(id,()=>{
        return sdb.read({id:id}).then(keepFirst)
    },nonexistent);  
}
exports.get.shape={};


exports.authorized=function(credentials,identifyAs){
    let token = credentials.token;
    return sdb.read({token:token}).then((rows)=>{
        if(rows.length==0){
            return false;
        }else{
            identifyAs(rows[0]);
            let expiresAt=rows[0].expiresAt;
            return expiresAt > (new Date()).getTime();
        }
    });
}