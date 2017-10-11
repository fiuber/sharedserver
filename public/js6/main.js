import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";

class App extends React.Component {
  
  constructor(props){
    super(props);
    this.handleSuccess=this.handleSuccess.bind(this);

    this.login=()=><Login onSuccess={this.handleSuccess}/>;
    this.main=()=>{
      console.log(this.state);
      return <h1>Ud es: {this.state.username}, su contraseña es {this.state.password}, y su token es {this.state.token}</h1>
    };
    
    this.state={
      current:this.login,
      username:"",
      password:"",
      token:""
    }
    
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
    return this.state.current();
  }
}

class Login extends React.Component {
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
      alert(json);
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
    return (<div id="loginbox">
      Enter password
      
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

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
/*
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}



class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}

*/