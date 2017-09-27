module.exports=function run(){
    let functions=arguments;
    let current=Promise.resolve();
    for(let f of functions){
        current=current.then(f);
    }
    return current;
}