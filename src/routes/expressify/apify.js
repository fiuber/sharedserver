const satisfiesShape=require("./satisfiesShape.js");

const SUCCESS={"success":true}
const BAD_REQUEST={"bad request":true}
const BAD_RESOURCE={"bad resource":true}
const ERROR={"error":true}

function apify(shape,metadata,fun){
    return function(req_body,send,req_parameters){
        if(req_parameters==undefined){
            req_parameters=[];
        }
        if(req_parameters instanceof Object){
            req_parameters=Object.keys(req_parameters).map(k=>req_parameters[k]);
        }

        var shapeOk=satisfiesShape(req_body,shape);
        if(shapeOk){
            var inexistent={"inexistent":true};
            var argumentsToApply=[];
            if(!req_body || Object.keys(req_body).length==0){
                argumentsToApply=[        ].concat(req_parameters).concat([inexistent]);
            }else{
                argumentsToApply=[req_body].concat(req_parameters).concat([inexistent]);
            }
            
            if(fun.length > argumentsToApply.length){
                send(BAD_REQUEST,"Bad parameters. Send more.");
                return
            }

            return Promise.resolve(fun.apply(undefined,argumentsToApply))
            .then(function(result){
                if(result==inexistent){
                    send(BAD_RESOURCE,"The resource doesn't exist.");
                }else{
                    if(result==null || result ==undefined){
                        send(SUCCESS);
                    }else{
                        result.metadata=metadata
                        send(SUCCESS,result);
                    }
                }
            }).catch(function(e){
                send(ERROR,e.toString());
            });
        }else{
            send(BAD_REQUEST,"Bad body. Send "+ shape.toString());
        }
    }
}
let o=apify;
o.SUCCESS=SUCCESS;
o.BAD_REQUEST=BAD_REQUEST;
o.BAD_RESOURCE=BAD_RESOURCE;
o.ERROR=ERROR;



module.exports=o;