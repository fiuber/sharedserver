function satisfiesShape(o,shape){
    for(let k in shape){
        if(k in o && (shape[k] instanceof Object) && !satisfiesShape(o[k], shape[k]) ){
             return false;
        }
        if(! (k in o)){
            return false;
        }

    }
    return true;
}

module.exports=satisfiesShape;