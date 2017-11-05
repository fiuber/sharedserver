# sharedserver
PRECAUCIÓN: si se modifica algún .js de la raíz, hay que tirar docker-compose build

ANTES DE EJECUTAR CUALQUIER COMANDO ES CONVENIENTE EJECUTAR 

sh db 

De esta manera, el resto son más rápidos

#test localmente
docker-compose run -v "$PWD/src:/app/src" -v "$PWD/integration-test:/app/integration-test" web npm test

o bien 

sh test

#ejecutar localmente

docker-compose run --service-ports -v "$PWD/src:/app/src" -v "$PWD/integration-test:/app/integration-test" web npm start

o bien

sh run

expone el port 8080

#Lo que recibe el engine de reglas (es decir, API para el engine de reglas)
{ id: 'string',
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
  result: true }
