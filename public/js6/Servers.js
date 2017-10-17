import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "./CrudTable";

import {TokenCreatorButton} from "./TokenCreatorButton"

class Strategy{
    constructor(token){
        this.token=token;
    }
    getAll(){
        return fetch("/servers",{
            method:"GET",

            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>jsn.servers);
    }

    doUpdate(row,content){
        return fetch("/servers/"+row.id,{
            method:"PUT",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
            body:JSON.stringify({//sólo me importa name
                id:new String(row.id).valueOf(),
                _ref:row._ref,
                createdBy:"q",
                createdTime:0,
                name:content.name,
                lastConnection:0
            })
        })
    }

    doDelete(row){
        return fetch("/servers/"+row.id,{
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
            createdBy:{row.createdBy}
            <br/>
            createdTime:{row.createdTime}
            <br/>
            name:{row.name}
            <br/>
            lastConnection:{row.lastConnection}
            <br/>
            <TokenCreatorButton token={this.token} id={row.id} />
            
        </span>);
    }

    renderClosed(row){
        return (<span>name:{row.name}</span>);
    }

    createKey(row){
        return row.id+row.createdBy+row.createdTime+row.name+row.lastConnection;
    }

    defaults(row){
        return {
            name:row.name,
        }
    }

    defaultCreationContent(){
        return {
            name:"name",
        };
    }

    doCreate(content){
        return fetch("/servers/",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
            body:JSON.stringify({
                id:"asd",
                _ref:"asd",
                createdBy:"a user",
                createdTime:0,
                name:content.name,
                lastConnection:0
            })
        })
    }
}


export class Servers extends CrudTable{
    constructor(props){
        let strategy=new Strategy(props.token);
        super(props,strategy);
    }
}