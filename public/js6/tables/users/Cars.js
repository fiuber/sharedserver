import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "../../table/CrudTable"

class Strategy{
    constructor(token,userId){
        this.token=token;
        this.userId=userId;
    }
    getAll(query){
        return fetch("/users/"+this.userId+"/cars"+query,{
            method:"GET",

            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>{
            console.log("CARS")
            console.log(jsn);
            this.totalRecords=jsn.metadata.total;
            let ret=jsn.cars;
            ret.totalRecords=jsn.metadata.total;
            return ret;
        });
    }

    doDelete(row){
        return fetch("/users/"+this.userId+"/cars/"+row.id,{
            method:"DELETE",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
        })
    }

    

    renderOpened(row){
        return (<span>
            id:{row.id}
            owner:{row.owner}
            properties:
            <ul>
                {row.properties.map((prop)=>{
                    let key=prop.name+prop.value;
                    return <li key={key}>{prop.name}:{prop.value}</li>
                })}
            </ul>
        </span>);
    }

    renderClosed(row){
        return (<span>id:{row.id}</span>);
    }

    createKey(row){
        return row.id+row.owner+row.properties.join("");
    }

    getFilters(){
        return []
    }

    orderBy(){
        return "id";
    }
}


export class Cars extends CrudTable{
    constructor(props){
        let strategy=new Strategy(props.token,props.userId);
        if(props.securityLevel==1){
            strategy.doDelete=null;
        }
        super(props,strategy);
    }
}
