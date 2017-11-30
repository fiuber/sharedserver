function runResult(string,number,array,from){
    return {
        facts:array({
            language:"node-rules-fact",
            blob:string("result")
        })
        /*
        facts:[{
            language:"node-rules-fact",
            blob:string("result")
        }]
        */
    }
}
exports.runOne=runResult;
exports.runMany=runResult;