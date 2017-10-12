import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout'
import {UpdateDialog} from "./UpdateDialog"

export class Row extends React.Component{
    constructor(props){
        super(props);
        this.state={
            row:props.data,
            expanded:false,
            popup:<span></span>
        }
        this.token=props.token;
        this.onUpdate=this.onUpdate.bind(this);
        this.onRemove=this.onRemove.bind(this);
        this.onOpen=this.onOpen.bind(this);
        this.onClose=this.onClose.bind(this);
        this.updated=props.onUpdate;
    }

    onUpdate(){
        console.log("update")
        
        function removePopup(){
            this.setState({popup:<span></span>});
        }

        function success(){
            removePopup.call(this);
            this.updated();
        }

        let username=this.state.row.username;
        let updated=this.updated;
        let popup=(
        <Popout  title='Window title' onClosing={removePopup.bind(this)}>
            <UpdateDialog token={this.token} username={username} data={this.state.row} onSuccess={success.bind(this)}/>
        </Popout>
        );
        this.setState({popup});
    }

    onRemove(){
        console.log("REMOVE")
    }

    onOpen(){
        this.setState({expanded:true})
    }
    onClose(){
        this.setState({expanded:false})
    }

    render(){
        return <tr>
            <td></td>
            <td><a onClick={this.onUpdate}>{this.state.popup}update</a></td>
            <td><a onClick={this.onRemove}>remove</a></td>
        </tr>
    }

    render(){
        
        let renderedRowData=<span></span>;
        console.log("MI STATE ES:")
        console.log(this.state)
        let row=this.state.row;

        if(this.state.expanded){
            
            renderedRowData=(<a onClick={this.onClose}>
                <br/>
                username:{row.username}
                <br/>
                name:{row.name}
                <br/>
                surname:{row.surname}
                <br/>
                roles:{row.roles.map((x)=>
                    <span key={x}>{x}<br/></span>
                )}
            </a>);
        }else{
            renderedRowData=(<a onClick={this.onOpen}> username:{row.username}</a>);
        }


        return <tr>
            <td>{renderedRowData}</td>  
            <td><a onClick={this.onUpdate}>{this.state.popup}update</a></td>
            <td><a onClick={this.onRemove}>remove</a></td>
        </tr>
    }
}