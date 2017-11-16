import React from 'react';
import ReactDOM from 'react-dom';

export class PagingDialog extends React.Component{
    constructor(props){
        super(props)
        this.state={
            page:1
        }
        this.updatePageCallback=props.updatePageCallback;
    }

    handleInputChange(e){
        let value=e.target.value;
        if(new Number(value).valueOf()==value && value>0 || value==""){
            this.setState({
                page:value
            });
            if(new Number(value).valueOf()==value){
                this.updatePageCallback(value);
            }
        }
    }

    handleChangePage(howMuch){
        let currentPage=new Number(this.state.page).valueOf()
        let nextPage=currentPage+howMuch;
        if(nextPage<1){
            nextPage=1
        }
        this.setState({
            page:nextPage
        })
        this.updatePageCallback(nextPage);
    }

    render(){
        let arrowStyle={
            display:"inline",
            margin:"5 5 5 5"
        }
        let inputStyle={
            display:"inline",
            margin:"5 5 5 5",
            width:"64px"

        }
        let leftArrow=<button class="btn btn-primary" type="button" style={arrowStyle} onClick={this.handleChangePage.bind(this,-1)}>
            -
            <span class="caret"></span>
        </button>

        let rightArrow=<button class="btn btn-primary" type="button" style={arrowStyle} onClick={this.handleChangePage.bind(this,1)}>
            +
            <span class="caret"></span>
        </button>
        let input=<input 
            style={inputStyle}
            type="text" 
            placeholder="page" 
            class="form-control" 
            id="search" 
            value={this.state.page} 
            onChange={this.handleInputChange.bind(this)}
            >
        </input>;

        return <div style={{display:"block", overflow: "visible", align:'left', margin:"10 10 10 10"}}>
            {leftArrow}{input}{rightArrow}
        </div>;
    }

/*
    handleInputChange(e){
        this.setState({
            searchWord:e.target.value
        });
        this.updateQueryCallback(e.target.value,this.state.filterName);
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
            "marginLeft":"2px",
            "marginRight":"2px"
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
    */




}