import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import {Dialog} from "./Dialog";


export class CreationDialogOpener extends React.Component{
    constructor(props){
        super(props);
        this.onSubmitCallback=props.onSubmit;
    }
    onSubmit(content){
        console.log("==================");
        //ANDA MAL
        //this.onSubmitCallback(content);
        //this.props.gotoPrevious();
        // ANDA PEOR
        this.onSubmitCallback(content).then(()=>{
            this.props.gotoPrevious();
        });
        
        
        
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