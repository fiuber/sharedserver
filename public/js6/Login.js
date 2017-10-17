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
      return (<div class="container" align="center" id="centeredbox">
        
        <form class="form-horizontal" onSubmit={this.handleSubmit}>

          <div class="form-group">
            <h1 align="center">Login</h1>
          </div>

          <div class="form-group">
            <label class="control-label col-sm-2"> User:</label>
            <div class="col-sm-8">
              <div class="input-group">
                <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                <input type="text" class="form-control"  name="username" value={this.state.username} onChange={this.handleInputChange} />
                </div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label col-sm-2"> Password:</label>
            <div class="col-sm-8">
              <div class="input-group">
                <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                <input type="password" class="form-control" name="password" value={this.state.password} onChange={this.handleInputChange} />
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <div class="col-sm-offset-9 col-sm-1">
              <div align="right">
                <button  class="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
              </div>
            </div>
            <div class="col-sm-2">
              <div align="left">
                  <p id="tryagain">{this.state.redMessage}</p>
              </div>
            </div>
          </div> 
        </form>
        
        
  
      </div>);
    }
  }