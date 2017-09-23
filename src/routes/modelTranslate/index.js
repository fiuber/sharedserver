module.exports=function translate(model,translator){
    let ret={}
    for(let k in model){
        ret[k]=model[k];
        if(translator[k]){//esto seguramente no esté logrando lo que quiero pero no importa
            ret[k].outputShape=translator[k]
        }
    }
    return ret;
}