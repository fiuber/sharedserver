import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "./CrudTable"

class Strategy{
    constructor(token,userId){
        this.token=token;
        this.userId=userId;
    }
    getAll(){
        return fetch("/users/"+this.userId+"/cars",{
            method:"GET",

            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>jsn.cars);
    }

    doUpdate(row,content){
        return Promise.resolve("CANT UPDATE")
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

    defaults(row){
        return {
            name:"CANT UPDATE",
        }
    }

    defaultCreationContent(){
        return {
            name:"CANT CREATE",
        };
    }

    doCreate(content){
        return Promise.resolve("yesss");
    }
}


export class Cars extends CrudTable{
    constructor(props){
        let strategy=new Strategy(props.token,props.userId);
        super(props,strategy);
    }
}
