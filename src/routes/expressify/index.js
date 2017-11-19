const apify=require("./apify/apify.js");
const wrapAll= require("./wrapAll.js");
const reshaperCreator=require("./reshaperCreator");
const log=require("debug")("fiuber:tests")
/**
 * @module routes/expressify
 */

/**
 * Decouples apify and express.
 * @param {shape} shape an object representing the 
 * shape of the json objects accepted
 * @param {fn} fun the function to expressify
 * @param {Function} reshapeOutput a function that 
 * reshapes the json response.
 * @return an apified function that can be used by express
 */
function expressify(shape,fun,reshapeOutput){
    var f=apify(shape,fun);
    return function(req,res){

        
        function send(status,data){
            //console.log("DATA QUE LE LLEGA A EXPRESSIFY:",data);
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
                if(data!=null){
                    dataDef=reshapeOutput(data);
                }
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

        f(req.body,send,req.params,res.locals.identification,req.query);
    }
}

/**
 * @method all
 * @description Expressifies a module that was previously translated
 * @param module 
 * @param metadata
 * @return expressified module
 */
expressify.all=function(module,metadata){
    return wrapAll(function(f){
        let inShape=f.shape || module.shape;

        let reshaper=reshaperCreator(f.outputShape || module.outputShape);

        function trueReshaper(data){

            let reshaped=null
            try{
                reshaped = reshaper(data);
            }catch(e){
                reshaped=data;
            }
            
            if(reshaped.metadata==undefined){
                reshaped.metadata=metadata;
            }else{
                for(let k in metadata){
                    reshaped.metadata[k]=metadata[k];
                }
            }
            
            return reshaped;
        }
        return expressify(inShape,f,trueReshaper)
    },module)
}

module.exports=expressify;