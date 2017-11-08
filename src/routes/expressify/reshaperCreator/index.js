/**
 * @module routes/expressify/reshaperCreator
 * @description A function that creates a reshaper function. From a passed "translator" or "shape" function.
 * A reshaper is a function that transforms whathever is passed to it to the shape passed to this function.
 */
let req=require("./reshaperCreator");
module.exports=req.reshaperCreator;