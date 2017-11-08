const util=require("util");
function satisfiesShape(o,shape){
    if(shape instanceof String || typeof shape ==='string'){
        return o instanceof String || typeof o ==='string'
    }
    if(shape instanceof Number || typeof shape ==='number'){
        return o instanceof Number || typeof o ==='number'
    }

    if(shape instanceof Array){
        if(o instanceof Array){
            if(o.length==0){
                return true;
            }else if(shape.length==0){
                return true;
            }else{
                return !o.some((e)=>!satisfiesShape(e,shape[0]));
            }
        }else{
            return false;
        }
    }

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