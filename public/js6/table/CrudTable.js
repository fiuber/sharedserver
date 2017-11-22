import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {Row} from "./Row";
import {CreationDialogOpener} from "./CreateDialog";
import {FilterDialog} from "./FilterDialog";
import {PagingDialog} from "./PagingDialog";

export class CrudTable extends React.Component{
    constructor(props,strategy){
        super(props);
        this.state={
            renderedRows:[],
            creatorOpen:false,
            totalRecords:0,
            page:1
        }
        this.rows=[];
        this.popups=[];
        this.strategy=strategy;
        this.searchWord=""
        this.filterName="any"
        this.page=1;

        this.refresh();
    }

    refresh(){
        let searchQuery="?";
        searchQuery+="_limit=10&_offset="+(this.state.page-1)*10+"&_orderBy="+this.strategy.orderBy();
        console.log("THE SEARCHQUERY IS",searchQuery)
        if(this.searchWord != ""){
            let filter=this.filterName+"_matches=%"+this.searchWord+"%";
            searchQuery+="&"+filter;
        }
        console.log("AND THEN ",searchQuery)

        
        
        
        return this.strategy.getAll(searchQuery)
        .then((all)=>{
            this.rows=all.map((x)=>{
                x.expanded=false;
                return x;
            })
            this.popups=[];
            for(let row of this.rows){
                this.popups.push(<span></span>);
            }
            this.updateRenderedRows();

            this.setState({
                totalRecords:all.totalRecords
            })
            

            return Math.ceil(all.totalRecords/10);
        })
    }

    updateRenderedRows(){
        this.setState({renderedRows:this.rows.map(this.renderRow,this)});
        this.forceUpdate();
    }

    onUpdate(row,content){
        this.strategy.doUpdate(row,content)
        .then((response)=>{
            console.log(response);
            if(response.status==200){
                this.refresh()
            }else{
                alert("unauthorized!")
            }
        })
    }

    onCreate(object){
        this.strategy.doCreate(object)
        .then((response)=>{
            console.log(response);
            if(response.status==201){
                this.refresh()
            }else{
                alert("unauthorized!")
            }
        })
    }


    onDelete(row){
        this.strategy.doDelete(row)
        .then((response)=>{
            console.log(response);
            if(response.status==204){
                this.refresh()
            }else{
                alert("unauthorized!")
            }
        })
    }

    renderRow(row,index){
        let renderOpened=()=>this.strategy.renderOpened(row);
        let renderClosed=()=>this.strategy.renderClosed(row);


        let key=this.strategy.createKey(row);
        let data=this.strategy.defaults?this.strategy.defaults(row):{};

        let onUpdate=null;
        if(this.strategy.doUpdate){
            onUpdate=(content)=>this.onUpdate(row,content);
        }

        let onDelete=null;
        if(this.strategy.doDelete){
            onDelete=()=>this.onDelete(row);
        }


        
        return <Row 
            data={data} 
            key={key} 
            onUpdate={onUpdate}
            onRemove={onDelete}
            renderOpened={renderOpened}
            renderClosed={renderClosed}
        />
    }
    

    updateQuery(searchWord,filterName){
        console.log(searchWord,filterName);
        this.searchWord=searchWord;
        this.filterName=filterName;
        this.changePage(1);
    }

    changePage(page){
        this.setState({page},this.refresh.bind(this));
    }



    
    render(){
        let creationDialogOpener=()=><CreationDialogOpener 
            content={this.strategy.defaultCreationContent()} 
            onSubmit={(o)=>this.onCreate(o)}
        />

        return <div id="mainContainer" style={{display:"block"}}>
            <PagingDialog 
                page={this.state.page}
                updatePageCallback={this.changePage.bind(this)} 
                pages={Math.ceil(this.state.totalRecords/10)}/>
            <FilterDialog shape={this.strategy.getFilters()} updateQueryCallback={this.updateQuery.bind(this)}/>

            <div id="listContainer" style={{display:"block"}}>
                
                {this.strategy.doCreate?creationDialogOpener():""}
                
                <table>
                    <tbody>
                    <tr>
                        <th>Content</th>
                        {this.strategy.doUpdate?<th>Edit</th>:""}
                        {this.strategy.doDelete?<th>Remove</th>:""}
                    </tr>
                    {this.state.renderedRows}
                    </tbody>
                </table>
            </div>
        </div>

        
    }
}