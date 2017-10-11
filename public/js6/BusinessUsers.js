import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Popout from 'react-popout'

export class BusinessUsers extends React.Component{
    constructor(props){
        super(props);
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

    update(index){
        console.log("update")
        
        function removePopup(){
            this.popups[index]=<span></span>;
            this.updateRenderedRows();
        }

        this.popups[index]=(
        <Popout  title='Window title' onClosing={removePopup.bind(this)}>
            <div>Popped out content!</div>
        </Popout>
        );
        this.updateRenderedRows();
    }
    remove(index){
        console.log("removing!!")
    }
    renderRow(row,index){
        let renderedRowData=this.renderRowData(row,index);
        let update = this.update.bind(this,index);
        let remove = this.remove.bind(this,index);
        return <tr key={index}>
            <td>{renderedRowData}</td>  
            <td><a onClick={update}>{this.popups[index]}update</a></td>
            <td><a onClick={remove}>remove</a></td>
        </tr>
        
        
    }

    renderRowData(row,i){
        let expand=(e)=>{
            this.rows[i].expanded=e;
            this.updateRenderedRows();
        }
        if(row.expanded){
            //console.log("THE ROW IS EXPANDED");
            //console.log(row);
            return <a onClick={expand.bind(this,false)}>
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
            </a>
        }else{
            return <a onClick={expand.bind(this,true)}> username:{row.username}</a>
        }
        
    }
    render(){
        return <div id="listContainer">
            <h1> Soy la lista de BusinessUsers</h1>
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