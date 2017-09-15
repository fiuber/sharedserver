module.exports=function wrapAll(fun,obj){
    var res={};
    for(var k of Object.keys(obj)){
        if(obj[k] instanceof Function){
            res[k]=fun(obj[k]);
        }
    }
    return res;
}