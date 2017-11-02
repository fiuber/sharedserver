function runResult(string,number,array,from){
    return {
        facts:[{
            language:"node-rules-fact",
            blob:string("result")
        }]
    }
}
exports.runOne=runResult;
exports.runMany=runResult;