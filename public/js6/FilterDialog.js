import React from 'react';
import ReactDOM from 'react-dom';

export class FilterDialog extends React.Component{
    constructor(props){
        super(props);
        //this.shape=props.shape;
        let array=props.shape;

        this.state={
            searchWord:"",
            filterName:"any",
            
        }

        function change(name){
            this.setState({
                filterName:name
            });
        }

        this.state.renderedFilteringOptions=props.shape.concat(["any"]).map((f)=>{

            return <li key={f}><a onClick={change.bind(this,f)}>{f}</a></li>
        });
        /*
        renderedFilteringOptions:<li><a onClick={()=>alert("html")}>HTML</a></li>
            <li><a>CSS</a></li>
            <li><a>JavaScript</a></li>
            */
    }


    handleInputChange(e){
        this.setState({
            searchWord:e.target.value
        });
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
        let buttonStyle={
            width:"20%",
            align:"left"
        }
        let searchLabel=<label style={displayInline} for="search">Search:</label>
        let searchInput=<input style={niceWidth} type="text" placeholder="search.." class="form-control" id="search" value={this.state.searchWord} onChange={this.handleInputChange.bind(this)}></input>;
        let searchDropdown=<div style={displayInline}  class="dropdown">
            <button style={buttonStyle} class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
                filter by: {this.state.filterName}
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                {this.state.renderedFilteringOptions}
            </ul>
        </div> 
        return <div style={{display:"block", overflow: "visible", align:'left'}}>
            {searchLabel}{searchInput}{searchDropdown}
        </div>;
    }


}