import React from 'react';
import ReactDOM from 'react-dom';
import "whatwg-fetch";
import Script from 'react-load-script';

export class Heatmap extends React.Component {
    constructor(props){
        super(props);
        this.state={
            trips:[],
            waitMap:<span>Waiting for google maps...</span>
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
    render(){
        //return <span> un mapa {this.state.trips.toString()}</span>;
        return <div>
            <Script
                url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBKzseXuW-zDOZGfrgfGpYhVgGhCcddUUE"
                onLoad={this.loaded.bind(this)}
            />
            {this.state.waitMap}
            <div style={{height:"100%"}}id="mapDiv"></div>

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
            waitMap:<span></span>
        })
    }
}