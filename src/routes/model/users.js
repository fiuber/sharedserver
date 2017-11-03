const users=require("./tables").users;
const userImages=require("./tables").userImages;
const cars=require("./tables").cars;
const carProperties=require("./tables").carProperties;

const userShape={
    "_ref": "string",
    "type": "string",
    "username": "string",
    "firstName": "string",
    "lastName": "string",
    "country": "string",
    "email": "string",
    "birthdate": "string",
    "images":[]
};

const carShape={
    "id": "string",
    "_ref": "string",
    "owner": "string",
    "properties": []
};

function fixUserBody(body){

    if(body.fb){
        body.fbUserId=body.fb.userId || null;
        body.fbAuthToken=body.fb.authToken || null;
        delete body.fb;
    }else{
        body.fbUserId=null;
        body.fbAuthToken=null;
    }
    
    
    if(body.firstName){
        body.name=body.firstName;
        delete body.firstName
    }
    if(body.lastName){
        body.surname=body.lastName;
        delete body.lastName;
    }
    body.password=body.password || null;

}


exports.add=function(body,nonexistent,badRevision,me){
    body._ref=Math.random()*1000+"";
    fixUserBody(body);
    return require("./servers").serverIdFromToken(me.token)
    .then((serverId)=>{
        body.applicationOwner=serverId;
        
        return users.create(body)
        .then((created)=>{
            return addImages(created.id,body.images)
            .then(()=>exports.get(created.id))
        })
    })
    
}
exports.add.shape=userShape;


exports.validate=function(body,nonexistent,badRevision){
    let un=body.username;
    let hasPw= (body.password!=undefined);
    let pw=body.password;
    let fbToken=body.facebookAuthToken;


    return users.read({username:un}).then((got)=>{
        let user=got[0];
        
        if(hasPw && pw === user.password){
            return exports.get(user.id);
        }else if(!hasPw && fbToken === user.fbAuthToken){
            return exports.get(user.id);
        }else{
            return badRevision;
        }
    });
}
exports.validate.shape={
    "username":"string"
}

exports.list=function(){
    return users.read().then((allUsers)=>{
        return Promise.all(
            allUsers.map((u)=>exports.get(u.id))
        );
    })
}
exports.list.shape={};

exports.get=function(userId,nonexistent){
    return users.read({id:userId}).then((got)=>{
        if(got.length==0){
            return nonexistent;
        }

        return exports.getCars(userId).then((cars)=>{
            return getBalance(userId).then((balance)=>{
                return getImages(userId).then((images)=>{
                    
                    let ret=got[0];
                    ret.balance=balance;
                    ret.cars=cars;
                    ret.images=images;
                    return ret;
                });
            });
        }); 
    })
}
exports.get.shape={}

exports.delete=function(userId){
    return users.delete({id:userId}).then(()=>{
        return cars.read().then((cars)=>{
            let allDeletions=cars.map((c)=>{
                return exports.deleteCar(c.id);
            })
            return Promise.all(allDeletions).then(()=>null);
        })
    })
}
exports.delete.shape={};

exports.update=function(body,userId,nonexistent,badRevision){
    return users.exists({id:userId}).then((exists)=>{
        if(!exists) return nonexistent;
        return users.read({id:userId}).then((myUsers)=>{
            if(myUsers[0]._ref===body._ref){
                fixUserBody(body);
                body._ref=Math.random()*1000+"";

                return users.update({id:userId},body).then(()=>{
                    return userImages.delete({id:userId})
                    .then(()=>{
                        return addImages(userId,body.images);
                    })
                    .then(()=>{
                        return exports.get(userId);
                    })
                })
            }else{
                return badRevision;
            }
        })
    })
}
exports.update.shape=userShape;

function addImages(id,images){
    let additions=images.map((image)=>{
        return userImages.create({id:id,image:image});
    });
    return Promise.all(additions);
}

exports.deleteCar=function(carId){
    return cars.delete({id:carId}).then(()=>{
        return carProperties.delete({id:carId}).then(()=>null);
    })
}
exports.deleteCar.shape={}

function getImages(userId){
    return userImages.read({id:userId}).then((rows)=>{
        return rows.map((row)=>row.image);
    })
}

function getBalance(userId){
    return Promise.resolve([]);
}

function addProperties(id,properties){
    let creations = properties.map((prop)=>{
        prop.id=id;
        return carProperties.create(prop);
    })
    return Promise.all(creations)
}

exports.addCar=function(body,userId){
    body._ref=Math.random()*1000+"";
    body.owner=userId;
    return cars.create(body).then((created)=>{
        
        return addProperties(created.id,body.properties)
        .then(()=>{
            return exports.getCar(userId,created.id,"EIMPOSSIBLE");
        });
    })
}
exports.addCar.shape=carShape;

exports.getCars=function(userId){
    
    
    return cars.read({owner:userId}).then((myCars)=>{
        let withProperties=myCars.map((car)=>{
            return carProperties.read({id:car.id}).then((properties)=>{
                car.properties=properties;
                return car;
            })
        })
        return Promise.all(withProperties);
    })
}
exports.getCars.shape={};


exports.getCar=function(userId,carId,nonexistent){
    return cars.exists({id:carId,owner:userId}).then((exists)=>{
        if(!exists){
            return nonexistent;
        }
        return cars.read({id:carId,owner:userId}).then((selected)=>{
            return carProperties.read({id:carId}).then((properties)=>{
                let ret=selected[0];
                ret.properties=properties;
                return ret;
            })
        })
    })
}
exports.getCar.shape={};

exports.updateCar=function(body,userId,carId,nonexistent){
    return cars.exists({id:carId,owner:userId}).then((exists)=>{
        if(!exists){
            return nonexistent;
        }
        return cars.update({id:carId,owner:userId},body).then(()=>{
            return carProperties.delete({id:carId}).then(()=>{
                return addProperties(carId,body.properties);
            })
        }).then(()=>{
            return exports.getCar(userId,carId,nonexistent);
        })
    })
}
exports.updateCar.shape=carShape;