const util=require("util");
function satisfiesShape(o,shape){
    for(let k in shape){
        if(k in o && (shape[k] instanceof Object) && !satisfiesShape(o[k], shape[k]) ){
             return false;
        }
        if(! (k in o)){
            console.log("the key "+k+" is not present in "+util.inspect(o,false,null))
            return false;
        }

    }
    return true;
}

module.exports=satisfiesShape;