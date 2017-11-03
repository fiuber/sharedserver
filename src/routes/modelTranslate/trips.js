function trip(string,number,array,from){
    return {
        trip:{
            id:string("id"),
            applicationOwner:string("applicationOwner"),
            driver:string("driver"),
            passenger:string("passenger"),
            start:{
                timestamp:string("startTimestamp"),
                address:{
                    street:string("startStreet"),
                    location:{
                        lat:number("startLat"),
                        lon:number("startLon")
                    }
                }
            },
            end:{
                timestamp:string("endTimestamp"),
                address:{
                    street:string("endStreet"),
                    location:{
                        lat:string("endLat"),
                        lon:string("endLon")
                    }
                }
            },
            totalTime:number("totalTime"),
            waitTime:number("waitTime"),
            travelTime:number("travelTime"),
            distance:number("distance"),
            route:from("steps",array({
                timestamp:number("timestamp"),
                location:{
                    lat:number("lat"),
                    lon:number("lon")
                }
            })),
            cost:{
                currency:string("costCurrency"),
                value:number("costValue")
            }
        }
    }
}

exports.addTripWithPayer=trip;
exports.getTrip=trip;
exports.getUserTrips=function(string,number,array,from){
    let shape=trip(string,number,array,from).trip;
    return {
        trips:array(shape)
    }


}