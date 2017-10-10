const express = require('express');
const authModel=require("./model/business-users");
var router = express.Router();

const authorization=require("auth-header");


exports.login = function(req,res,next){
    
    //res.send("cookie: "+JSON.stringify(req.cookies));
    //res.send("the body is")
    let un=req.body.username;
    let pw=req.body.password;
    authModel.exists(un,pw).then((exists)=>{
        if(exists){
            authModel.newToken(un,pw).then((row)=>{
                res.status(200).send(row.token);  
            })
        }else{
            res.status(404).send({error:"wrong user-password combination"});
        }
    });
};

exports.logout=function(req,res,next){
    authModel.expireToken(req.body.username).then(()=>{
        res.sendStatus(200);
    });
};

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