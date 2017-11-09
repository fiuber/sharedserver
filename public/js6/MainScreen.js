import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";

export class MainScreen extends React.Component {
    constructor(props){
        super(props);
        this.token=props.token;
    }
    render(){
        return (
            <div></div>
        );
    }
}