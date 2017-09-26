const express = require('express');
const authModel=require("./model/business-users");
var router = express.Router();

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
        let promises = authenticators.map((authenticator)=>authenticator(req.cookies))
        let allPromise = Promise.all(promises).then((returns)=>{
            if(returns.some((x)=>x)){
                next()
            }else{
                res.status(401).send({code:401,error:"bad credentials"});
            }
        })
    }
}

exports.any=function(){
    return true;
}