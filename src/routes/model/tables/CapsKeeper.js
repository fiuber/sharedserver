const CallWrapper=require("./CallWrapper");

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


function CapsKeeper(keep,actualFields){
    function wrapper (ret){
        return Promise.resolve(ret).then(function(result){
            return fixCaps(result,actualFields);
        })
    }

    CallWrapper.call(this,keep,wrapper);
}

module.exports=CapsKeeper;