import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout'
import {Dialog} from "./Dialog"

export class Row extends React.Component{
    constructor(props){
        super(props);
        this.state={
            row:props.data,
            expanded:false,
            popup:<span></span>
        }
        this.renderOpened=props.renderOpened;
        this.renderClosed=props.renderClosed;
        this.onUpdate=this.onUpdate.bind(this);
        
        this.onOpen=this.onOpen.bind(this);
        this.onClose=this.onClose.bind(this);
        this.onSubmit=this.onSubmit.bind(this);

        this.removeCallback=props.onRemove;
        this.updateCallback=props.onUpdate;
    }

    onSubmit(content){
        this.removePopup();
        this.updateCallback(content);
    }

    removePopup(){
        this.setState({popup:<span></span>});
    }


    onUpdate(){
        let username=this.state.row.username;
        let popup=(
        <Popout  title='Window title' onClosing={this.removePopup.bind(this)}>
            <h1>Updating user {username}</h1>
            <Dialog content={this.state.row} onSubmit={this.onSubmit.bind(this)} />
        </Popout>
        );
        this.setState({popup});
    }

    onOpen(){
        this.setState({expanded:true})
    }
    onClose(){
        this.setState({expanded:false})
    }


    render(){
        
        let renderedRowData=<span></span>;
        let row=this.state.row;
        if(this.state.expanded){
            renderedRowData=<span><a onClick={this.onClose}>(less)</a>{this.renderOpened()}</span>;
        }else{
            renderedRowData=<span><a onClick={this.onOpen }>(more)</a>{this.renderClosed()}</span>;
        }

        return <tr>
            <td>{renderedRowData}</td>  
            <td><a onClick={this.onUpdate}>{this.state.popup}update</a></td>
            <td><a onClick={this.removeCallback}>remove</a></td>
        </tr>
    }
}