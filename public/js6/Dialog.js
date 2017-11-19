
import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Toggle from 'react-bootstrap-toggle';

//<Dialog content={un_json} onSubmit={submit} />

export class Dialog extends React.Component {
    constructor(props){
        super(props);

        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.onChecked=this.onChecked.bind(this);
        this.boolSlide=this.boolSlide.bind(this);
        this.typeSlide=this.typeSlide.bind(this);
        this.renderContent=this.renderContent.bind(this);

        this.exteriorOnSubmit=props.onSubmit;
        let content=props.content;
        let roles = new Set();
        this.state={
            roles,
            content,
            renderedParts:this.renderContent(content),
            toggleActive:false
        }
    }
    renderContent(o){
        debugger
        console.log(o);
        let keys=Object.keys(o);
        let parts= keys.map((key)=>{
            switch (key.toUpperCase()){
                case "ROLE":
                    return <div class="form-group">
                            <label class="control-label col-sm-2">{key}:</label>
                            <div class="col-sm-10">
                                <label class="checkbox-inline"><input type="checkbox" name={key} value="admin" onClick={this.onChecked}/>Admin</label>
                                <label class="checkbox-inline"><input type="checkbox" name={key} value="manager" onClick={this.onChecked}/>Manager</label>
                                <label class="checkbox-inline"><input type="checkbox" name={key} value="user" onClick={this.onChecked}/>User</label>
                            </div>
                        </div>
                    break;
                case "ACTIVE":
                    return <Toggle onClick={this.boolSlide} name={key} on="Active" off="Inactive" onstyle="success" offstyle="danger" active={this.state ? this.state.toggleActive : false}/>
                    break;
                //case "TYPE":
                //    return <input onChange={this.typeSlide} id={key.toUpperCase()} type="checkbox" name={key} checked data-toggle="toggle" data-on="Passenger" data-off="Driver" data-onstyle="primary" data-offstyle="success" data-style="ios"/>
                //    break;
                default:
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

    boolSlide(event){
        let state = !this.state.toggleActive;
        let copy=JSON.parse(JSON.stringify(this.state.content));
        copy['active'] = state;
        debugger
        this.setState({
            toggleActive: state,
            content: copy,
            renderedParts: this.renderContent(copy)
        })
    }

    typeSlide(event){
        //TODO: set content on 'passenger' or 'driver'
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

    /*componentDidMount() {

      $( this.refs.toggleInput.getDOMNode() ).bootstrapToggle();

    }*/
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
            <script>
                $('#ACTIVE').bootstrapToggle();
                $('#TYPE').bootstrapToggle();
            </script>
        </div>
    }
}