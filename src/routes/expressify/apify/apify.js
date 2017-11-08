const satisfiesShape=require("./satisfiesShape.js");

const SUCCESS={"success":true}
const BAD_REQUEST={"bad request":true}
const BAD_RESOURCE={"bad resource":true}
const ERROR={"error":true}

const util=require("util");

/**
 * @module routes/expressify/apify
 * @description This is a function decorator. 
 * The passed function doesn't know about requests or responses. 
 * This decouples logic from communications.
 * @param {*} shape the shape that must be satisfied by the body of the request
 * @param {*} fun the function to be called
 * @return a function that can be used by expressify
 */
function apify(shape,fun){
    
    return function(req_body,send,req_parameters,origin){
        if(req_parameters==undefined){
            req_parameters=[];
        }
        if(req_parameters instanceof Object){
            req_parameters=Object.keys(req_parameters).map(k=>req_parameters[k]);
        }

        var shapeOk=satisfiesShape(req_body,shape);
        if(shapeOk){
            let inexistent={"inexistent":true};
            let badRevision={"bad revision":true};
            /*
            let itsThis={
                inexistent:{"inexistent":true},
                badRevision:{"bad revision":true},
                identity:persistence.data,
                identify:persistence.add
            }
            */
            var argumentsToApply=[];
            if(!req_body || Object.keys(req_body).length==0){
                argumentsToApply=[        ].concat(req_parameters).concat([inexistent,badRevision,origin]);
            }else{
                argumentsToApply=[req_body].concat(req_parameters).concat([inexistent,badRevision,origin]);
            }
            
            if(fun.length > argumentsToApply.length){
                send(BAD_REQUEST,"Bad parameters. Send more.");
                return
            }

            return Promise.resolve(fun.apply(undefined,argumentsToApply))
            .then(function(result){

                if(result==inexistent){
                    //console.log("mando bad resource")
                    send(BAD_RESOURCE,"The resource doesn't exist.");
                }else if(result == badRevision){
                    //console.log("mando bad request")
                    send(BAD_REQUEST,"bad _ref");
                }else{
                    //console.log("mando good")
                    if(result==null || result ==undefined){
                        send(SUCCESS);
                    }else{
                        send(SUCCESS,result);
                    }
                }
            }).catch(function(e){
                send(ERROR,e.stack);
            });
        }else{
            send(BAD_REQUEST,"Bad body. Send "+ util.inspect(shape,false,null));
        }
    }
}
let o=apify;
o.SUCCESS=SUCCESS;
o.BAD_REQUEST=BAD_REQUEST;
o.BAD_RESOURCE=BAD_RESOURCE;
o.ERROR=ERROR;



module.exports=o;