const EasyTable=require("./EasyTable");

const serversSchema={
    id:"serial",
    name: "varchar(40)",
    createdTime:"bigint",
    createdBy:"varchar(40)",
    token:"varchar(40)",
    expiresAt:"bigint",
    lastConnection:"bigint"
}
const tables={
    servers:new EasyTable("servers",serversSchema,["id"])
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