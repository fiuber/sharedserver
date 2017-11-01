import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {Row} from "./Row";
import {CreationDialogOpener} from "./CreateDialog";

export class CrudTable extends React.Component{
    constructor(props,strategy){
        super(props);
        this.state={
            renderedRows:[],
            creatorOpen:false
        }
        this.rows=[];
        this.popups=[];
        this.strategy=strategy;
        this.refresh();
    }

    refresh(){
        this.strategy.getAll()
        .then((all)=>{
            console.log(all);
            this.rows=all.map((x)=>{
                x.expanded=false;
                return x;
            })
            this.popups=[];
            for(let row of this.rows){
                this.popups.push(<span></span>);
            }
            this.updateRenderedRows();
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
        let data=this.strategy.defaults(row);
        return <Row 
            data={data} 
            key={key} 
            onUpdate={(content)=>this.onUpdate(row,content)}
            onRemove={()=>this.onDelete(row)}
            renderOpened={renderOpened}
            renderClosed={renderClosed}
        />
    }
    

    render(){
        return <div id="listContainer">
            <CreationDialogOpener 
                content={this.strategy.defaultCreationContent()} 
                onSubmit={(o)=>this.onCreate(o)}
            />
            
            <table>
                <tbody>
                <tr>
                    <th>Content</th>
                    <th>Edit</th>
                    <th>Remove</th>
                </tr>
                {this.state.renderedRows}
                </tbody>
            </table>
        </div>

        
    }
}