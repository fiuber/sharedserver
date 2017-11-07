import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import {Login} from "./Login";
import {MainScreen} from "./MainScreen";
import {BusinessUsers} from "./BusinessUsers";
import {Servers} from "./Servers";
import {Users} from "./Users";
import {Trips} from "./Trips";


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
      this.servers=()=><Servers token={this.state.token} />
      this.users=()=><Users token={this.state.token} />
      this.trips=()=><Trips token={this.state.token} />

      
      this.state={
        current:this.login,
        showbar:false,
        username:"",
        password:"",
        token:"",
        currentTab: 1
      }

      this.gotoLogin = this.gotoLogin.bind(this);
      this.gotoHome = this.gotoHome.bind(this);
      this.gotoBusinessUsers = this.gotoBusinessUsers.bind(this);
      this.gotoServers = this.gotoServers.bind(this);
      this.gotoUsers = this.gotoUsers.bind(this);
      this.gotoTrips = this.gotoTrips.bind(this);
    }
    gotoLogin(event){
      this.setState({
        current:this.login,
        showbar:false,
        username:"",
        password:"",
        token:"",
        currentTab: 1});
    }

    gotoHome(event){
      this.setState({current:this.main, currentTab: 1});
    }

    gotoBusinessUsers(event){
        this.setState({current:this.businessUsers, currentTab: 2});
    }
    gotoServers(event){
        this.setState({current:this.servers, currentTab: 3});
    }
    gotoUsers(event){
        this.setState({current:this.users, currentTab: 4});
    }
    gotoTrips(event){
        this.setState({current:this.trips, currentTab: 5});
    }


    handleSuccess(username,password,token){
      console.log(username)
      console.log(password)
      console.log(token)
      this.setState({
        token,
        username,
        password,
        current: this.main,
        showbar: true
      });
    }
    render(){
      return(
        <div class="container" align="center">

          <nav style={{display: this.state.showbar ? '' : 'none' }} class="navbar navbar-inverse">
            <div class="container-fluid">
              <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>                        
                </button>
                <div>
                  <img id="logo" align="left" src="resources/logo.png"/>
                  <a class="navbar-brand" href="#">FIUBER</a>
                </div>

              </div>
              <div class="collapse navbar-collapse" id="myNavbar">
                <ul class="nav navbar-nav">
                  <li class={this.state.currentTab == 1 ? 'active' : ''}><a onClick={this.gotoHome}>Home</a></li>
                  <li class={this.state.currentTab == 2 ? 'active' : ''}><a onClick={this.gotoBusinessUsers}>Business Users</a></li>
                  <li class={this.state.currentTab == 3 ? 'active' : ''}><a onClick={this.gotoServers}>Servers</a></li>
                  <li class={this.state.currentTab == 4 ? 'active' : ''}><a onClick={this.gotoUsers}>Users</a></li>
                  <li class={this.state.currentTab == 5 ? 'active' : ''}><a onClick={this.gotoTrips}>Trips</a></li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                  <li><a onClick={this.gotoLogin}><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>
                </ul>
              </div>
            </div>
          </nav>

          <div>
            {this.state.current()}
          </div>

        </div>
          
        
        );
    }
  }