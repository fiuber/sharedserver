import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import {Login} from "./Login";
import {MainScreen} from "./MainScreen";
import {BusinessUsers} from "./BusinessUsers";


export class App extends React.Component {
    
    constructor(props){
      super(props);
      this.handleSuccess=this.handleSuccess.bind(this);
  
      this.login=()=><Login onSuccess={this.handleSuccess}/>;
      this.main=()=><MainScreen
        onBusinessUsers={this.gotoBusinessUsers.bind(this)}
        onServers={this.gotoServers.bind(this)}
        onUsers={this.gotoUsers.bind(this)}
        token={this.state.token}
      />
      this.businessUsers=()=><BusinessUsers token={this.state.token}/>
      this.servers=()=><h1>servers</h1>
      this.users=()=><h1>users</h1>

      
      this.state={
        current:this.login,
        username:"",
        password:"",
        token:""
      }
    }
    gotoBusinessUsers(event){
        this.setState({current:this.businessUsers})
    }
    gotoServers(event){
        this.setState({current:this.servers})
    }
    gotoUsers(event){
        this.setState({current:this.users})
    }


    handleSuccess(username,password,token){
      console.log(username)
      console.log(password)
      console.log(token)
      this.setState({
        token,
        username,
        password,
        current:this.main
      });
    }
    render(){
      return <span>
          Token:{this.state.token}
          {this.state.current()}
        </span>
    }
  }