import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {Cars} from "./Cars";

export class CarEditorButton extends React.Component{
    constructor(props){
        super(props);
        this.token=props.token;
        this.id=props.id;
        this.state={
            popup:<span></span>
        }
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
            function closePopup(){
                this.setState({popup:<span></span>});
            }
            console.log("ESTE ES JASON")
            console.log(json);
            let popup=<Popout  title='Window title' onClosing={closePopup.bind(this)}>
                <link rel="stylesheet" href="style.css"/>
                <link rel="stylesheet" href="resources/css/bootstrap.min.css"/>
		        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		        <script src="resources/js/bootstrap.min.js"></script>
                <Cars token={this.token} userId={this.id}/>
            </Popout>
            this.setState({popup});
        });
    }

    render(){
        return (
            <span>
                <button onClick={this.onClick.bind(this)}> Show cars </button>
                {this.state.popup}
            </span>
        );
    }
}

/*
createToken(row){
        fetch("/servers/"+row.id,{
            method:"POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
        })
        .then((res)=>res.json())
        .then((json)=>{
            function closePopup(){
                this.popup=<span></span>;
            }
            this.popup=<Popout  title='Window title' onClosing={closePopup.bind(this)}>
                {json}
            </Popout>
            
        })

    }
    */