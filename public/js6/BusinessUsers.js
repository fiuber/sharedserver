import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "./CrudTable";

class Strategy {
    constructor(token){
        this.token=token;
    }
    getAll(){
        console.log("This is:")
        console.log(this);
        console.log(this.constructor);
        console.log(this.prototype);
        console.log("MI token es",this.token);
        return fetch("/business-users",{
            method:"GET",

            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>jsn.businessUser);
    }

    doUpdate(row,content){
        return fetch("/business-users/"+row.username,{
            method:"PUT",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
            body:JSON.stringify({
                username:row.username,
                password:content.password,
                name:content.name,
                surname:content.surname,
                roles:[content.role]
            })
        })
    }

    doDelete(row){
        return fetch("/business-users/"+row.username,{
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
            username:{row.username}
            <br/>
            name:{row.name}
            <br/>
            surname:{row.surname}
            <br/>
            roles:{row.roles.map((x)=>
                <span key={x}>{x}<br/></span>
            )}
        </span>);
    }

    renderClosed(row){
        return (<span>username:{row.username}</span>);
    }

    createKey(row){
        return row.username+row.password+row.name+row.surname+row.roles.join("");
    }

    defaults(row){
        return {
            password:row.password,
            name:row.name,
            surname:row.surname,
            role:row.roles[0]
        }
    }

    defaultCreationContent(){
        return {
            username:"username",
            password:"password",
            name:"name",
            surname:"surname",
            role:"user"
        };
    }

    doCreate(content){
        return fetch("/business-users/",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
            body:JSON.stringify({
                username:content.username,
                password:content.password,
                name:content.name,
                surname:content.surname,
                roles:[content.role]
            })
        })
        
    }


}


export class BusinessUsers extends CrudTable{
    
        constructor(props){
            let strategy=new Strategy(props.token);
            super(props,strategy);
        }
        
    }