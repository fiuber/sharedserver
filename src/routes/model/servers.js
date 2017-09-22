const db=require("./tables/localdatabase").db;//la única manera no-hack de hacer un require global
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
    /*
    return db.one(
        "insert into servers(name,createdTime,createdBy,token,expiresAt) values($1,$2,$3,$4,$5) returning id",
        [server.name,server.createdTime,server.createdBy,000,000]
    ).then((ret)=> {
        server.id=ret.id;
        return exports.updateToken(server.id,"id not found, how's that possible?");
    })
    */
}


/**
 * Updates only the name of the server with the received ID
 */
exports.update=function(body,id,nonexistent){
    return sdb.exists({id:id}).then((exists)=>{
        if(!exists){
            return nonexistent
        }else{
            return sdb.update({id:id},{name:body.name});
        }
    })
}


exports.updateToken=function(id,nonexistent){
    var token =Math.random()*1000+"";
    var expiresAtDate = new Date();
    expiresAtDate.setDate(expiresAtDate.getDate()+3);
    var expiresAt = expiresAtDate.getTime();
    return sdb.exists({id:id}).then(function(exists){
        if(!exists){
            return nonexistent;
        }else{
            return sdb
            .update({id:id},{token:token,expiresAt:expiresAt})
            .read({id:id})
            .then(function(rows){
                let toReturn= {
                    server:{
                        server:{
                            id:rows[0].id,
                            _ref:"-",
                            createdBy:rows[0].createdBy,
                            createdTime:new Number(rows[0].createdTime),
                            name:rows[0].name,
                            lastConnection:new Number(rows[0].lastConnection)
                        },
                        token:{
                            expiresAt:new Number(rows[0].expiresAt),
                            token:rows[0].token
                        }
                    }
                }
                return toReturn;
            })
        }
    })
}
exports.updateToken.shape={}



exports.delete=function(id,nonexistent){
    return sdb.exists({id:id}).then((exists)=>{
        if(!exists){
            return nonexistent;
        }else{
            return sdb.delete({id:id});
        }
    })
}
exports.delete.shape={}
/**
 * no pongo el METADATA correspondiente porque no entiendo qué significa
 */
exports.list=function(){
    return sdb.read().then(function(data){
        let jsonified=data.map(function(original){
            return {
                "id":original.id,
                "_ref":"string",
                "createdBy":original.createdby,
                "createdTime":original.createdtime,
                "name":original.name,
                "lastConnection":original.lastconnection
            }
        })
        return {
            "servers":jsonified
        }
    })
}
exports.list.shape={};

exports.get=function(id,nonexistent){
    return sdb.exists({id:id}).then(function(exists){
        if(!exists){
            return nonexistent
        }else{
            return sdb.read({id:id}).then(function(rows){
                return {
                    "server": {
                        "id": rows[0].id,
                        "_ref": "-",
                        "createdBy": rows[0].createdBy,
                        "createdTime": new Number(rows[0].createdTime),
                        "name": rows[0].name,
                        "lastConnection": new Number(rows[0].lastConnection)
                      }
                }
            })
        }
    }).catch((e)=>{
        return nonexistent;
    });
}
exports.get.shape={};