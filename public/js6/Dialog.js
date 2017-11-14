
import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";

//<Dialog content={un_json} onSubmit={submit} />

export class Dialog extends React.Component {
    constructor(props){
        super(props);

        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.onChecked=this.onChecked.bind(this);

        this.exteriorOnSubmit=props.onSubmit;
        let content=props.content;
        let roles = new Set();
        this.state={
            roles,
            content,
            renderedParts:this.renderContent(content)
        }
    }
    renderContent(o){
        console.log(o);
        let keys=Object.keys(o);
        let parts= keys.map((key)=>{
            if (key.toUpperCase() != "ROLE") {
                return <div class="form-group">
                            <label class="control-label col-sm-2">{key}:</label>        
                            <div class="col-sm-10">
                                <input
                                    style={{height: key.toUpperCase() == "BLOB" ? '300px' : ''}}
                                    class="form-control"
                                    placeholder={"Enter " + key}
                                    key={key} 
                                    name={key} 
                                    type={key.toUpperCase() == "PASSWORD" ? key : "text"}
                                    onChange={this.onChange} 
                                />
                            </div>
                        </div>
            }
            else
            {
                return <div class="form-group">
                            <label class="control-label col-sm-2">{key}:</label>
                            <div class="col-sm-10">
                                <label class="checkbox-inline"><input type="checkbox" name={key} value="admin" onClick={this.onChecked}/>Admin</label>
                                <label class="checkbox-inline"><input type="checkbox" name={key} value="manager" onClick={this.onChecked}/>Manager</label>
                                <label class="checkbox-inline"><input type="checkbox" name={key} value="user" onClick={this.onChecked}/>User</label>
                            </div>
                        </div>
            }
        })
        console.log(parts);
        return parts;
    }

    onChecked(event){
        let name=event.target.name;
        let value=event.target.value;

        if (this.state.roles.has(event.target.value)) {
            this.state.roles.delete(event.target.value);
        } else {
            this.state.roles.add(event.target.value);
        }
        let roles = this.state.roles;
        let copy=JSON.parse(JSON.stringify(this.state.content));
        copy[name]=Array.from(roles);

        this.setState({
            roles: roles,
            content:copy,
            renderedParts:this.renderContent(copy)
        })
    }

    onChange(event){
        let name=event.target.name;
        let value=event.target.value;

        let copy=JSON.parse(JSON.stringify(this.state.content))
        copy[name]=value;

        this.setState({
            content:copy,
            renderedParts:this.renderContent(copy)
        })
    }

    onSubmit(){
       this.exteriorOnSubmit(this.state.content);
    }
    render(){
        return <div  class="container" id="formNew" onSubmit={this.onSubmit}>
            <form class="form-horizontal">
                {this.state.renderedParts}
                <div class="form-group">        
                    <div class="col-sm-offset-2 col-sm-10">
                        <button class="btn btn-default" onClick={this.onSubmit}>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    }
}