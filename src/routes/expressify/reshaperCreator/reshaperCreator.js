const util=require("util");

function reshaperCreator(shape){
    if(shape){
        return reshape.bind(null,shape);
    }else{
        return (x)=>{
            throw new Error("cant reshape"+util.inspect(x,false,null))
        };
    }
}
function reshape(shapeCreator,data){
    
    let shape=shapeCreator(StringSignal.new,NumberSignal.new,ArraySignal.new,FromSignal.new) 
    return reshapeFromShape(shape,data)  ;
}

function reshapeFromShape(shape,data){
    if(shape instanceof FromSignal){
        return reshapeFromShape(shape.innerShape,data[shape.key]);
    }else if(shape instanceof StringSignal){//key
        return new String(data[shape.key]).valueOf();
    }else if(shape instanceof NumberSignal){//key
        return new Number(data[shape.key]).valueOf();
    }else if(shape instanceof ArraySignal){//array. The data MUST be an array.
        return data.map(function(datum){
            return reshapeFromShape(shape.innerShape,datum);
        })
    }else if(shape instanceof String || typeof shape === "string"){//literal
        return shape;
    }else if(shape instanceof Number || typeof shape === "number"){//literal
        return shape
    }else if(shape instanceof Boolean || typeof shape === "boolean"){//literal
        return shape
    }else if(shape instanceof Object){//the reshape has the same keys as the shape
        let ret={};
        for(let key in shape){
            ret[key]=reshapeFromShape(shape[key],data);
        }
        return ret;
    }else{
        return data;
    }

}

function FromSignal(shape,key){
    this.innerShape=shape;
    this.key=key;
}
FromSignal.new=function(key,shape){
    return new FromSignal(shape,key);
}

function ArraySignal(shape){
    this.innerShape=shape;
}
ArraySignal.new=function(shape){
    return new ArraySignal(shape);
}


function StringSignal(key){
    this.key=key;
}
StringSignal.new=function(key){
    return new StringSignal(key);
}


function NumberSignal(key){
    this.key=key;
}
NumberSignal.new=function(key){
    return new NumberSignal(key);
}


module.exports.reshape=reshape;
module.exports.reshaperCreator=reshaperCreator;