import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Script from 'react-load-script';

export class Heatmap extends React.Component {
    constructor(props){
        super(props);
        this.state={
            trips:[],
            waitMap:<span>Waiting for google maps...</span>,
            showing:"start",
            map:{},
            heatmap:null
        }
        
        fetch("/trips",{
            method:"GET",

            headers:{
                "Authorization":"api-key "+props.token,
            },
            cache:"no-store"
        })
        .then((res)=>res.json())
        .then((jsn)=>{
            this.setState({
                trips:jsn.trips
            })

        });
    }

    change(showing){
        if(this.state.heatmap!=null){
            this.state.heatmap.setMap(null);
        }
        
        let heatmap=new google.maps.visualization.HeatmapLayer({
            data:this.getData(showing),
            map:this.state.map
        })
        this.setState({showing,heatmap})
    }

    getData(showing){
        console.log(this.state.trips)
        let starts=this.state.trips.map((trip)=>{
            return trip.start.address.location;
        })
        console.log("A")
        let ends=this.state.trips.map((trip)=>{
            return trip.end.address.location;
        })
        console.log("B")
        let steps=this.state.trips.map((trip)=>{
            return trip.route.map((elem)=>elem.location)
        }).reduce((a1,a2)=>a1.concat(a2),[]);
        console.log("C")

        let sets={
            "start":starts,
            "end":ends,
            "entire trips":starts.concat(ends).concat(steps)
        }
        console.log("D")
        console.log(sets[showing]);

        let result = sets[showing].map((location)=>{
            return new google.maps.LatLng(location.lat,location.lon);
        })
        console.log("E")

        console.log(result);

        return result;
    }

    render(){
        let displayInline={
            "display":"inline",
            margin:"10px 10px 10px 10px 10px",
            padding:"10px 10px 10px 10px 10px"
            
        }
        let buttonStyle={
            width:"100px",
            align:"left"
        }

        return <div>
            <Script
                url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBKzseXuW-zDOZGfrgfGpYhVgGhCcddUUE&libraries=visualization"
                onLoad={this.loaded.bind(this)}
            />
            
            <div style={displayInline}  class="dropdown">
                showing:
                <button style={buttonStyle} class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
                    {this.state.showing}
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    <li><a onClick={this.change.bind(this,"start")}>start</a></li>
                    <li><a onClick={this.change.bind(this,"end")}>end</a></li>
                    <li><a onClick={this.change.bind(this,"entire trips")}>entire trips</a></li>
                </ul>
            </div>
            {this.state.waitMap}
            <div style={{height:"600px"}}id="mapDiv"></div>

            </div>
    }
    loaded(e){
        console.log("333333333333333333333333333333333333")
        console.log(document.getElementById("mapDiv"));
        let map=new google.maps.Map(document.getElementById("mapDiv"),{
            center: {lat: -34.397, lng: 150.644},
            zoom: 1  
        })
        this.setState({
            waitMap:<span></span>,
            map:map
        },this.change.bind(this,this.state.showing))
    }
}