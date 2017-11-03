let trips=require("./tables").trips;
let steps=require("./tables").steps;
const usersModel=require("./users");
//const payer=require("./payer");


exports.addTrip=function(payer,costCalculator){
    return function(body,nonexistent,badRevision,me){
        return exports.addTripWithPayer(body,nonexistent,badRevision,me,payer,costCalculator);
    }
}


exports.addTripWithPayer=function(body,nonexistent,badRevision,me,payer,costCalculator){
    return require("./servers").serverIdFromToken(me.token)
    .then((serverId)=>{
        let trip=body.trip;
        let o={
            applicationOwner:serverId,
            driver:trip.driver,
            passenger:trip.passenger,

            startTimestamp:trip.start.timestamp,
            startStreet:trip.start.address.street,
            startLat:trip.start.address.location.lat,
            startLon:trip.start.address.location.lon,

            endTimestamp:trip.end.timestamp,
            endStreet:trip.end.address.street,
            endLat:trip.end.address.location.lat,
            endLon:trip.end.address.location.lon,

            totalTime:trip.totalTime,
            waitTime:trip.waitTime,
            travelTime:trip.travelTime,
            distance:trip.distance,
        }

        return costCalculator.calculateCost(o).then((value)=>{
            o.costCurrency="pesos";
            o.costValue=value;
            return o;
        })
    }).then((trip)=>{
        //si no hay éxito, PAY TIRA ERROR, 500 Y NOS VAMOS
        return payer.pay(body.payMethod,trip.costValue).then((success)=>{
            //HAY QUE HACER ALGUN ALTA AL SALDO DEL USUARIO ACA
            return trips.create(trip)
        })
    }).then((created)=>{
        let steps=body.trip.route;
        let addPromises=steps.map((s)=>{
            return steps.create({
                tripId:created.id,
                timestamp:s.timestamp,
                lat:s.location.lat,
                lon:s.location.lon
            });
        });
        return Promise.all(addPromises).then(()=>created);
    }).then((created)=>{
        return exports.getTrip(created.id);
    })
}

exports.getTrip=function(tripId,nonexistent,badRevision,me){
    return trips.readOne({id:tripId},nonexistent).then((readTrip)=>{
        if(readTrip==nonexistent){
            return nonexistent;
        }

        return steps.read({tripId:tripId}).then((readSteps)=>{
            readTrip.steps=readSteps;
            return readTrip;
        })
    })
}

exports.getUserTrips=function(userId,nonexistent,badRevision,me){
    return usersModel.get(userId,nonexistent).then((user)=>{
        if(user==nonexistent){
            return nonexistent;
        }

        return trips.read({passenger:userId}).then((tripsAsPassenger)=>{
            return trips.read({driver:userId}).then((tripsAsDriver)=>{
                return tripsAsPassenger.concat(tripsAsDriver);
            })
        }).then((trips)=>{
            return trips;
        })
    })
}

exports.estimate=function(){
    return {sure:"yes"};
}