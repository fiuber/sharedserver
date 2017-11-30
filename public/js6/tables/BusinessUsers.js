import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import {CrudTable} from "../table/CrudTable";

class Strategy {
    constructor(token){
        this.token=token;
    }
    getAll(query){
        return fetch("/business-users"+query,{
            method:"GET",

            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>{
            this.totalRecords=jsn.metadata.total;
            let ret=jsn.businessUser;
            ret.totalRecords=jsn.metadata.total;
            return ret;
        });
    }

    doUpdate(row,content){
        console.log("ACTUALIZO BUSINESS USERS")
        console.log(content);
        console.log(row);
        console.log({
            username:row.username,
            password:content.password,
            name:content.name,
            surname:content.surname,
            roles:content.roles,
            _ref:row._ref
        });
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
                roles:content.roles,
                _ref:row._ref
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
            Username: {row.username}
            <br/>
            Name: {row.name}
            <br/>
            Surname: {row.surname}
            <br/>
            Roles: {row.roles.map((x)=>
                <span key={x}>{x}<br/></span>
            )}
        </span>);
    }

    renderClosed(row){
        return (<span> Username: {row.username}</span>);
    }

    createKey(row){
        return row.username+row.password+row.name+row.surname+row.roles.join("");
    }

    defaults(row){
        return {
            password: row.password,
            name: row.name,
            surname: row.surname,
            roles: row.roles
        }
    }

    defaultCreationContent(){
        return {
            username:"",
            password:"",
            name:"",
            surname:"",
            role:""
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
                roles:content.role
            })
        })
        
    }

    getFilters(){
        return ["username","name","surname"]
    }

    orderBy(){
        return "username";
    }


}


export class BusinessUsers extends CrudTable{
    
        constructor(props){
            let strategy=new Strategy(props.token);

            super(props,strategy);
        }
        
    }