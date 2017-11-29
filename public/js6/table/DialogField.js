import React from 'react';
import ReactDOM from 'react-dom';

export class DialogField extends React.Component {
    constructor(props){
        super(props)

        this.onChecked = this.onChecked.bind(this);
        this.boolSlide = this.boolSlide.bind(this);
        this.onChange=this.onChange.bind(this);
        this.state={
            value:props.default
        }
    }

    render(){
        let name = this.props.name;
        switch (name.toUpperCase()) {
            case "ROLES":
                return <div class="form-group" key={name}>
                    <label class="control-label col-sm-2">{name}:</label>
                    
                    <div class="col-sm-10">
                        <label class="checkbox-inline"><input type="checkbox" name={name} value="admin" onClick={this.onChecked} checked={this.state.value.includes("admin")} />admin</label>
                        <label class="checkbox-inline"><input type="checkbox" name={name} value="manager" onClick={this.onChecked} checked={this.state.value.includes("manager")} />manager</label>
                        <label class="checkbox-inline"><input type="checkbox" name={name} value="user" onClick={this.onChecked} checked={this.state.value.includes("user")} />user</label>
                        <div class="checkbox">
                            {this.textCorrection(name)}
                        </div>
                    </div>
                </div>

                break;
            case "ACTIVE":
                return <span key={name}>Active:<input type="checkbox" onClick={this.boolSlide} name={name} checked={this.state.value} /></span>
                break;
            default:
                return <div class="form-group" key={name}>
                    <label class="control-label col-sm-2">{name}:</label>
                    <div class="col-sm-10">
                        <input
                            style={{ height: name.toUpperCase() == "BLOB" ? '300px' : '' }}
                            class="form-control"
                            placeholder={"Enter " + name}
                            key={name}
                            name={name}
                            value={this.state.value}
                            type={name.toUpperCase().includes("PASSWORD") ? "password" : "text"}
                            onChange={this.onChange}
                        />
                        {this.textCorrection(name)}
                    </div>
                </div>
        }
    }

    textCorrection(fieldName){
        let c=this.props.correction(fieldName,this.state.value);
        if(c==null){
            c=<span className="goodCorrection">OK</span>
        }else{
            c=<span className="badCorrection">{c}</span>
        }
        return c;
    }

    onChecked(event) {
        let value = event.target.value;
        let currentRoles=this.state.value;
        
        if(currentRoles.includes(value)){
            currentRoles=currentRoles.filter((x)=>x!=value)
        }else{
            currentRoles.push(value)
        }

        
        this.props.onGoodUpdate(this.props.name,currentRoles)
        

        this.setState({
            value:currentRoles
        })
    }

    boolSlide(event) {
        this.setState({
            value:event.target.checked
        })
        this.props.onGoodUpdate(this.props.name,event.target.checked)
    }

    onChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        let o={};
        o[name]=value;

        this.props.onGoodUpdate(name,value)

        this.setState({value})
    }

}