/**
 * @module 
 * @description CallWrapper tiene todos los miebros de keep pero 
 * al resultado de todas las funciones le aplica la función fun
 * */

function wrap(fun,wrapper){
    return function(){
        let ret = fun.apply(null,arguments);
        return wrapper(ret);
    }
}


/**
 * CallWrapper tiene todos los miebros de keep pero 
 * al resultado de todas las funciones le aplica la función fun
 * @param {*} keep 
 * @param {*} fun 
 */
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