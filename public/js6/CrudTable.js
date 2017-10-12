import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {Row} from "./Row";
import {CreationDialogOpener} from "./CreateDialog";

export class CrudTable extends React.Component{
    constructor(props){
        super(props);
        this.token=props.token;
        this.state={
            renderedRows:[],
            creatorOpen:false
        }
        this.rows=[];
        this.popups=[];

        this.refresh();
    }
    /*
    fetch("/business-users",{
            method:"GET",
            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
    */

    getAll(){
        return [];
    }

    refresh(){
        getAll()
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
    /*
    fetch("/business-users/"+username,{
            method:"PUT",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
            body:JSON.stringify({
                username:username,
                password:content.password,
                name:content.name,
                surname:content.surname,
                roles:[content.role]
            })
        })
        */
        doUpdate(row,content){
        return {};
    }

    onUpdate(row,content){
        doUpdate(row,content)
        .then((response)=>{
            console.log(response);
            if(response.status==200){
                this.refresh()
            }else{
                alert("unauthorized!")
            }
        })
    }

    doDelete(row){
        return {};
    }

    onDelete(row){
        doDelete(row)
        .then((response)=>{
            console.log(response);
            if(response.status==204){
                this.refresh()
            }else{
                alert("unauthorized!")
            }
        })
    }

    /*
    ()=>(<span>
            <br/>
            username:{row.username}
            <br/>
            name:{row.name}
            <br/>
            surname:{row.surname}
            <br/>
            roles:{row.roles.map((x)=>
                <span key={x}>{x}<br/></span>
            )}
        </span>);
        */
    /*
    (<span>username:{row.username}</span>)
    */

    //row.username+row.password+row.name+row.surname+row.roles.join("");

    /*
    {
            password:row.password,
            name:row.name,
            surname:row.surname,
            role:row.roles[0]
        }
        */

    renderOpened(row){
        return <span></span>;
    }

    renderClosed(row){
        return <span></span>;
    }

    createKey(row){
        return "key";
    }

    defaults(row){
        return {};
    }

    

    renderRow(row,index){
        let renderOpened=()=>this.renderOpened(row);
        let renderClosed=()=>this.renderClosed(row);


        let key=this.createKey(row);
        let data=this.defaults(row);
        return <Row 
            data={data} 
            key={key} 
            onUpdate={(content)=>this.onUpdate(row,content)}
            onRemove={()=>console.log("REMOVE")}
            renderOpened={renderOpened}
            renderClosed={renderClosed}
        />
    }
    

    render(){
        return <div id="listContainer">
            <h1> Businessusers list</h1>
            <CreationDialogOpener token={this.token} />
            
            <table>
                <tbody>
                <tr>
                    <th>content</th>
                    <th>edit</th>
                    <th>remove</th>
                </tr>
                {this.state.renderedRows}
                </tbody>
            </table>
        </div>

        
    }
}