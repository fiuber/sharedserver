import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";

export class MainScreen extends React.Component {
    constructor(props){
        super(props);
        this.token=props.token;
        this.onBusinessUsers=props.onBusinessUsers;
        this.onServers=props.onServers;
        this.onUsers=props.onUsers;
    }
    render(){
        return (
            <div></div>
        );
    }
}