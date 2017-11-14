import React from 'react';
import ReactDOM from 'react-dom';

export class FilterDialog extends React.Component{
    constructor(props){
        super(props);
        //this.shape=props.shape;
        this.state={
            rendered:this.renderInputShape(props.shape),
            searchWord:"search"
        }
    }

    renderInputShape(shape){
        return <span>{JSON.stringify(shape)}</span>;
    }

    handleInputChange(e){
        console.log(e);
    }

    

    render(){
        let displayInline={
            "display":"inline",
            "margin-left":"2px",
            "margin-right":"2px"
        }
        let niceWidth={
            width:"40%",
            "display":"inline",
            "margin-left":"2px",
            "margin-right":"2px"
        }
        let searchLabel=<label style={displayInline} for="search">Search:</label>
        let searchInput=<input style={niceWidth} type="text" class="form-control" id="search" value={this.state.searchWord} onChange={this.handleInputChange.bind(this)}></input>;
        let searchDropdown=<div style={displayInline}  class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li><a onClick={()=>alert("html")}>HTML</a></li>
                <li><a>CSS</a></li>
                <li><a>JavaScript</a></li>
            </ul>
        </div> 
        return <div style={{display:"block", overflow: "visible", align:'left'}}>
            {searchLabel}{searchInput}{searchDropdown}
        </div>;
    }


}