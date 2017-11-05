import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "./CrudTable";
import {CarEditorButton} from "./CarEditorButton";
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
            Id: {row.id}
            <br/>
            ApplicationOwner: {row.applicationOwner}
            <br/>
            Type: {row.type}
            <br/>
            Username: {row.username}
            <br/>
            Name: {row.name}
            <br/>
            Surname: {row.surname}
            <br/>
            Country: {row.country}
            <br/>
            Email: {row.email}
            <br/>
            Birthdate: {row.birthdate}
            <br/>
            Image: {row.images[0]}
            <br/>
            <CarEditorButton token={this.token} id={row.id}/>
            
            
        </span>);
        
    }

    renderClosed(row){
        return (<span>Username: {row.username}</span>);
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
            type:"type",
            username:"username",
            password:"password",
            firstName:"firstName",
            lastName:"lastName",
            country:"country",
            email:"email",
            birthdate:"birthdate"
        };
    }

    doCreate(content){
        return fetch("/users/",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
            body:JSON.stringify({
                "_ref": "string",
                "type": "string",
                "username": "string",
                "password": "string",
                "fb": {
                  "userId": "string",
                  "authToken": "string"
                },
                "firstName": "string",
                "lastName": "string",
                "country": "string",
                "email": "string",
                "birthdate": "string",
                "images": [
                  "string"
                ]
            })
        })
    }
}


export class Users extends CrudTable{
    constructor(props){
        let strategy=new Strategy(props.token);
        super(props,strategy);
    }
}