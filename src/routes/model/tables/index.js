const EasyTable=require("./EasyTable");


const usersSchema={
    _ref:"varchar(40)",
    username:"varchar(40)",//no id. username is the id
    password:"varchar(40)",
    name:"varchar(40)",
    surname:"varchar(40)",
    token:"varchar(40)",
    expiresAt:"bigint"
}
//TODO: hay que poner cascade! y foreign key!

const rolesSchema={
    username:"varchar(40)",
    role:"varchar(40)"
}

const serversSchema={
    id:"serial",
    name: "varchar(40)",
    createdTime:"bigint",
    createdBy:"varchar(40)",
    token:"varchar(40)",
    expiresAt:"bigint",
    lastConnection:"bigint",
    _ref:"varchar(40)"
}
const tables={
    servers:new EasyTable("servers",serversSchema,  ["id"]),
    users:  new EasyTable("users",  usersSchema,    ["username"]),
    roles:  new EasyTable("roles",  rolesSchema,    ["username","role"])
}

for (let t in tables){
    module.exports[t]=tables[t];
}

module.exports.restart=function(){
    let names=Object.keys(tables);
    let deletionPromises=names.map(function(name){
        return tables[name].delete();
    });
    return Promise.all(deletionPromises);
}