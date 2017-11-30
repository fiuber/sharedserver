
import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Toggle from 'react-bootstrap-toggle';
import {DialogField} from "./DialogField"


//<Dialog content={un_json} onSubmit={submit} />

export class Dialog extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        
        
        this.typeSlide = this.typeSlide.bind(this);
        this.renderContent = this.renderContent.bind(this);

        this.exteriorOnSubmit = props.onSubmit;
        this.state ={
            content:props.content,
            fine:{}
        } 
        this.onGoodUpdate=this.onGoodUpdate.bind(this);
        this.correction=this.correction.bind(this);

        this.rendered=this.renderContent()
    }

    onGoodUpdate(name,value){
        let o=this.state.fine;
        o[name]=(this.correction(name,value)==null);
        let c=this.state.content
        c[name]=value
        this.setState({
            content:c,
            fine:o
        })
        
    }

    renderContent() {
        console.log("EL CONTENT QUE RENDERIZO")
        console.log(this.state)
        

        //console.log(o);
        let keys = Object.keys(this.props.content);
        let parts = keys.map((key) => {
            return <DialogField 
                name={key}
                default={this.props.content[key]}
                key={key}
                onGoodUpdate={this.onGoodUpdate}
                correction={this.correction}
            />
        })
        //console.log(parts);
        return parts;
    }

    correction(fieldName,currentValue) {
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

    

    typeSlide(event) {
        //TODO: set content on 'passenger' or 'driver'
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
        let allFine=Object.keys(this.state.fine).every((x)=>this.state.fine[x]);

        let buttonClass="btn btn-primary "+(allFine?"":"disabled");

        return <div class="dialogContainer" id="formNew" onSubmit={this.onSubmit}>
            <div class="form-horizontal" style={{
                margin: "30px"
            }}>
                {this.rendered}
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10" style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        {this.props.onReturn ?
                            <button style={{ align: "left" }} class="btn btn-default" onClick={this.props.onReturn}>Return</button> :
                            ""}


                        <button style={{ align: "right" }} class={buttonClass} onClick={allFine?this.onSubmit:()=>{}}>Submit</button>
                    </div>
                </div>
            </div>

        </div>
    }
}