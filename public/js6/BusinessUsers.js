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

        fetch("/business-users",{
            method:"GET",
            headers:{
                "Authorization":"api-key "+props.token
            }
        })
        .then((res)=>res.json())
        .then((json)=>{
            this.rows=json.businessUser.map((x)=>{
                x.expanded=false;
                return x;
            })
            this.popups=[];
            for(let row of this.rows){
                this.popups.push(<span></span>);
            }
            //this.setState({rows,popups});
            this.updateRenderedRows();
        })

    }
    updateRenderedRows(){
        this.setState({renderedRows:this.rows.map(this.renderRow,this)});
        //this.setState({renderedRows:this.rows.map(()=><span>asd</span>,this)});
    }

    renderRow(row,index){
        return <Row data={row} key={index} token={this.token}/>
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