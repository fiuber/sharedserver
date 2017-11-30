import React from 'react';
import ReactDOM from 'react-dom';
import {Rules} from "./Rules"
import "whatwg-fetch";

export class RuleEditor extends React.Component {
    constructor(props){
        super(props);
        this.sentEditor=null;
        this.receivedEditor=null;
        this.state={
            selectedRules:[],
            goodSyntax:false
        }
    }
    onClick(event){
        fetch("/rules/run",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'api-key '+this.props.token
            },
            body:JSON.stringify({
                rules:this.state.selectedRules,
                facts:[
                    {
                        language:"node-rules",
                        blob:this.sentEditor.getValue()
                    }
                ]
            })
        }).then((res)=>res.json())
        .then((jsn)=>{
            console.log("VUELVE",jsn)
            if(jsn.facts && jsn.facts.length>0){
                console.log(jsn.facts[0].blob);
                let text=jsn.facts[0].blob;
                let object = JSON.parse(text)
                let prettyText=JSON.stringify(object,null,2)
                this.receivedEditor.setValue(prettyText)
            }else{
                let prettyText=JSON.stringify(jsn,null,2)
                this.receivedEditor.setValue(prettyText)
            }
        })
    }
    render(){
        console.log("EN RENDER")
        console.log(this.state.selectedRules.length);
        let btnEnabled=(this.state.selectedRules.length>0 && this.state.goodSyntax);
        
        let buttonClass="btn btn-primary "+(btnEnabled?"":"disabled");

        let ruleEditor=<div style={{
            display:"flex",
            flexBasis:(this.props.securityLevel<3)?"0%":"50%",
            alignItems:"center",
            flexDirection:"column", 
            margin:"10px",
            visibility:(this.props.securityLevel<3)?"hidden":"visible"
        }}>
            <h3>Fact to be sent</h3>
            <div id="sent" style={{height:"300px",margin:"10px",width:"100%"}}>
                {"{}"}
            </div>


            <div class="panel panel-default" style={{width:"100%"}}>
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
                            {JSON.stringify({id: 'string',
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
                                result: true },null,2)}
                            </div>
                        </div>
                    </div>
                </div>
            <button class={buttonClass} onClick={btnEnabled?this.onClick.bind(this):()=>{}}>Run selected rules</button>

            <h3>Fact received</h3>
            <div id="received" style={{height:"300px",margin:"10px",width:"100%"}}>
                
            </div>


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
                            {JSON.stringify({
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
                            },null,2)}
                            </div>
                        </div>
                    </div>
                </div>
        </div>

        return <div style={{width:"100%",display:"flex",flexDirection:"row"}}>
            <div style={{display:"flex",flexBasis:(this.props.securityLevel<3)?"100%":"50%"}}>
                <Rules 
                    token={this.props.token} 
                    securityLevel={this.props.securityLevel} 
                    selectionCallback={this.selectionCallback.bind(this)}
                    goto={this.props.goto}
                    gotoPrevious={this.props.gotoPrevious} 
                    />
            </div>
            {(this.props.securityLevel<3)?"":ruleEditor}
        </div>
    }
    componentDidMount(){

        if(this.props.securityLevel==3){
            this.sentEditor = ace.edit("sent");
            this.sentEditor.setTheme("ace/theme/clouds");
            this.sentEditor.getSession().setMode("ace/mode/json");
            this.sentEditor.getSession().on("changeAnnotation",()=>{
                this.setState({
                    goodSyntax:this.sentEditor.getSession().getAnnotations().length==0
                })
            })
    
            this.receivedEditor = ace.edit("received");
            this.receivedEditor.setTheme("ace/theme/clouds");
            this.receivedEditor.getSession().setMode("ace/mode/json");
            this.receivedEditor.setReadOnly(true);
    
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

    selectionCallback(selectedRules){
        console.log("AAAAAAAAAAAAAAAAAAAA")
        console.log(selectedRules);
        this.setState({selectedRules})
        this.forceUpdate();
    }
}