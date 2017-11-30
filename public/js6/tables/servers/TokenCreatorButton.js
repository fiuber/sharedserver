
import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";

export class TokenCreatorButton extends React.Component{
    constructor(props){
        super(props);
        this.token=props.token;
        this.id=props.id;
    }

    onClick(){
        fetch("/servers/"+this.id,{
            method:"POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log("LAS PROPS SON")
            console.log(this.props);
            let gotoPrevious=this.props.gotoPrevious;
            this.props.goto(()=>
                <span>
                    <h1 align="center"> New Token Created</h1>
                    <p>For server <b>{json.server.server.name}.</b><br/>
                    The token is valid until <b>{new Date(json.server.token.expiresAt).toString()}.</b><br/>
                    The token is <b>{json.server.token.token}.</b></p>
                    <button style={{ align: "left" }} class="btn btn-default" onClick={gotoPrevious}>Return</button>
                </span>
            )
        });
    }

    render(){
        return <button class="btn btn-primary" onClick={this.onClick.bind(this)}> Update Token </button>
    }
}