function wTokenOutputShape(string,number){
    return{
        server:{
            server:{
                id:number("id"),
                _ref:string("_ref"),
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
            _ref:string("_ref"),
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
            _ref:string("_ref"),
            createdBy:string("createdBy"),
            createdTime:number("createdTime"),
            name:string("name"),
            lastConnection:number("lastConnection")
        })
    }
}

exports.add=wTokenOutputShape;
exports.update=getShape;
exports.updateToken=wTokenOutputShape;
exports.list=listShape;
exports.get=getShape;

exports.ping=function(string,number,array,from){
    let serverShape=wTokenOutputShape(string,number,array,from).server;
    return {
        ping:serverShape
    }
};