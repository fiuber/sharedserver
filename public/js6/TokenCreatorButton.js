
import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';

export class TokenCreatorButton extends React.Component{
    constructor(props){
        super(props);
        this.token=props.token;
        this.id=props.id;
        this.state={
            popup:<span></span>
        }
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
            function closePopup(){
                this.setState({popup:<span></span>});
            }
            console.log("ESTE ES JASON")
            console.log(json);
            let popup=<Popout  title='Token Creator' url={window.location.origin + "/dialog.html"} onClosing={closePopup.bind(this)}>
                <h1 align="center"> New Token Created</h1>
                <p>For server <b>{json.server.server.name}.</b><br/>
                The token is valid until <b>{new Date(json.server.token.expiresAt).toString()}.</b><br/>
                The token is <b>{json.server.token.token}.</b></p>
            </Popout>
            this.setState({popup});
        });
    }

    render(){
        return (
            <span>
                <button class="btn btn-primary" onClick={this.onClick.bind(this)}> Update Token </button>
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