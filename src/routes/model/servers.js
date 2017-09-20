const db=require("./tables/localdatabase").db;//la única manera no-hack de hacer un require global

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
    return db.one(
        "insert into servers(name,createdTime,createdBy,token,expiresAt) values($1,$2,$3,$4,$5) returning id",
        [server.name,server.createdTime,server.createdBy,000,000]
    ).then((ret)=> {
        server.id=ret.id;
        return exports.updateToken(server.id,"id not found, how's that possible?");
    })
}


/**
 * Updates only the name of the server with the received ID
 */
exports.update=function(body,id,nonexistent){
    console.log("ADENTRO DEL UPDATE")
    return db
    .any("SELECT * FROM servers WHERE id=$1",[id])
    .then(function(data){
        console.log("estoy en then")
        if(data.length==0){
            return nonexistent
        }else{
            return db.none("UPDATE servers SET name=$1 WHERE id=$2",[body.name,id])
        }
    })
}


exports.updateToken=function(id,nonexistent){
    var token =Math.random()*1000+"";
    var expiresAtDate = new Date();
    expiresAtDate.setDate(expiresAtDate.getDate()+3);
    var expiresAt = expiresAtDate.getTime();

    return db
    .any("SELECT * FROM servers WHERE id=$1",[id])
    .then(function(data){

        if(data.length==0){
            return nonexistent;
        }else{
            return db.none(
                "UPDATE servers SET token=$1, expiresAt=$2 WHERE id=$3",
                [token,expiresAt,id]
            ).then(function(){
                return {
                    server:{
                        server:{
                            id:data[0].id,
                            _ref:"-",
                            createdBy:data[0].createdby,
                            createdTime:data[0].createdtime,
                            name:data[0].name,
                            lastConnection:data[0].lastconnection
                        },
                        token:{
                            expiresAt:expiresAt,
                            token:token
                        }
                    }
                }
            }).catch((err)=>{
                console.log("ERRRROOOOOOOOORRRRRR");
                console.log(err);
            })
        }
    }).catch((err)=>{
        console.log("ERRRROOOOOOOOORRRRRR");
        console.log(err);
    })
}
exports.updateToken.shape={}



exports.delete=function(id,nonexistent){
    return db
    .any("SELECT * FROM servers WHERE id=$1",[id])
    .then(function(data){
        if(data.length==0){
            return nonexistent
        }else{
            return db.none("DELETE FROM servers WHERE id=$1",[id])
        }
    })
}
exports.delete.shape={}
/**
 * no pongo el METADATA correspondiente porque no entiendo qué significa
 */
exports.list=function(){
    return db.any("SELECT * FROM servers").then(function(data){
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
    return db.one("SELECT * FROM servers WHERE id=$1",[id])
    .then(function(data){
        return {
            "server": {
                "id": id,
                "_ref": "-",
                "createdBy": data.createdby,
                "createdTime": data.createdtime,
                "name": data.name,
                "lastConnection": data.lastconnection
              }
        }
    }).catch(function(e){
        return nonexistent;
    });
}
exports.get.shape={};