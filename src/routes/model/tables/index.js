const EasyTable=require("./EasyTable");


const businessUsersSchema={
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

const usersSchema={
    id:"serial",
    _ref:"varchar(40)",
    applicationOwner: "varchar(40)",

    password:"varchar(40)",

    type: "varchar(40)",
    username: "varchar(40)",
    name: "varchar(40)",
    surname: "varchar(40)",
    country: "varchar(40)",
    email: "varchar(40)",
    birthdate: "varchar(40)",

    fbUserId:"varchar(200)",
    fbAuthToken:"varchar(1000)",
}

const userImagesSchema={
    id:"bigint",
    image:"varchar(200)"
}

const carsSchema={
    id:"serial",
    _ref:"varchar(40)",
    owner:"bigint"
}

const carPropertiesSchema={
    id:"bigint",
    name:"varchar(40)",
    value:"varchar(40)"
}

const lastCommitsSchema={
    ruleId:"serial",
    commitId:"bigint",
    _ref:"varchar(40)"
}

const commitsSchema={
    id:"serial",
    language:"varchar(40)",
    active:"varchar(40)",//"true" or "false"
    blob:"text",
    message:"text",
    timestamp:"bigint",
    businessUsername:"varchar(40)",
    ruleId:"bigint"
}

const tripSchema={
    id:"serial",
    applicationOwner:"varchar(40)",
    driver:"bigint",
    passenger:"bigint",

    startTimestamp:"bigint",
    startStreet:"varchar(100)",
    startLat:"double precision",
    startLon:"double precision",

    endTimestamp:"bigint",
    endStreet:"varchar(100)",
    endLat:"double precision",
    endLon:"double precision",

    totalTime:"bigint",
    waitTime:"bigint",
    travelTime:"bigint",
    distance:"bigint",

    costCurrency:"varchar(100)",
    costValue:"decimal(10,2)"


}

const stepSchema={
    tripId:"bigint",
    timestamp:"bigint",
    lat:"double precision",
    lon:"double precision"
}

const transactionSchema={
    id:"serial",
    userId:"bigint",
    tripId:"bigint",
    timestamp:"bigint",
    costCurrency:"varchar(40)",
    costValue:"varchar(40)",
    description:"text",
    data:"text"//vendria a ser json
}
const tables={
    servers:new EasyTable("servers",serversSchema,  ["id"]),
    
    businessUsers:  new EasyTable("businessUsers",  businessUsersSchema,    ["username"]),
    roles:  new EasyTable("roles",  rolesSchema,    ["username","role"]),

    users:  new EasyTable("users",  usersSchema,    ["id"]),
    userImages:  new EasyTable("userImages",  userImagesSchema,    ["id","image"]),
    cars:  new EasyTable("cars", carsSchema,    ["id","owner"]),
    carProperties:  new EasyTable("carProperties", carPropertiesSchema,    ["id","name"]),


    lastCommits: new EasyTable("lastCommits", lastCommitsSchema,    ["ruleId"]),
    commits: new EasyTable("commits", commitsSchema, ["id"]),

    trips: new EasyTable("trips", tripSchema, ["id"]),
    steps: new EasyTable("steps", stepSchema, ["tripId","timestamp","lat","lon"]),

    transactions:new EasyTable("transactions", transactionSchema, ["id"])
}

for (let t in tables){
    module.exports[t]=tables[t];
}

module.exports.restart=function(){
    let names=Object.keys(tables);
    let deletionPromises=names.map(function(name){
        return tables[name].delete();
    });

    

    return Promise.all(deletionPromises)
}

module.exports.restartWithAdmin=function(){
    return module.exports.restart()
    .then(()=>{
        let addAdminUser=tables.businessUsers.create({
            _ref:"ref",
            username:"admin",
            password:"admin",
            name:"jose ignacion",
            surname:"sbzsbz",
            token:"addddada",
            expiresAt:10000
        });

        let addAdminRoles=Promise.all(
            ["user","manager","admin"]
            .map((r)=>
                tables.roles.create({
                    username:"admin",
                    role:r
                })
            )
        );

        return Promise.all([addAdminUser,
            addAdminRoles,
        ]);
/*
let addPepeuser=tables.users.create({
            _ref:"ref",
            applicationOwner: "varchar(40)",
            
                password:"varchar(40)",
            
                type: "varchar(40)",
                username: "varchar(40)",
                name: "varchar(40)",
                surname: "varchar(40)",
                country: "varchar(40)",
                email: "varchar(40)",
                birthdate: "varchar(40)",
            
                fbUserId:"varchar(200)",
                fbAuthToken:"varchar(1000)",
        });

        let fotiUser=tables.userImages.create({
            id:"1",
            image:"varchar(200)"
        });
        let fotiUser2=tables.userImages.create({
            id:"2",
            image:"varchar(200)"
        });

        let car1=tables.cars.create({
            id:"1",
            _ref:"asd",
            owner:"1"
        });

        let car2=tables.cars.create({
            id:"2",
            _ref:"asd",
            owner:"1"
        });


        let prop1=tables.carProperties.create({
            id:"1",
            name:"varchar(40)",
            value:"50pe"
        });

        let prop2=tables.carProperties.create({
            id:"1",
            name:"otra",
            value:"50pe"
        });

        let prop3=tables.carProperties.create({
            id:"2",
            name:"otra",
            value:"1000pe"
        });
    
        return Promise.all([addAdminUser,
            addAdminRoles,
            addPepeuser,
            fotiUser,
            fotiUser2,
            car1,
            car2,
            prop1,
            prop2,
            prop3
        ]);
        */
    });

}