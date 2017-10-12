import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "./CrudTable";

export class BusinessUsers extends CrudTable{

    constructor(props){
        super(props);
        console.log("las props son:");
        console.log(props);
        super.token=props.token;
        this.token=props.token;
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
        console.log("DELETEEEEEEEEE");
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
}