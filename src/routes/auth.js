const express = require('express');
const authModel=require("./model/business-users");
var router = express.Router();

const authorization=require("auth-header");

/**
 * @module
 * @description handles authentication
 */
/**
 * A middleware generator function. 
 * It allows access if at least one of the provided authenticators
 * returns true or a promise that resolves to true.
 * 
 * Authenticators take an "authdata" object wich contains the token from the header
 * and the username, in case the header has the form user:hash. They also take
 * an "identify" functions wich takes an identification of the client. Wathever 
 * object this function takes is the "me" object in calls to the next apify-wrapped middleware.
 * 
 * @arg ... A list of authenticators
 */
exports.middleware=function(){
    let authenticators=Array.prototype.slice.call(arguments);
    return function(req,res,next){
        let authData={};

        if(req.get("authorization")){
            let authHeader = authorization.parse(req.get("authorization"));
            if(authHeader.scheme === "api-key"){
                let actualToken=Buffer(authHeader.token, 'base64').toString()
                let decodedParts = actualToken.split(" ");
                authData.token=actualToken;
                if(decodedParts.length==2){
                    authData.username=decodedParts[1];
                }
            }
        }


        function identify(identification){
            res.locals.identification=identification;
        }
        let promises = authenticators.map((authenticator)=>authenticator(authData,identify))
        let allPromise = Promise.all(promises).then((returns)=>{
            if(returns.some((x)=>x)){
                next()
            }else{
                res.set("WWW-Authenticate",authorization.format("api-key"))
                res.status(401).send({code:401,error:"bad credentials"});
            }
        })
        return allPromise;
    }
}

exports.any=function(){
    return true;
}