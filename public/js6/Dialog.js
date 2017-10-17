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
            return <input 
                key={key} 
                name={key} 
                type="text" 
                value={o[key]} 
                onChange={this.onChange} 
            />

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
        return <div  onSubmit={this.onSubmit}>
            {this.state.renderedParts}
            <button onClick={this.onSubmit}>submit</button>
        </div>
    }
}