
import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Toggle from 'react-bootstrap-toggle';


//<Dialog content={un_json} onSubmit={submit} />

export class Dialog extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChecked = this.onChecked.bind(this);
        this.boolSlide = this.boolSlide.bind(this);
        this.typeSlide = this.typeSlide.bind(this);
        this.renderContent = this.renderContent.bind(this);

        this.exteriorOnSubmit = props.onSubmit;

        let content = props.content;
        let roles = new Set();
        this.state = {
            roles,
            content,
            //renderedParts:this.renderContent(content),
            toggleActive: false,
            allFine:false
        }
        this.state.renderedParts = this.renderContent(content);
    }
    renderContent(o) {
        this.setState({
            allFine:Object.keys(o).every((key)=>this.correction(key)==null)
        });

        //console.log(o);
        let keys = Object.keys(o);
        let parts = keys.map((key) => {
            switch (key.toUpperCase()) {
                case "ROLE":
                    return <div class="form-group" key={key}>
                        <label class="control-label col-sm-2">{key}:</label>
                        
                        <div class="col-sm-10">
                            <label class="checkbox-inline"><input type="checkbox" name={key} value="admin" onClick={this.onChecked} checked={this.state.roles.has("admin")} />admin</label>
                            <label class="checkbox-inline"><input type="checkbox" name={key} value="manager" onClick={this.onChecked} checked={this.state.roles.has("manager")} />manager</label>
                            <label class="checkbox-inline"><input type="checkbox" name={key} value="user" onClick={this.onChecked} checked={this.state.roles.has("user")} />user</label>
                            <div class="checkbox">
                                {this.textCorrection(key)}
                            </div>
                        </div>
                            
                        
                        
                        
                    </div>
                    //{this.state.roles.length == 0 ? "You must assign at least one role" : ""}

                    break;
                case "ACTIVE":
                    return <span key={key}>Active:<input type="checkbox" onClick={this.boolSlide} name={key} checked={this.state.toggleActive} /></span>
                    //return <div><Toggle onClick={this.boolSlide} name={key} on="Active" off="Inactive" onstyle="success" offstyle="danger" active={this.state.toggleActive}/></div>
                    break;
                default:
                    return <div class="form-group" key={key}>
                        <label class="control-label col-sm-2">{key}:</label>
                        <div class="col-sm-10">
                            <input
                                style={{ height: key.toUpperCase() == "BLOB" ? '300px' : '' }}
                                class="form-control"
                                placeholder={"Enter " + key}
                                key={key}
                                name={key}
                                type={key.toUpperCase().includes("PASSWORD") ? "password" : "text"}
                                onChange={this.onChange}
                            />
                            {this.textCorrection(key)}
                        </div>
                    </div>
            }
        })
        //console.log(parts);
        return parts;
    }

    correction(fieldName) {
        let currentValue = this.state.content[fieldName];
        console.log("Me preguntan la correction de", fieldName, currentValue)
        console.log(this.state);
        if (!currentValue || currentValue == "" || currentValue.length==0) {
            if(fieldName.toLowerCase().includes("role")){
                return "Choose at least one role"
            }
            return "This field is compulsory";
        } else {
            return null;
        }
    }

    textCorrection(fieldName){
        let c=this.correction(fieldName);
        if(c==null){
            c=<span className="goodCorrection">OK</span>
        }else{
            c=<span className="badCorrection">{c}</span>
        }
        return c;
    }

    onChecked(event) {
        let name = event.target.name;
        let value = event.target.value;

        if (this.state.roles.has(event.target.value)) {
            this.state.roles.delete(event.target.value);
        } else {
            this.state.roles.add(event.target.value);
        }
        let roles = this.state.roles;
        let copy = JSON.parse(JSON.stringify(this.state.content));
        copy[name] = Array.from(roles);

        this.setState({
            roles: roles,
            content: copy,
        }, () => {
            this.setState({
                renderedParts: this.renderContent(this.state.content)
            })
        })
    }

    boolSlide(event) {

        let state = !this.state.toggleActive;
        this.setState({
            toggleActive: event.target.checked,//event solo, con el slider reeee lindo
        }, () => {
            this.setState({
                renderedParts: this.renderContent(this.state.content)
            })
        })
    }

    typeSlide(event) {
        //TODO: set content on 'passenger' or 'driver'
    }

    onChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        let copy = JSON.parse(JSON.stringify(this.state.content))
        copy[name] = value;

        this.setState({
            content: copy,
        }, () => {
            this.setState({
                renderedParts: this.renderContent(this.state.content)
            })
        })
    }

    onSubmit() {
        if (this.exteriorOnSubmit) {
            this.exteriorOnSubmit(this.state.content);
        }

    }

    /*componentDidMount() {

      $( this.refs.toggleInput.getDOMNode() ).bootstrapToggle();

    }*/
    render() {
        let buttonClass="btn btn-primary "+((this.state.allFine)?"":"disabled");
        return <div class="dialogContainer" id="formNew" onSubmit={this.onSubmit}>
            <div class="form-horizontal" style={{
                margin: "30px"
            }}>
                {this.state.renderedParts}
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10" style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        {this.props.onReturn ?
                            <button style={{ align: "left" }} class="btn btn-default" onClick={this.props.onReturn}>Return</button> :
                            ""}


                        <button style={{ align: "right" }} class={buttonClass} onClick={this.onSubmit}>Submit</button>
                    </div>
                </div>
            </div>
            <script>
                $('#ACTIVE').bootstrapToggle();
                $('#TYPE').bootstrapToggle();
            </script>

        </div>
    }
}