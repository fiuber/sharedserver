'use strict';
const cookieParser=require("cookie-parser");
const express = require('express');
const bodyParser = require("body-parser");
// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/reset-danger-danger-danger",require("./restartDatabase"))
app.use("/",require("./src/routes"))//catches all requests. ./routes is an Express router
app.use(express.static("public"))//catches all requests. ./routes is an Express router

//else:
app.use(function(req,res,next) {
  var err = new Error("page not found: "+req.url);
  err.status=404;
  next(err);
});
/*
app.get('/', (req, res) => {
  res.send('Hello world\n'+sumar(2,3));
});
*/


console.log(`Running on http://${HOST}:${PORT}`);

module.exports=app.listen(PORT, HOST);