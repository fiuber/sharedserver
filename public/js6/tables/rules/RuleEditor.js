import React from 'react';
import ReactDOM from 'react-dom';
import {Rules} from "./Rules"

export class RuleEditor extends React.Component {
    constructor(props){
        super(props);
    }
    onClick(event){
        console.log("run!")
    }
    render(){
        return <div style={{width:"100%",display:"flex",flexDirection:"row"}}>
            <div style={{display:"flex",flexBasis:"30%"}}>
                <Rules 
                    token={this.props.token} 
                    securityLevel={this.props.securityLevel} 
                    selectionCallback={this.selectionCallback.bind(this)}
                    />
            </div>
            <div style={{
                display:"flex",
                flexBasis:"60%",
                alignItems:"center",
                flexDirection:"column", 
                margin:"10px"
            }}>
                <h3>Fact to be sent</h3>
                <div id="sent" style={{height:"300px",margin:"10px",width:"100%"}}>
                    asdddd
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
                <button class="btn btn-primary" onClick={this.onClick.bind(this)}>Run selected rules</button>

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
        </div>
    }
    componentDidMount(){
        var sent = ace.edit("sent");
        sent.setTheme("ace/theme/clouds");
        sent.getSession().setMode("ace/mode/json");

        var received = ace.edit("received");
        received.setTheme("ace/theme/clouds");
        received.getSession().setMode("ace/mode/json");
        received.setReadOnly(true);

        var thisReference = ace.edit("thisReference");
        thisReference.setTheme("ace/theme/clouds");
        thisReference.getSession().setMode("ace/mode/json");
        thisReference.setReadOnly(true);

        var ruleReference = ace.edit("ruleReference");
        ruleReference.setTheme("ace/theme/clouds");
        ruleReference.getSession().setMode("ace/mode/json");
        ruleReference.setReadOnly(true);

        

    }

    selectionCallback(selectedRules){
        console.log(selectedRules);
    }
}