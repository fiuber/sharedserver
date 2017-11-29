import React from 'react';
import ReactDOM from 'react-dom';
import {Commits} from "./Commits";

export class ViewCommitsButton extends React.Component{
    constructor(props){
        super(props);
        this.token=props.token;
        this.ruleId=props.ruleId;
    }
    render(){
        return <button 
            class="btn btn-primary" 
            onClick={this.onClick.bind(this)}> 
        View commits
        </button>
    }
    onClick(event){
        this.props.goto(()=><span>
            <link rel="stylesheet" href="style.css"/>
            <link rel="stylesheet" href="resources/css/bootstrap.min.css"/>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
            <script src="resources/js/bootstrap.min.js"></script>
            <Commits 
                ruleId={this.props.ruleId} 
                token={this.props.token}
                goto={this.props.goto}
                gotoPrevious={this.props.gotoPrevious}
            />
        </span>);
    }
}