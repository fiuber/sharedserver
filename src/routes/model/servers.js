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

function wTokenOutputShape(string,number){
    return{
        server:{
            server:{
                id:number("id"),
                _ref:"-",
                createdBy:string("createdBy"),
                createdTime:number("createdTime"),//new Number(rows[0].createdTime),
                name:string("name"),//rows[0].name,
                lastConnection:number("lastConnection")//new Number(rows[0].lastConnection)
            },
            token:{
                expiresAt:number("expiresAt"),//new Number(rows[0].expiresAt),
                token:string("token")//rows[0].token
            }
        }
    }
}

function getShape(string,number){
    return {
        server:{
            id: number("id"),
            _ref: "-",
            createdBy: string("createdBy"),
            createdTime: number("createdTime"),
            name: string("name"),
            lastConnection: number("lastConnection")
        }
    }
}

function listShape(string,number,array){
    return {
        servers:array({
            id:number("id"),
            _ref:"-",
            createdBy:string("createdBy"),
            createdTime:number("createdTime"),
            name:string("name"),
            lastConnection:number("lastConnection")
        })
    }
}

exports.add=function(server){
    server.token=0;
    server.expiresAt=0;
    return sdb.create(server).then(function(created){
        return exports.updateToken(created.id,"id not found, how's that possible?");
    });
}
exports.add.outputShape=wTokenOutputShape;


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
exports.update.outputShape=getShape;


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
                return rows[0];
            })
        }
    })
}
exports.updateToken.shape={}
exports.updateToken.outputShape=wTokenOutputShape;



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
        return data;
    })
}
exports.list.shape={};
exports.list.outputShape=listShape;

exports.get=function(id,nonexistent){
    return sdb.exists({id:id}).then(function(exists){
        if(!exists){
            return nonexistent
        }else{
            return sdb.read({id:id}).then(function(rows){
                return rows[0]
            })
        }
    }).catch((e)=>{
        return nonexistent;
    });
}
exports.get.shape={};
exports.get.outputShape=getShape;