import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import {Dialog} from "./table/Dialog";

export class MainScreen extends React.Component {
    constructor(props){
        super(props);
        this.token=props.token;
        this.state={
            me:{
                "username":"(loading)",
                "name": "(loading)",
                "surname": "(loading)",    
                "roles": []
            }
        }
        this.content={
            "new password": "",
            "new name": "",
            "new surname": "",
        }

        fetch("/business-users/me",{
            method:"GET",
            headers: {
              'Authorization': 'api-key '+this.token
            },
        })
        .then((res)=>res.json())
        .then((jsn)=>{
            this.setState({
                me:jsn.businessUser
            })
        })
        
        
    }
    onSubmit(values){
        console.log("3333333333333333333333333333333")
        console.log(values)
        console.log({
            "_ref":this.state.me._ref,
            "username": this.state.me.username,
            "password": values["new password"],
            "name": values["new name"],
            "surname": values["new surname"],
            "roles": []
        })
        return fetch("/business-users/me",{
            method:"PUT",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
            body:JSON.stringify({
                "_ref":this.state.me._ref,
                "username": this.state.me.username,
                "password": values["new password"],
                "name": values["new name"],
                "surname": values["new surname"],
                "roles": []
            })
        })
        /*
        .then((res)=>{
            console.log("THE RESPONSE------");
            console.log(res);
        })
        */
        
        .then((res)=>res.json())
        .then((jsn)=>{
            console.log("LO QUE LLEGA::")
            console.log(jsn)
            this.setState({
                me:jsn.businessUser
            })
        })
        

    }

    render(){
        return (
            <div>
                <h1>Welcome, {this.state.me.name} {this.state.me.surname}</h1>
                <h3>Logged in as {this.state.me.username}</h3>
                <h4>Click "Submit" to modify your account information"</h4>
                You are a {this.state.me.roles.join(", ")}
                <Dialog
                    content={this.content}
                    onSubmit={this.onSubmit.bind(this)}
                />

            </div>
        );
    }
}