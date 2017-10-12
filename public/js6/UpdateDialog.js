import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";

export class UpdateDialog extends React.Component {
    constructor(props){
        super(props);
        let data=props.data;
        this.token=props.token;
        //this.state.username=props.username;
        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.onSuccess=props.onSuccess;
        this.state={
            username:props.username,
            password:data.password,
            name:data.name,
            surname:data.surname,
            role:data.roles[0]
        }
    }
    onChange(event){
        let name=event.target.name;
        let value=event.target.value;
        this.setState({
            [name]:value
        })
    }
    onSubmit(){
        fetch("/business-users/"+this.state.username,{
            method:"PUT",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.token
            },
            body:JSON.stringify({
                username:this.state.username,
                password:this.state.password,
                name:this.state.name,
                surname:this.state.surname,
                roles:[this.state.role]
            })
          })
          .then((response)=>{
              console.log(response);
            if(response.status==200){
                this.onSuccess();
            }else{
                alert("unauthorized!")
            }
          })
    }
    render(){
        return <div  onSubmit={this.onSubmit}>
            <h1>Updating user {this.state.username}</h1>
            <input name="password"  type="text" value={this.state.password} onChange={this.onChange}/>
            <input name="name"      type="text" value={this.state.name} onChange={this.onChange}/>
            <input name="surname"   type="text" value={this.state.surname} onChange={this.onChange}/>
            <input name="role"      type="text" value={this.state.role} onChange={this.onChange}/>
            <button onClick={this.onSubmit}>submit</button>
        </div>
    }
}