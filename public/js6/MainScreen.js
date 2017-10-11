import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";

export class MainScreen extends React.Component {
    constructor(props){
        super(props);
        this.onBusinessUsers=props.onBusinessUsers;
        this.onServers=props.onServers;
        this.onUsers=props.onUsers;
    }
    render(){
        return (
            <div id="centeredbox">
                <h1>Main Screen</h1>
                <a onClick={this.onBusinessUsers}>
                    Business users
                </a>
                <br/>
                <a onClick={this.onServers}>
                    Servers
                </a>
                <br/>
                <a onClick={this.onUsers}>
                    Users
                </a>
                <br/>
            </div>

        );
    }
}