import React from 'react';
import ReactDOM from 'react-dom';
import {Commits} from "./Commits";
import Popout from 'react-popout';

export class ViewCommitsButton extends React.Component{
    constructor(props){
        super(props);
        this.state={
            popup:<span></span>
        }
        this.token=props.token;
        this.ruleId=props.ruleId;
    }
    render(){
        return <span>
            <button onClick={this.onClick.bind(this)}> View commits</button>
            {this.state.popup}
        </span>
    }
    onClick(event){
        function closePopup(){
            this.setState({popup:<span></span>});
        }
        let popup=<Popout  title='Window title' onClosing={closePopup.bind(this)}>
            <link rel="stylesheet" href="style.css"/>
            <link rel="stylesheet" href="resources/css/bootstrap.min.css"/>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
            <script src="resources/js/bootstrap.min.js"></script>
            <Commits ruleId={this.props.ruleId} token={this.props.token}/>
        </Popout>
        this.setState({popup});
    }
}