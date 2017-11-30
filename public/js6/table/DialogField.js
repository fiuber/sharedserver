import React from 'react';
import ReactDOM from 'react-dom';
let thisDoc=JSON.stringify({id: 'string',
applicationOwner: 1,
driver: 
{ id: 1,
    _ref: '229.06346204048654',
    applicationOwner: '1',
    password: '5159',
    type: 'passenger',
    username: 'soyyo5159',
    name: 'José',
    surname: 'Ignacio',
    country: 'Argentina',
    email: 'soyyo5159@hotmail.com',
    birthdate: 'oneday',
    fbUserId: null,
    fbAuthToken: null,
    balance: [],
    cars: [],
    images: [ 'muy serio.png', 'playa.png', 'serio.png' ],
    tripsThisMonth: 0,
    tripsToday: 0,
    antiqueness: 393339611,
    tripsLastHour: 0,
    tripsLast30m: 0,
    tripsLast10m: 0 },
passenger: 
{ id: 2,
    _ref: '427.3095411010006',
    applicationOwner: '1',
    password: null,
    type: 'passenger',
    username: 'fayo5159',
    name: 'Facé',
    surname: 'Igfacio',
    country: 'Argentina',
    email: 'soyyo5159@hotmail.com',
    birthdate: 'oneday',
    fbUserId: 'face',
    fbAuthToken: 'face',
    balance: [],
    cars: [],
    images: [ 'muy serio.png', 'playa.png', 'serio.png' ],
    tripsThisMonth: 0,
    tripsToday: 0,
    antiqueness: 393339684,
    tripsLastHour: 0,
    tripsLast30m: 0,
    tripsLast10m: 0 },
start: 
{ timestamp: 4578999874,
    address: { street: 'las heras', location: [Object] } },
end: 
{ timestamp: 4865454687,
    address: { street: 'zeballos', location: [Object] } },
totalTime: 2400,
waitTime: 300,
travelTime: 2880,
distance: 1200,
route: [],
cost: 1000,
date: '2017-11-04T13:15:39.727Z',
result: true },null,2)

let ruleDoc=JSON.stringify({
    "name": "transaction minimum",
    "priority": 3,
    "on" : true,
    "condition": "function(R) {"+
        "R.when(this.transactionTotal < 500);"+
    "}",
    "consequence": "function(R) {"+
        "this.result = false;"+
        "R.stop();//R.restart()//R.next()"+
    "}"
},null,2)

export class DialogField extends React.Component {
    constructor(props){
        super(props)

        this.onChecked = this.onChecked.bind(this);
        this.boolSlide = this.boolSlide.bind(this);
        this.onChange=this.onChange.bind(this);
        this.state={
            value:props.default
        }
    }

    componentDidMount(){
        if(this.props.name=="blob"){
            let editor = ace.edit("code");
            editor.setTheme("ace/theme/clouds");
            editor.getSession().setMode("ace/mode/json");

            let sendValue=()=>{
                let value = editor.getValue()
                this.props.onGoodUpdate(this.props.name,value)
                this.setState({
                    value
                })
            }
            let sendNothing=()=>{
                let value = ""
                this.props.onGoodUpdate(this.props.name,value)
                this.setState({
                    value
                })
            }

            let error=false;
            editor.getSession().on("changeAnnotation",()=>{
                let annotations=editor.getSession().getAnnotations();
                error=(annotations.length>0)
                if(!error){
                    sendValue();
                }else{
                    sendNothing();
                }
            })
            editor.getSession().on("change",(e)=>{
                if(!error){
                    sendValue();
                }else{
                    sendNothing();
                }
            })
            let thisReference = ace.edit("thisReference");
            thisReference.setTheme("ace/theme/clouds");
            thisReference.getSession().setMode("ace/mode/json");
            thisReference.setReadOnly(true);
    
            let ruleReference = ace.edit("ruleReference");
            ruleReference.setTheme("ace/theme/clouds");
            ruleReference.getSession().setMode("ace/mode/json");
            ruleReference.setReadOnly(true);
        }
        
    }

    render(){
        let name = this.props.name;
        switch (name.toUpperCase()) {
            case "ROLES":
                return <div class="form-group" key={name}>
                    <label class="control-label col-sm-2">{name}:</label>
                    
                    <div class="col-sm-10">
                        <label class="checkbox-inline"><input type="checkbox" name={name} value="admin" onClick={this.onChecked} checked={this.state.value.includes("admin")} />admin</label>
                        <label class="checkbox-inline"><input type="checkbox" name={name} value="manager" onClick={this.onChecked} checked={this.state.value.includes("manager")} />manager</label>
                        <label class="checkbox-inline"><input type="checkbox" name={name} value="user" onClick={this.onChecked} checked={this.state.value.includes("user")} />user</label>
                        <div class="checkbox">
                            {this.textCorrection(name)}
                        </div>
                    </div>
                </div>

                break;
            case "ACTIVE":
                return <div key={name}>Active:<input type="checkbox" onClick={this.boolSlide} name={name} checked={this.state.value} /></div>
                break;
            case "BLOB":
                 
                return <div style={{
                        display:"flex",
                        flexDirection:"row",
                        justifyContent:"space-evenly"
                    }}>
                        <div style={{
                            display:"flex",
                            flexDirection:"column",
                            width:"45%"
                        }}>
                            <div id="code" style={{height:"300px",margin:"10px"}}>
                                {this.props.default}
                            </div>
                            <div>{this.textCorrection(name)}</div>
                        </div>
                        
                        <div id="help" style={{margin:"10px",width:"45%"}}>
                            <div class="panel panel-default" style={{width:"100%"}}>
                                <div class="panel-heading">
                                    <h4 class="panel-title">
                                        <a data-toggle="collapse" href="#collapse1">Rule reference</a>
                                    </h4>
                                </div>
                                <div id="collapse1" class="panel-collapse collapse">
                                    <div class="panel-body">
                                        <div id="ruleReference" style={{
                                            width:"100%",
                                            height:"180px"
                                        }}>
                                        {ruleDoc}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h4 class="panel-title">
                                        <a data-toggle="collapse" href="#collapse2">"this" object reference</a>
                                    </h4>
                                </div>
                                <div id="collapse2" class="panel-collapse collapse">
                                    <div class="panel-body">
                                        <div id="thisReference" style={{
                                            width:"100%",
                                            height:"400px"
                                        }}>
                                        {thisDoc}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                
            default:
                return <div class="form-group" key={name}>
                    <label class="control-label col-sm-2">{name}:</label>
                    <div class="col-sm-10">
                        <input
                            style={{ height: name.toUpperCase() == "BLOB" ? '300px' : '' }}
                            class="form-control"
                            placeholder={"Enter " + name}
                            key={name}
                            name={name}
                            value={this.state.value}
                            type={name.toUpperCase().includes("PASSWORD") ? "password" : "text"}
                            onChange={this.onChange}
                        />
                        {this.textCorrection(name)}
                    </div>
                </div>
        }
    }

    textCorrection(fieldName){
        let c=this.props.correction(fieldName,this.state.value);
        if(c==null){
            c=<span className="goodCorrection">OK</span>
        }else{
            c=<span className="badCorrection">{c}</span>
        }
        return c;
    }

    onChecked(event) {
        let value = event.target.value;
        let currentRoles=this.state.value;
        
        if(currentRoles.includes(value)){
            currentRoles=currentRoles.filter((x)=>x!=value)
        }else{
            currentRoles.push(value)
        }

        
        this.props.onGoodUpdate(this.props.name,currentRoles)
        

        this.setState({
            value:currentRoles
        })
    }

    boolSlide(event) {
        this.setState({
            value:event.target.checked
        })
        this.props.onGoodUpdate(this.props.name,event.target.checked)
    }

    onChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        let o={};
        o[name]=value;

        this.props.onGoodUpdate(name,value)

        this.setState({value})
    }

}