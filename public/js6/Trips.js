
import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "./CrudTable";

class Strategy{
    constructor(token){
        debugger
        this.token=token;
    }
    getAll(){
        console.log("Iam getting all the things")
        return fetch("/trips",{
            method:"GET",

            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>{
            console.log("LOS Trips:")
            console.log(jsn.trips)

            return jsn.trips;
        });
    }

    doUpdate(row,content){
        return Promise.resolve("Cant")
    }

    doDelete(row){
        return Promise.resolve("Cant")
    }

    

    renderOpened(row){
        return (<span>
            <br/>
            Id: {row.id}
            <br/>
            ApplicationOwner: {row.applicationOwner}
            <br/>
            Driver: {row.driver}
            <br/>
            Passenger: {row.passenger}
            <br/>
            Cost: {row.cost}
            <br/>
            
        </span>);
        
    }

    renderClosed(row){
        return (<span>Id: {row.id}</span>);
    }

    createKey(row){
        return row.id+row.applicationOwner+row.type+row.username+row.name+row.surname+row.country+row.email+row.birthdate+row.images.join("");
    }

    defaults(row){
        return {
            username:"CANT UPDATE"
        }
    }

    defaultCreationContent(){
        return {
            type:"CANT CREATE"
        };
    }

    doCreate(content){
        return Promise.resolve(1);
    }
}


export class Trips extends CrudTable{
    constructor(props){
        debugger
        let strategy=new Strategy(props.token);
        super(props,strategy);
    }
}