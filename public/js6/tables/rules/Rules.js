
import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "../../table/CrudTable";
import {ViewCommitsButton} from "./ViewCommitsButton"


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
            this.totalRecords=jsn.metadata.total;
            console.log("LOS rules:")
            console.log(jsn.rules)
            let ret=jsn.rules;
            ret.totalRecords=jsn.metadata.total;
            return ret;
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

            <ViewCommitsButton ruleId={row.id} token={this.token}/>
            
        </span>);
        
    }

    renderClosed(row){
        return (<span>Id: {row.id}</span>);
    }

    createKey(row){
        return row.id;
    }

    defaults(row){
        return {
          "language": "string",
          "blob": "string",
          "active": true
        };
    }

    defaultCreationContent(){
        return {
          "language": "string",
          "blob": "string",
          "active": true
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
                "active": content.active
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
        /*
        let actualCallback=()=>{};
        let selectionCallback=(selection)=>{
            actualCallback(selection)
        }
        */
        super(props,strategy,props.selectionCallback);
        //actualCallback=this.selectionCallback.bind(this);
    }


    
}