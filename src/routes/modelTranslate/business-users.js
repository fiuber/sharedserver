function token(string,number){
    return {
        token:{
            expiresAt:number("expiresAt"),
            token:string("token")
        }
    }
}
exports.token=token;

function businessUser(string,number,array,from){
    return {
        businessUser:{
            _ref:string("_ref"),
            username:string("username"),
            password:string("password"),
            name:string("name"),
            surname:string("surname"),
            roles:from("roles")
        }
    };
}

function businessUserList(string,number,array,from){
    let businessUserShape=businessUser(string,number,array,from).businessUser;
    return {
        businessUser:array(businessUserShape),
    }
}

exports.add=businessUser;
exports.update=businessUser;
exports.get=businessUser;

exports.getMe=businessUser;
exports.updateMe=businessUser;

exports.list=businessUserList;
