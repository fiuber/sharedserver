import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';


export class CreationDialogOpener extends React.Component{
    constructor(props){
        super(props);
        this.noPopup=<a onClick={this.openPopup.bind(this)}>
            Create
        </a>
        this.yesPopup=<Popout  title='Window title' onClosing={this.closePopup.bind(this)}>
            <UpdateDialog token={this.token}/>
        </Popout>
        this.state={
            popup:this.noPopup
        }
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

class UpdateDialog extends React.Component {
    constructor(props){
        super(props)
        this.token=props.token;

    }
}

//<UpdateDialog token={this.token} username={username} data={this.state.row} onSuccess={success.bind(this)}/>