const CallWrapper = require("./CallWrapper");

function addThenMethods(promise,source,keys){
    for(let k of keys){
        promise[k]=function(){
            let myArgs=arguments;
            let ret = Promise.resolve(promise.then(function(){
                return source[k].apply(source,myArgs)
            }));
            addThenMethods(ret,source,keys);
            return ret;
        }
    }
}

/**
 * Overloads the interface of any object so 
 * it returns a custom promise, that allows for simpler calls
 * @param {Object} obj 
 */
function FastPromiser(obj){
    let protoKeys=[];
    if(obj.prototype != Object.prototype && obj.prototype){
        protoKeys=Object.keys(obj.prototype);
    }
    let ownKeys=Object.keys(obj);
    let keys=protoKeys.concat(ownKeys);

    console.log("------- LAS CLAVES SON --------")
    console.log(keys);

    let funKeys=keys.filter((k)=>obj[k] instanceof Function);

    function wrap(ret){
        let definitiveReturn=Promise.resolve(ret);
        addThenMethods(definitiveReturn,obj,funKeys);
        return definitiveReturn;
    }



    CallWrapper.call(this,obj,wrap);
}

module.exports=FastPromiser;