
import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {CrudTable} from "../table/CrudTable";

class Strategy{
    constructor(token){
        this.token=token;
    }
    getAll(query){
        console.log("Iam getting all the things")
        return fetch("/trips"+query,{
            method:"GET",

            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>{
            this.totalRecords=jsn.metadata.total;
            console.log("LOS Trips:")
            console.log(jsn)
            console.log(jsn.trips)

            let ret=jsn.trips;
            ret.totalRecords=jsn.metadata.total;
            return ret;
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
            Cost: {row.cost.value} {row.cost.currency}
            <br/>
            
        </span>);
    }

    renderClosed(row){
        return (<span>Id: {row.id}</span>);
    }

    createKey(row){
        return row.id+row.applicationOwner+row.driver+row.passenger+row.cost;
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

    getFilters(){
        return [
            "applicationOwner",
            "driver",
            "passenger",
            "startTimestamp",
            "startStreet",
            "startLat",
            "startLon",
            "endTimestamp",
            "endStreet",
            "endLat",
            "endLon",
            "totalTime",
            "waitTime",
            "travelTime",
            "distance"
        ]
    }

    orderBy(){
        return "startTimestamp";
    }
}


export class Trips extends CrudTable{
    constructor(props){
        let strategy=new Strategy(props.token);
        super(props,strategy);
    }
}