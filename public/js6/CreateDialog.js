import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {Dialog} from "./Dialog";


export class CreationDialogOpener extends React.Component{
    constructor(props){
        super(props);
        this.onSubmitCallback=props.onSubmit;
        this.noPopup=<a onClick={this.openPopup.bind(this)}>
            Create
        </a>
        this.yesPopup=<Popout  title='Window title' onClosing={this.closePopup.bind(this)}>
            <Dialog content={props.content} onSubmit={this.onSubmit.bind(this)} />
        </Popout>
        this.state={
            popup:this.noPopup
        }
        //<UpdateDialog token={this.token}/>
    }
    onSubmit(content){
        this.closePopup();
        this.onSubmitCallback(content);
    }
    openPopup(){
        this.setState({
            popup:this.yesPopup
        })
    }
    closePopup(){
        this.setState({
            popup:this.noPopup
        })
    }

    render(){
        return this.state.popup;
    }
}