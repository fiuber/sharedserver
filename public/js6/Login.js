import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";

export class Login extends React.Component {
    constructor(props){
      super(props);
      this.state={
        username:"admin",
        password:"admin",
        redMessage:""
      }
      this.handleInputChange=this.handleInputChange.bind(this);
      this.handleSubmit=this.handleSubmit.bind(this)
      this.onSuccess=props.onSuccess;
    }
    handleSubmit(event){
      console.log("submit");
      event.preventDefault();
  
      let {username,password}=this.state;
      
      fetch("/token",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({username,password})
      })
      .then((response)=>{
        if(response.status==201){
          return response.json()
        }else{
          return Promise.reject(response);
        }
      })
      .then((json)=>{
        console.log(json);
        let token=json.token.token;
        this.onSuccess(username,password,token);
      }).catch((response)=>{
        console.log(response);
        this.setState({redMessage:"Please try again"})
      })
    }
  
    handleInputChange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]:value
      });
    }
    render(){
      return (<div id="centeredbox">
        <h1>Enter password</h1>
        
        <form onSubmit={this.handleSubmit}>
          <label> user:
            <input type="text" name="username" value={this.state.username} onChange={this.handleInputChange} />
          </label>
          <br/>
          <label> password:
            <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} />
          </label>
          <br/>
          <button onClick={this.handleSubmit}>
            submit
          </button>
        </form>
  
        {this.state.redMessage}
        
  
      </div>);
    }
  }