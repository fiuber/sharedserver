import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import {Dialog} from "./Dialog"

export class Row extends React.Component{
    constructor(props){
        super(props);
        this.state={
            row:props.data,
            expanded:false,
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
        this.updateCallback(content).then(()=>{
            this.props.gotoPrevious();
        })
    }

    onReturn(){
        this.props.gotoPrevious();
    }


    onUpdate(){
        let username=this.state.row.username;
        this.props.goto(()=><Dialog 
            content={this.state.row}
            onSubmit={this.onSubmit.bind(this)} 
            onReturn={this.onReturn.bind(this)}    
        />)
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
            renderedRowData=<span><button class="btn btn-primary" onClick={this.onClose}><span align="center" class="glyphicon glyphicon-minus"></span></button>{this.renderOpened()}</span>;
        }else{
            renderedRowData=<span><button class="btn btn-primary" onClick={this.onOpen }><span align="center" class="glyphicon glyphicon-plus"></span></button>{this.renderClosed()}</span>;
        }

        let updateCell=<td><button class="btn btn-primary" onClick={this.onUpdate}><span align="center" class="glyphicon glyphicon-edit"></span></button></td>;
        let removeCell=<td><button class="btn btn-primary" onClick={this.removeCallback}><span align="center" class="glyphicon glyphicon-remove"></span></button></td>;
        let selectCell=()=><td><input type="checkbox" checked={this.props.checked} onChange={this.props.onChange}/></td>

        return <tr>
            <td>{renderedRowData}</td>  
            {this.updateCallback?updateCell:""}
            {this.removeCallback?removeCell:""}
            {this.props.onChange==null?"":selectCell()}
        </tr>
    }
}