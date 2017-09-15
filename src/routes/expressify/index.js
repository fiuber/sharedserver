const apify=require("./apify.js");
const wrapAll= require("./wrapAll.js");

/**
 * Decouples apify.js and express.
 * @param {shape} shape an object representing the 
 * shape of the json objects accepted
 * @param {object} metadata an object that will be inserted 
 * in the successful response under the "metadata" 
 * property
 * @param {fn} fun the function to expressify
 */
function expressify(shape,metadata,fun){
    var f=apify(shape,metadata,fun);
    return function(req,res){

        
        function send(status,data){
            var statusDef=0;
            switch (status) {
                case apify.SUCCESS:
                    switch (req.method) {
                        case "POST": statusDef=201;break;
                        case "GET":statusDef=200;break;
                        case "PUT":statusDef=200;break;
                        case "DELETE":statusDef=204;break;
                        default: statusDef=200; break;
                    }
                    break;
                case apify.BAD_REQUEST: statusDef=400; break;
                case apify.BAD_RESOURCE: statusDef=404; break;
                case apify.ERROR: statusDef=500;break;
                default: statusDef=500; break;
            }

            var dataDef=null;
            if(status==apify.SUCCESS){
                dataDef=data;
            }else{
                dataDef={
                    code:statusDef,
                    error:data
                }
            }

            if(data==undefined || data==null){
                res.sendStatus(statusDef)
            }else{
                res.status(statusDef).send(dataDef);
            }
            
        }


        f(req.body,send,req.params);
    }
}

expressify.all=function(module,metadata){
    return wrapAll(function(f){
        if(f.shape==undefined){
            return expressify(module.shape,metadata,f)
        }else{
            return expressify(f.shape,metadata,f)
        }
    },module)
}

module.exports=expressify;