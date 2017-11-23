import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "../../table/CrudTable";

import {TokenCreatorButton} from "./TokenCreatorButton"

class Strategy{
    constructor(token, username,securityLevel){
        this.token=token;
        this.username=username;
    }
    getAll(query){
        return fetch("/servers"+query,{
            method:"GET",

            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>{
            this.totalRecords=jsn.metadata.total;
            let ret=jsn.servers;
            ret.totalRecords=jsn.metadata.total;
            return ret;
        });
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
            Id: {row.id}
            <br/>
            CreatedBy: {row.createdBy}
            <br/>
            CreatedTime: {new Date(row.createdTime).toString()}
            <br/>
            Name: {row.name}
            <br/>
            <span class="glyphicon glyphicon-off" 
                style={{color: row.lastConnection < new Date().getTime() - 3600000/*1hora*/ ?  "red" : "green", padding: "2px"}}></span>
            LastConnection: {new Date(row.lastConnection).toString()}
            <br/>
            {(this.securityLevel>1)?<TokenCreatorButton token={this.token} id={row.id} />:""}
            
        </span>);
    }

    renderClosed(row){
        return (<span> Name: {row.name}</span>);
    }

    createKey(row){
        return row.id+row.createdBy+row.createdTime+row.name+row.lastConnection;
    }

    defaults(row){
        return {
            Name: row.name,

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
                createdBy:this.username,
                createdTime:new Date().getTime(),
                name:content.name,
                lastConnection:0
            })
        })
    }

    getFilters(){
        return [
            "name",
            "createdBy",
            "lastConnection"
        ]
    }

    orderBy(){
        return "name";
    }
}


export class Servers extends CrudTable{
    constructor(props){
        let strategy=new Strategy(props.token, props.username,props.securityLevel);
        if(props.securityLevel==1){
            strategy.doCreate=null;
            strategy.doDelete=null;
            strategy.doUpdate=null;
        }
        super(props,strategy);
    }
}