import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import {Login} from "./Login";
import {MainScreen} from "./MainScreen";
import {BusinessUsers} from "./tables/BusinessUsers";
import {Servers} from "./tables/servers/Servers";
import {Users} from "./tables/users/Users";
import {Trips} from "./tables/Trips";
import {RuleEditor} from "./tables/rules/RuleEditor";
import {Heatmap} from "./Heatmap";

/**
 * Admin: puede hacer lo que quiera con business-users, y puede ejecutar reglas
 */
export class App extends React.Component {
    
    constructor(props){
      super(props);
      this.handleSuccess=this.handleSuccess.bind(this);
  
      this.login=()=><Login onSuccess={this.handleSuccess}/>;
      this.main=()=><MainScreen token={this.state.token} securityLevel={this.state.securityLevel} />
      this.businessUsers=()=><BusinessUsers token={this.state.token} securityLevel={this.state.securityLevel} />
      this.servers=()=><Servers token={this.state.token} username={this.state.username} securityLevel={this.state.securityLevel} />
      this.users=()=><Users token={this.state.token} securityLevel={this.state.securityLevel} />
      this.trips=()=><Trips token={this.state.token} securityLevel={this.state.securityLevel} />
      this.rules=()=><RuleEditor token={this.state.token} securityLevel={this.state.securityLevel} />
      this.heatmap=()=><Heatmap token={this.state.token} securityLevel={this.state.securityLevel}/>

      
      this.state={
        current:this.login,
        showbar:false,
        username:"",
        password:"",
        token:"",
        currentTab: 1,
        securityLevel:0
      }

      this.gotoLogin = this.gotoLogin.bind(this);
      this.gotoHome = this.gotoHome.bind(this);
      this.gotoBusinessUsers = this.gotoBusinessUsers.bind(this);
      this.gotoServers = this.gotoServers.bind(this);
      this.gotoUsers = this.gotoUsers.bind(this);
      this.gotoTrips = this.gotoTrips.bind(this);
      this.gotoRules = this.gotoRules.bind(this);
      this.gotoHeatmap = this.gotoHeatmap.bind(this);
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
    gotoRules(event){
        this.setState({current:this.rules, currentTab: 6});
    }

    gotoHeatmap(event){
      this.setState({current:this.heatmap, currentTab: 7});
    }


    handleSuccess(username,password,token){
      console.log(username)
      console.log(password)
      console.log(token)
      let level =0;
      fetch("/business-users/me",{
            method:"GET",

            headers:{
                "Authorization":"api-key "+token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>{
            console.log("LOS ROLES:")
            console.log(jsn.businessUser.roles)
            if (jsn.businessUser.roles.indexOf('admin') > -1) level = 3;
            else if (jsn.businessUser.roles.indexOf('manager') > -1) level = 2;
            else if (jsn.businessUser.roles.indexOf('user') > -1) level = 1;
            this.setState({securityLevel:level})
        });

      this.setState({
        token,
        username,
        password,
        current: this.main,
        showbar: true
      });
      console.log(this.state)
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
                  <li style={{display: this.state.securityLevel >= 3 ? '' : 'none'}}
                      class={this.state.currentTab == 2 ? 'active' : ''}><a onClick={this.gotoBusinessUsers}>Business Users</a></li>
                  <li style={{display: this.state.securityLevel >= 1 ? '' : 'none'}}
                      class={this.state.currentTab == 3 ? 'active' : ''}><a onClick={this.gotoServers}>Servers</a></li>
                  <li style={{display: this.state.securityLevel >= 1 ? '' : 'none'}}
                      class={this.state.currentTab == 4 ? 'active' : ''}><a onClick={this.gotoUsers}>Users</a></li>
                  <li style={{display: this.state.securityLevel >= 1 ? '' : 'none'}}
                      class={this.state.currentTab == 5 ? 'active' : ''}><a onClick={this.gotoTrips}>Trips</a></li>
                  <li style={{display: this.state.securityLevel >= 1 ? '' : 'none'}}
                      class={this.state.currentTab == 6 ? 'active' : ''}><a onClick={this.gotoRules}>Rules</a></li>
                  <li style={{display: this.state.securityLevel >= 1 ? '' : 'none'}}
                      class={this.state.currentTab == 7 ? 'active' : ''}><a onClick={this.gotoHeatmap}>Heatmap</a></li>
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