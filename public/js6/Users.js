import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "./CrudTable";

//import {TokenCreatorButton} from "./TokenCreatorButton"

class Strategy{
    constructor(token){
        this.token=token;
    }
    getAll(){
        console.log("Iam getting all the things")
        return fetch("/users",{
            method:"GET",

            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>{
            console.log("LOS USERS:")
            console.log(jsn.users)

            return jsn.users;
        });
    }

    doUpdate(row,content){
        return Promise.resolve("Cant")
    }

    doDelete(row){
        return fetch("/users/"+row.id,{
            method:"DELETE",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
        })
    }

    

    renderOpened(row){
        return (<span>
            <br/>
            id:{row.id}
            <br/>
            applicationOwner:{row.applicationOwner}
            <br/>
            type:{row.type}
            <br/>
            username:{row.username}
            <br/>
            name:{row.name}
            <br/>
            surname:{row.surname}
            <br/>
            country:{row.country}
            <br/>
            email:{row.email}
            <br/>
            birthdate:{row.birthdate}
            <br/>
            image:{row.images[0]}
            <br/>
            
            
        </span>);
        //<CarEditorButton token={this.token} id={row.id}/>
    }

    renderClosed(row){
        return (<span>username:{row.username}</span>);
    }

    createKey(row){
        return row.id+row.applicationOwner+row.type+row.username+row.name+row.surname+row.country+row.email+row.birthdate+row.images.join("");
    }

    defaults(row){
        return {
            username:"CANT UPDATE"
        }
    }

    defaultCreationContent(){
        return {
            username:"CANT CREATE"
        };
    }

    doCreate(content){
        return Promise.resolve(1);
    }
}


export class Users extends CrudTable{
    constructor(props){
        let strategy=new Strategy(props.token);
        super(props,strategy);
    }
}