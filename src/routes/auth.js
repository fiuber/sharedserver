const express = require('express');

var router = express.Router();

exports.login = function(req,res,next){
    
    res.send("cookie: "+JSON.stringify(req.cookies));
};

exports.register = function(req,res,next){
    
    res.send("jiji");
};

exports.logout=function(req,res,next){
    
    res.send("ADIOS");
};

exports.middleware=function(authorization){
    return function(req,res,next){
        //podría chequear usando una query a postgres y luego authorization
        next();
    }
}