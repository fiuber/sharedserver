
import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import {CrudTable} from "../../table/CrudTable";


class Strategy{
    constructor(token,ruleId){
        this.token=token;
        this.ruleId=ruleId;
    }

    getAll(query){
        console.log("I am getting all the commits")
        return fetch("/rules/"+this.ruleId+"/commits",{
            method:"GET",

            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>{
            this.totalRecords=jsn.metadata.total;
            console.log("LOS commits:")
            console.log(jsn.commits)
            let ret=jsn.commits;
            ret.totalRecords=jsn.metadata.total;
            return ret;
        });
    }
    

    renderOpened(row){
        return (<span>
            <br/>
            Author: {row.author.username}
            <br/>
            Blob: {row.message}
            <br/>
            Sent: {new Date(row.timestamp).toString()}
            <br/>
        </span>);
        
    }

    renderClosed(row){
        return (<span>Sent: {new Date(row.timestamp).toString()}</span>);
    }

    createKey(row){
        return row.author.username+row.message+row.timestamp;
    }

    getFilters(){
        return ["message","timestamp"]
    }

    orderBy(){
        return "timestamp";
    }
    
}


export class Commits extends CrudTable{
    constructor(props){
        let strategy=new Strategy(props.token,props.ruleId);
        super(props,strategy);
    }
    
}