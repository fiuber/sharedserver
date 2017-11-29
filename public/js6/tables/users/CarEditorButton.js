import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import {Cars} from "./Cars";

export class CarEditorButton extends React.Component{
    constructor(props){
        super(props);
        this.token=props.token;
        this.id=props.id;
    }

    onClick(){
        fetch("/users/"+this.id+"/cars",{
            method:"GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
        })
        .then((res)=>res.json())
        .then((json)=>{
            this.props.goto(()=>
                <span>
                    <link rel="stylesheet" href="style.css"/>
                    <link rel="stylesheet" href="resources/css/bootstrap.min.css"/>
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
                    <script src="resources/js/bootstrap.min.js"></script>
                    <Cars 
                        token={this.token} 
                        userId={this.id} 
                        securityLevel={this.props.securityLevel}
                        goto={this.props.goto}
                        gotoPrevious={this.props.gotoPrevious}
                    />
                </span>
            )
        });
    }

    render(){
        return <button 
            class="btn btn-primary" 
            onClick={this.onClick.bind(this)}
        > 
        Show cars 
        </button>;
        
    }
}