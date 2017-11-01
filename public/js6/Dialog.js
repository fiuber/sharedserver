import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";

//<Dialog content={un_json} onSubmit={submit} />

export class Dialog extends React.Component {
    constructor(props){
        super(props);

        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this);

        this.exteriorOnSubmit=props.onSubmit;
        let content=props.content;
        this.state={
            content,
            renderedParts:this.renderContent(content)
        }
    }
    renderContent(o){
        console.log(o);
        let keys=Object.keys(o).filter((key)=>{
            return typeof o[key] === "string" || typeof o[key] === "number"
        })
        let parts= keys.map((key)=>{
            console.log("asdasdasd")
            console.log(key.toUpperCase())
            return <div class="form-group">
                        <label class="control-label col-sm-2" for="pwd">{key}:</label>        
                        <div class="col-sm-10">
                            <input 
                                key={key} 
                                name={key} 
                                type={key.toUpperCase() == "PASSWORD" ? key : "text"}
                                onChange={this.onChange} 
                            />
                        </div>
                    </div>

        })
        console.log(parts);
        return parts;
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