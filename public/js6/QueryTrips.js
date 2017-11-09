import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {Trips} from "./Trips";


export class QueryTrips extends React.Component{
    constructor(props){
    	debugger
        super(props);
        this.token = props.token;
        this.trips=()=><Trips token={this.token}/>

        this.state={
            displayQuery:true,
            user:"",
            trips:()=>{return;}
        }

        this.consult = this.consult.bind(this);
    }

    consult(nombre){
    	debugger
    	console.log(nombre)
    	console.log(this.state)
      	this.setState({
	        displayQuery:false,
	    	user:nombre,
	    	trips:this.trips
    	});
      	console.log(this.state)

    }

    render(){
    	debugger
        return <div>
            <h1>Hola</h1>
            <button onClick={() => {this.consult("pepe")}}>Consultar</button>
            {this.state.trips()}
        </div>

        
    }
}