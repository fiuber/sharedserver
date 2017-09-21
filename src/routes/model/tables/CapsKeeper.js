function actualKey(key,actualNames){
    for(let actualName of actualNames){
        if(key.toLowerCase()===actualName.toLowerCase()){
            return actualName
        }
    }
    return key;
}

function actualKeys(object,actualNames){
    let ret={};
    for (let k in object){
        let kFixed=actualKey(k,actualNames);
        ret[kFixed]=fixCaps(object[k],actualNames);
    }
    return ret;
}

function fixCaps(something,actualNames){
    if(something instanceof Array){
        return something.map((o)=>fixCaps(o,actualNames))
    }else if(something instanceof Object){
        return actualKeys(something,actualNames);
    }else{
        return something;
    }

}


function wrap(fun,actualNames){
    return function(){
        let ret = fun.apply(null,arguments);
        return Promise.resolve(ret).then(function(result){
            let asdasd=fixCaps(result,actualNames);
            console.log(asdasd);
            return asdasd;
        })
    }
}


function CapsKeeper(keep,actualFields){
    let protoKeys=[];
    if(keep.prototype){
        protoKeys=Object.keys(keep.prototype);
    }

    let allKeys=protoKeys.concat(Object.keys(keep));
    for(let field of allKeys){
        this[field]=wrap(keep[field].bind(keep),actualFields);
    }
}

module.exports=CapsKeeper;