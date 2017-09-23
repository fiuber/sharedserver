function wrap(fun,wrapper){
    return function(){
        let ret = fun.apply(null,arguments);
        return wrapper(ret);
        /*
        return Promise.resolve(ret).then(function(result){
            return wrapper(result);
        })
        */
    }
}


function CallWrapper(keep,fun){
    let protoKeys=[];
    if(keep.prototype){
        protoKeys=Object.keys(keep.prototype);
    }

    let allKeys=protoKeys.concat(Object.keys(keep));
    let funKeys=allKeys.filter((k)=>keep[k] instanceof Function);
    for(let field of funKeys){
        this[field]=wrap(keep[field].bind(keep),fun);
    }
}

module.exports=CallWrapper;