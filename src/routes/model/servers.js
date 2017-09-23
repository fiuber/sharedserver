const sdb=require("./tables").servers;

exports.shape={
    "id": "string",
    "_ref": "string",
    "createdBy": "string",
    "createdTime": 0,
    "name": "string",
    "lastConnection": 0
};
const servers_metadata={
    "version":"1"
};

function keepFirst(array){
    return array[0];
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
    return sdb.create(server).then(function(created){
        return exports.updateToken(created.id,"id not found, how's that possible?");
    });
}

/**
 * Updates only the name of the server with the received ID
 */
exports.update=function(body,id,nonexistent){
    return ifExists(id,()=>{
        return sdb.update({id:id},{name:body.name});
    },nonexistent)
}


exports.updateToken=function(id,nonexistent){
    var token =Math.random()*1000+"";
    var expiresAtDate = new Date();
    expiresAtDate.setDate(expiresAtDate.getDate()+3);
    var expiresAt = expiresAtDate.getTime();
    return ifExists(id,()=>{
        return sdb
        .update({id:id},{token:token,expiresAt:expiresAt})
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