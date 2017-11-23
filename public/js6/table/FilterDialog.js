import React from 'react';
import ReactDOM from 'react-dom';

export class FilterDialog extends React.Component{
    constructor(props){
        super(props);
        //this.shape=props.shape;
        let array=props.shape;
        this.updateQueryCallback=props.updateQueryCallback;

        this.state={
            searchWord:"",
            filterName:array[0],
        }

        function change(name){
            this.setState({
                filterName:name
            });
            this.updateQueryCallback(this.state.searchWord,name);
        }

        this.state.renderedFilteringOptions=props.shape.map((f)=>{

            return <li key={f}><a onClick={change.bind(this,f)}>{f}</a></li>
        });
    }


    handleInputChange(e){
        this.setState({
            searchWord:e.target.value
        });
        this.updateQueryCallback(e.target.value,this.state.filterName);
    }

    

    render(){
        let displayInline={
            "display":"inline",
            "marginLeft":"2px",
            "marginRight":"2px"
        }
        let niceWidth={
            width:"180px",
            "display":"inline",
            "marginLeft":"2px",
            "marginRight":"2px"
        }
        let buttonStyle={
            width:"250px",
            align:"left",
            margin:"8px"
        }
        let searchLabel=<label style={displayInline} for="search">Search:</label>
        let searchInput=<input style={niceWidth} type="text" placeholder="search.." class="form-control" id="search" value={this.state.searchWord} onChange={this.handleInputChange.bind(this)}></input>;
        let searchDropdown=<div style={displayInline}  class="dropdown">
            <button style={buttonStyle} class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
                filter by: {this.state.filterName}
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" style={{width:"250px"}}>
                {this.state.renderedFilteringOptions}
            </ul>
        </div> 
        return <div style={{display:"block", overflow: "visible", align:'left'}}>
            {searchLabel}{searchInput}{searchDropdown}
        </div>;
    }


}