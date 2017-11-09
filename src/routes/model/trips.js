let trips=require("./tables").trips;
let steps=require("./tables").steps;
const usersModel=require("./users");
const transactionsModel=require("./transactions")
//const payer=require("./payer");

/**
 * @module
 * @description A model for handling the CRUD of trips, payments (only addTrip) and estimation.
 */

let payer=null;
let costCalculator=null;
exports.addTrip=function(newPayer,newCostCalculator){
    payer=newPayer;
    costCalculator=newCostCalculator;
    return exports.addTripWithPayer;
}

const tripShape={
    "trip": {
      "id": "string",
      "applicationOwner": "string",
      "driver": "string",
      "passenger": "string",
      "start": {
          address:{
              location:{
                  lat:0,
                  lon:0
              }
          },
          timestamp:0
      },
      "end": {
        address:{
            location:{
                lat:0,
                lon:0
            }
        },
        timestamp:0
      },
      "totalTime": 0,
      "waitTime": 0,
      "travelTime": 0,
      "distance": 0,
      "route": [
          {
              location:{
                  lat:0,
                  lon:0
              },
              timestamp:0
          }
      ],
      "cost": {
          currency:"string",
          value:0
      }
    },
    "paymethod": {
        paymethod:"string",
        parameters:{}
    }
  }
  exports.addTrip.shape=tripShape;


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
        return Promise.resolve(true).then(()=>{
            return fullDataFrom(body.trip.passenger).then((fd)=>{
                body.trip.passenger=fd;
                return Promise.resolve(true);
            });
        }).then(()=>{
            return fullDataFrom(body.trip.driver).then((fd)=>{
                body.trip.driver=fd;
                return Promise.resolve(true);
            });
        }).then(()=>{
            let calc=body.trip;
            calc.paymethod=body.paymethod;
            return costCalculator.calculateCost(calc).then((value)=>{
                o.costCurrency="ARS";
                o.costValue=value;
                return o;
            })
        })
        
    }).then((trip)=>{
        //si no hay éxito, PAY TIRA ERROR, 500 Y NOS VAMOS
        
        return trips.create(trip).then((createdTrip)=>{
            return transactionsModel.addDebt({//PONGO LA DEUDA
                id:"asd",
                trip:createdTrip.id,
                timestamp:createdTrip.timestamp,
                cost:{
                    currency:trip.costCurrency,
                    value:-trip.costValue//NEGATIVO!!
                },
                description:"Debt of a trip",
                data:{}//el paymethod que viene en el POSt este
            },body.trip.passenger.id,nonexistent).then(()=>{//PONGO EL PAGO
                return transactionsModel.addTransaction({
                    id:"asd",
                    trip:createdTrip.id,
                    timestamp:createdTrip.timestamp,
                    cost:{
                        currency:trip.costCurrency,
                        value:trip.costValue
                    },
                    description:"Payment of a trip",
                    data:body.paymethod//el paymethod que viene en el POSt este
                },body.trip.passenger.id,nonexistent)

            }).then(()=>createdTrip);

            
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
        return exports.getTrip(created.id,nonexistent);
    })
}
exports.addTripWithPayer.shape=tripShape;

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
exports.getTrip.shape={};

exports.getTrips=function(nonexistent,badRevision,me){
    return trips.read().then((all)=>{
        let allPromises=all.map((trip)=>{
            return exports.getTrip(trip.id,nonexistent,badRevision,me);
        });
        return Promise.all(allPromises);
    })
}
exports.getTrips.shape={};

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
exports.getUserTrips.shape={};

exports.estimate=function(trip,nonexistent,badRevision,me){
    let o={
        //applicationOwner:serverId,
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

        steps:[]
    }
    /*
    {
        "id": "string", [NO]
        "applicationOwner": "string",[NO]
        "driver": "string",[SI] (!!!!!) esto lo debería agregar el shared
        "passenger": "string",[SI]
        "start": null, [SI]
        "end": null, [SI]
        "totalTime": 0, [OPCIONAL]
        "waitTime": 0, [OPCIONAL]
        "travelTime": 0, [OPCIONAL]
        "distance": 0, [OPCIONAL]
        "route": null, [NO]
        "cost": null [NO]
    }
    */
    //Características del conductor (viajes en el día, viajes en el mes, antigüedad)
    //Cantidad de viajes que se realizaron en la última ventana temporal (Hora, 30 mins, 10 mins)
    return Promise.resolve(true)
    .then(()=>{
        console.log("A");
        return fullDataFrom(trip.driver,nonexistent)
    }).then((fd)=>{
        trip.driver=fd;
    })
    
    //Características del pasajero (viajes en el día, viajes en el mes, antigüedad, saldo)
    //Cantidad de viajes que se realizaron en la última ventana temporal (Hora, 30 mins, 10 mins)
    .then(()=>{
        console.log("B");
        return fullDataFrom(trip.passenger,nonexistent)
    }).then((fd)=>{
        trip.passenger=fd;
        return Promise.resolve(true)
    })
    //Método de pago
    .then(()=>{
        console.log("C");
        return payer.paymentMethods();
    }).then((methods)=>{
        console.log("D");
        trip.paymethod=methods[0].paymethod;
        return Promise.resolve(true)
    })
    //Características del viaje (duración, distancia, posición geográfica, fecha y hora)[CAMBIA]
    //Día y horario de la realización del viaje[CAMBIA?]
    //Tiempo de espera del pasajero para: 
    //(Que un conductor le confirme el viaje) [CAMBIA]
    //(Que el conductor llegue a buscarlo) [CAMBIA]
    .then(()=>{
        console.log("E");
        trip.travelTime=48*60;//48 min siempre
        trip.waitTime=5*60;//5 min siempre
        trip.totalTime=40*60;//40 min siempre
        //quedan 3 de espera a que el driver confirme

        trip.distance=trip.distance || 1200;//1200 siempre
        trip.date=new Date();
        return Promise.resolve(true)
    })
    //Application server que realiza la cotización
    .then(()=>{
        console.log("F");
        return require("./servers").serverIdFromToken(me.token);  
    }).then((serverId)=>{
        console.log("G");
        o.applicationOwner=serverId;
        trip.applicationOwner=serverId;
        return Promise.resolve(true)
    })
    //CONCLUSION
    .then(()=>{
        console.log("H");
        
        return costCalculator.calculateCost(trip)
    }).then((cost)=>{
        console.log("I");
        o.costValue=cost;
        o.costCurrency="ARS";
        return o;
    })


}


function fullDataFrom(userId,nonexistent){
    let user=null;
    return usersModel.get(userId,nonexistent).then((u)=>{
        user=u;
        if(u==nonexistent){
            return Promise.reject(nonexistent);
        }
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

    .then(()=>{
        return user;
    })


    .catch((nonexistent)=>{
        return Promise.resolve(nonexistent);
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
    return Promise.resolve((new Date()).getTime()-beginningOfMonth.getTime());
}

function tripsLastHour(userId){
    let date=new Date();
    date.setHours(date.getHours()-1);
    return tripsSince(userId,date);
}

function tripsLast30m(userId){
    let date=new Date();
    date.setMinutes(date.getMinutes()-30);
    return tripsSince(userId,date);
}

function tripsLast10m(userId){
    let date=new Date();
    date.setMinutes(date.getMinutes()-10);
    return tripsSince(userId,date);
}


function tripsSince(userId,date){
    return exports.getUserTrips(userId,[],[],{}).then((trips)=>{
        return trips.filter((trip)=>{
            return trip.endTimestamp>date.getTime();
        }).length;
    })
}

exports.estimate.shape={
    "driver": "string",
    "passenger": "string",
    "start": {
        address:{
            location:{
                lat:0,
                lon:0
            }
        },
        timestamp:0
    }, 
    "end": {
        address:{
            location:{
                lat:0,
                lon:0
            }
        },
    },
}