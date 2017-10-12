import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout';
import {Row} from "./Row";

export class BusinessUsers extends React.Component{
    constructor(props){
        super(props);
        this.token=props.token;
        this.state={
            renderedRows:[]
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
        console.log("REFRESCANDOOOO555555");
        this.setState({renderedRows:this.rows.map(this.renderRow,this)});
        this.forceUpdate();
    }

    renderRow(row,index){
        console.log("Este es mi row");
        console.log(row);
        let key=row.username+row.password+row.name+row.surname+row.roles.join("");
        return <Row data={row} key={key} token={this.token} onUpdate={this.refresh.bind(this)}/>
    }
    

    render(){
        return <div id="listContainer">
            <h1> Businessusers list</h1>
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