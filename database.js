const usuario ="postgres";
const contra ="postgres";

const url = process.env.DATABASE_URL || "postgres://"+usuario+":"+contra+"@db:5432/";
console.log("ENtrando a la base de datos en: " +url);
const pgp = require("pg-promise")();
const db = pgp(url);

db.connect().then(obj => {
    console.log("connection successful")
}).catch(err =>{
    console.log("connecction unsuccessful")
})

module.exports.db=db;
module.exports.restarted=function(){
    return db.none("drop table if exists servers cascade")
    .then(()=> db.none("create table servers(\
        id serial primary key,\
        name varchar(40), \
        createdTime bigint,\
        createdBy varchar(40),\
        token varchar(40),\
        expiresAt bigint,\
        lastConnection bigint\
        );"))
};