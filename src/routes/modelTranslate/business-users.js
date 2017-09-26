function token(string,number){
    return {
        token:{
            expiresAt:number("expiresAt"),
            token:string("token")
        }
    }
}

function businessUser(sting,number,array){
    return {
        businessUser:{
            _ref:string("_ref"),
            username:string("username"),
            password:string("password"),
            name:string("name"),
            surname:string("surname"),
            roles:array.at("roles")
        }
    }
}