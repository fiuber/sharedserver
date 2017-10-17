import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {Row} from "./Row";
import {CreationDialogOpener} from "./CreateDialog";

export class BusinessUsers extends React.Component{
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

    refresh(){
        fetch("/business-users",{
            method:"GET",
            headers:{
                "Authorization":"api-key "+this.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log(json);
            this.rows=json.businessUser.map((x)=>{
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

    onUpdate(username,content){
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
        .then((response)=>{
            console.log(response);
            if(response.status==200){
                this.refresh()
            }else{
                alert("unauthorized!")
            }
        })
    }

    renderRow(row,index){
        let renderOpened=()=>(<span>
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
        let renderClosed=()=>(<span>username:{row.username}</span>);


        let key=row.username+row.password+row.name+row.surname+row.roles.join("");
        let data={
            password:row.password,
            name:row.name,
            surname:row.surname,
            role:row.roles[0]
        }
        return <Row 
            data={data} 
            key={key} 
            onUpdate={(content)=>this.onUpdate(row.username,content)}
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