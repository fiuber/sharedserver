import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {Dialog} from "./Dialog";


export class CreationDialogOpener extends React.Component{
    constructor(props){
        super(props);
        this.onSubmitCallback=props.onSubmit;
    }
    onSubmit(content){
        this.props.gotoPrevious();
        this.onSubmitCallback(content);
    }
    onReturn(){
        this.props.gotoPrevious();
    }
    openPopup(){
        this.props.goto(()=>
            <Dialog 
                content={this.props.content} 
                onSubmit={this.onSubmit.bind(this)} 
                onReturn={this.onReturn.bind(this)}
            />
        )
    }

    render(){
        return <button 
            id="buttonNew" 
            type="button" 
            class="btn btn-primary" 
            onClick={this.openPopup.bind(this)}
            >
                New
        </button>
    }
}