import React from 'react';
import ReactDOM from 'react-dom';

export class PagingDialog extends React.Component{
    constructor(props){
        super(props)
        this.state={
            page:1,
            pages:1,
            leftEnabled:false,
            rightEnabled:false,
        }
        this.updatePageCallback=props.updatePageCallback;
        this.updatePage(1);
    }

    updatePage(value){
        this.updatePageCallback(value).then((pages)=>{
            console.log("==========================")
            console.log(pages)
            console.log("==========================")
            let currentPage=this.state.page;
            let leftEnabled=(currentPage>1);
            let rightEnabled=(currentPage<pages);

            this.setState({
                pages,leftEnabled,rightEnabled
            })
        })   
    }

    handleInputChange(e){
        let total = this.state.pages
        let value = e.target.value;
        if(new Number(value).valueOf()==value 
            && value>0 
            && value <=total 
            || value==""){
            this.setState({
                page:value
            });
            if(new Number(value).valueOf()==value){
                this.updatePage(value);
            }
        }
    }

    handleChangePage(howMuch){
        let currentPage=new Number(this.state.page).valueOf()
        let nextPage=currentPage+howMuch;
        if(nextPage<1){
            nextPage=1
        }
        let total = this.state.pages;
        if(nextPage>total){
            nextPage=total;
        }

        this.setState({
            page:nextPage
        })
        this.updatePage(nextPage);
    }

    render(){
        let arrowStyle={
            display:"inline",
            margin:"5 5 5 5"
        }
        let inputStyle={
            display:"inline",
            margin:"5 5 5 5",
            width:"64px",
            textAlign:"center"
        }

        let leftClass="btn btn-primary "+((this.state.page>1)?"":"disabled");
        let leftArrow=<button class={leftClass} type="button" style={arrowStyle} onClick={this.handleChangePage.bind(this,-1)}>
            <span class="glyphicon glyphicon-triangle-left"></span>
        </button>

        //let rightClass="btn btn-primary "+(this.state.page<this.state.pages)?"active":"disabled";
        let rightClass="btn btn-primary "+((this.state.page<this.state.pages)?"":"disabled");
        let rightArrow=<button class={rightClass} type="button" style={arrowStyle} onClick={this.handleChangePage.bind(this,1)}>
            <span class="glyphicon glyphicon-triangle-right"></span>
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
            Page {leftArrow}{input}{rightArrow} of {this.props.pages}
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