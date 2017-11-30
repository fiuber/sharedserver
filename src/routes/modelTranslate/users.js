function car(string,number,array,from){
    return {
        car:{
            id:string("id"),
            _ref:string("_ref"),
            owner:string("owner"),
            properties:from("properties",array({
                name:string("name"),
                value:string("value")
            }))
        }
    }
}
function carList(string,number,array,from){
    const carShape=car(string,number,array,from).car;
    return {
        cars:from("cars",array(carShape)),
        metadata:{
            total:number("quantity")
        }
    }
}

function user(string,number,array,from){
    let carShape=car(string,number,array,from).car;
    return {
        user:{
            id:string("id"),
            _ref:string("_ref"),
            applicationOwner:string("applicationOwner"),
            type:string("type"),

            cars:from("cars",from("cars",array(carShape))),

            username:string("username"),

            name:string("name"),
            surname:string("surname"),
            country:string("country"),
            email:string("email"),
            birthdate:string("birthdate"),

            balance:from("balance",array({
                currency:string("currency"),
                value:number("value")
            })),
            images:from("images")
        }
    }
}
function userList(string,number,array,from){
    const userShape=user(string,number,array,from).user;
    return {
        users:from("users",array(userShape)),
        metadata:{
            total:number("quantity")
        }

    }
}

exports.list=userList;
exports.add=user;
exports.validate=user;
exports.get=user;
exports.update=user;

exports.getCars=carList;
exports.addCar=car;
exports.getCar=car;
exports.updateCar=car;

