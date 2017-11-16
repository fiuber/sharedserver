
import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "./CrudTable";

class Strategy{
    constructor(token){
        this.token=token;
    }
    getAll(query){
        console.log("Iam getting all the things")
        return fetch("/rules"+query,{
            method:"GET",

            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>{
            console.log("LOS rules:")
            console.log(jsn.rules)
            return jsn.rules;
        });
    }

    doUpdate(row,content){
        return fetch("/rules/"+row.id,{
            method:"PUT",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
            body:JSON.stringify({
                "id": "string",
                "_ref": row._ref,
                "language": content.language,
                "lastCommit": {},
                "blob": content.blob,
                "active": true
            })
        })
    }

    doDelete(row){
        return fetch("/rules/"+row.id,{
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
            Language: {row.language}
            <br/>
            Blob: {row.blob}
            <br/>
            Active: {row.active}
            <br/>
            
        </span>);
        
    }

    renderClosed(row){
        return (<span>Id: {row.id}</span>);
    }

    createKey(row){
        return row.id+row.language+row.blob+row.active;
    }

    defaults(row){
        return {
          "language": "string",
          "blob": "string"
        };
    }

    defaultCreationContent(){
        return {
          "language": "string",
          "blob": "string"
        };
    }

    doCreate(content){
        return fetch("/rules/",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
            body:JSON.stringify({
                "id": "string",
                "_ref": "string",
                "language": content.language,
                "lastCommit": {},
                "blob": content.blob,
                "active": true
            })
        })
    }

    getFilters(){
        return ["ruleId"]
    }

    orderBy(){
        return "ruleId";
    }
}


export class Rules extends CrudTable{
    constructor(props){
        let strategy=new Strategy(props.token);
        super(props,strategy);
    }
}