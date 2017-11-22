

import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "./CrudTable";
import {CarEditorButton} from "./CarEditorButton";
//import {TokenCreatorButton} from "./TokenCreatorButton"

class Strategy{
    constructor(token, securityLevel){
        this.token=token;
        this.securityLevel=securityLevel;
    }
    getAll(searchQuery){
        console.log("BUSCO:"+"/users"+searchQuery)
        return fetch("/users"+searchQuery,{
            method:"GET",
            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>{
            this.totalRecords=jsn.metadata.total;
            console.log("LOS USERS:")
            console.log(jsn.users)

            let ret=jsn.users;
            ret.totalRecords=jsn.metadata.total;
            console.log("USERS QUE VIENEN:")
            console.log(ret);
            return ret;
        });
    }

    doUpdate(row,content){
        return fetch("/users/"+row.id,{
            method:"PUT",
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
        return row.id+row.applicationOwner+row.type+row.username+row.name+row.surname+row.country+row.email+row.birthdate;
    }

    defaults(row){
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
        console.log("LO CREO CON EL SGTE CONTENIDO",content);
        return fetch("/users/",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
            body:JSON.stringify({
                "_ref": "string",
                "type": content.type,
                "username": content.username,
                "password": content.password,

                /*
                "fb": {
                  "userId": "string",
                  "authToken": "string"
                },
                */
                "firstName": content.firstName,
                "lastName": content.lastName,
                "country": content.country,
                "email": content.email,
                "birthdate": content.birthdate,
                "images": [
                  "string"
                ]
            })
        })
    }

    getFilters(){
        return [
            "applicationOwner",
            "type",
            "username",
            "name",
            "surname",
            "country",
            "email",
            "brithdate"
        ]
    }

    orderBy(){
        return "username";
    }
}


export class Users extends CrudTable{
    constructor(props){
        let strategy=new Strategy(props.token, props.securityLevel);
        super(props,strategy);
    }
}