import React from 'react';
import ReactDOM from 'react-dom';
import {Rules} from "./Rules"

export class RuleEditor extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return <div style={{width:"100%",display:"flex",flexDirection:"row"}}>
            <div style={{display:"flex",flexBasis:"30%"}}>
                <Rules 
                    token={this.props.token} 
                    securityLevel={this.props.securityLevel} 
                    selectionCallback={this.selectionCallback.bind(this)}
                    />
            </div>
            <div style={{display:"flex",flexBasis:"60%"}}>
                holi
            </div>
        </div>
    }

    selectionCallback(selectedRules){
        console.log(selectedRules);
    }
}