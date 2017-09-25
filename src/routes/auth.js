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
            authModel.newToken(un,pw).then((token)=>{
                res.status(200).send(token);  
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

exports.middleware=function(role){
    let allowedRoles=arguments;
    return function(req,res,next){
        let un=req.cookies.username;
        let token=req.cookies.token;
        authModel.tokenCorrect(un,token).then((correct)=>{
            if(correct){
                authModel.getRoles(un).then((roles)=>{
                    if(     allowedRoles.includes("public") 
                        ||  allowedRoles.some((allowed)=>roles.includes(allowed))){
                        req.body.roles=roles;
                        req.body.username=un;
                        next();
                    }else{
                        res.status(401).send({code:401,error:"wrong role"});
                    }
                })
            }else{
                res.status(401).send({code:401,error:"wrong token"});
            }
        })
    }
}