let trips=require("./tables").trips;
let steps=require("./tables").steps;
const usersModel=require("./users");
//const payer=require("./payer");

let payer=null;
let costCalculator=null;
exports.addTrip=function(newPayer,newCostCalculator){
    payer=newPayer;
    costCalculator=newCostCalculator;
    return exports.addTripWithPayer;
}


exports.addTripWithPayer=function(body,nonexistent,badRevision,me){
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
            let promises=trips.map((t)=>{
                return exports.getTrip(t.id);
            })
            return Promise.all(promises);
        })
    })
}

exports.estimate=function(body,nonexistent,badRevision,me){
    /*
    {
        "id": "string",
        "applicationOwner": "string",
        "driver": "string",
        "passenger": "string",
        "start": null,
        "end": null,
        "totalTime": 0,
        "waitTime": 0,
        "travelTime": 0,
        "distance": 0,
        "route": null,
        "cost": null
    }
    */
    //Características del conductor (viajes en el día, viajes en el mes, antigüedad)
    //Cantidad de viajes que se realizaron en la última ventana temporal (Hora, 30 mins, 10 mins)
    return Promise.resolve(true)
    .then(()=>{
        return fullDataFrom(body.driver)
    }).then((fd)=>{
        body.driver=fd;
    })
    //Características del pasajero (viajes en el día, viajes en el mes, antigüedad, saldo)
    //Cantidad de viajes que se realizaron en la última ventana temporal (Hora, 30 mins, 10 mins)
    .then(()=>{
        return fullDataFrom(body.passenger)
    }).then((fd)=>{
        body.passenger=fd;
        return Promise.resolve(true)
    })
    //Método de pago
    .then(()=>{
        return payer.paymentMethods();
    }).then((methods)=>{
        body.paymentMethod=methods[0].paymethod;
        return Promise.resolve(true)
    })
    //Características del viaje (duración, distancia, posición geográfica, fecha y hora)[CAMBIA]
    //Día y horario de la realización del viaje[CAMBIA?]
    //Tiempo de espera del pasajero para: 
    //(Que un conductor le confirme el viaje) [CAMBIA]
    //(Que el conductor llegue a buscarlo) [CAMBIA]
    .then(()=>{
        body.travelTime=48*60;//48 min siempre
        body.waitTime=5*60;//5 min siempre
        body.totalTime=40*60;//40 min siempre
        //quedan 3 de espera a que el driver confirme

        body.distance=body.distance || 1200;//1200 siempre
        body.date=new Date();
        return Promise.resolve(true)
    })
    //Application server que realiza la cotización
    .then(()=>{
        return require("./servers").serverIdFromToken(me.token);  
    }).then((serverId)=>{
        body.serverId=serverId;
        return Promise.resolve(true)
    })
    //CONCLUSION
    .then(()=>{
        return body;
    })


}


function fullDataFrom(userId,nonexistent){
    let user=null;
    return usersModel.get(userId,nonexistent).then((u)=>{
        user=u;
        return Promise.resolve(true);
    }).then(()=>{
        return tripsThisMonth(userId).then((thisMonth)=>{
            user.tripsThisMonth=thisMonth;
            return Promise.resolve(true);
        })
    }).then(()=>{
        return tripsToday(userId).then((today)=>{
            user.tripsToday=today;
            return Promise.resolve(true);
        })
    }).then(()=>{
        return antiqueness(userId).then((antiqueness)=>{
            user.antiqueness=antiqueness;
            return Promise.resolve(true);
        })
    }).then(()=>{
        return tripsLastHour(userId).then((tripsLastHour)=>{
            user.tripsLastHour=tripsLastHour;
            return Promise.resolve(true);
        })
    }).then(()=>{
        return tripsLast30m(userId).then((tripsLast30m)=>{
            user.tripsLast30m=tripsLast30m;
            return Promise.resolve(true);
        })
    }).then(()=>{
        return tripsLast10m(userId).then((tripsLast10m)=>{
            user.tripsLast10m=tripsLast10m;
            return Promise.resolve(true);
        })
    })
}

function tripsThisMonth(userId){
    let date=new Date();
    let y=date.getFullYear();
    let m=date.getMonth();
    let beginningOfMonth=new Date(y,m,0);
    return tripsSince(userId,beginningOfMonth);
}

function tripsToday(userId){
    let beginningOfDay=new Date();
    beginningOfDay.setHours(0,0,0,0);
    return tripsSince(userId,beginningOfDay);
}

function antiqueness(userId){//hay que empezar a guardar esto en la tabla
    //ponele que empezaron todos este mes
    let date=new Date();
    let y=date.getFullYear();
    let m=date.getMonth();
    let beginningOfMonth=new Date(y,m,0);
    return (new Date()).getTime()-beginningOfMonth.getTime();
}

function tripsLastHour(userId){
    let date=new Date();
    date.setHours(date.getHours()-1);
    return tripsSince(userId,date);
}

function tripsLast30m(userId){
    let date=new Date();
    date.setMinutes(date.getMinutes()-30);
    return tripsSice(userId,date);
}

function tripsLast10m(userId){
    let date=new Date();
    date.setMinutes(date.getMinutes()-10);
    return tripsSice(userId,date);
}


function tripsSince(userId,date){
    return tripsModel.getUserTrips(userId,{},{},{}).then((trips)=>{
        return trips.filter((trip)=>{
            return trip.endTimestamp>date.getTime();
        })
    })
}