
# Manual de configuración e instalación

[Reporte de cobertura](https://codecov.io/gh/fiuber/sharedserver/)

## Configuración del proyecto
El proyecto está pensado para usarse desde un contexto linux.
1. Instalar docker y docker-compose
2. Instalar node y npm
3. Clonar el respositorio
4. ejecutar docker-compose build en la carpeta del repositorio


## Desarrollo
Existen 3 comandos proncipales:
- ```sh db```  inicia la imagen de postgres y el json-server, de esta manera se acelera sh test
- ```sh test```  Ejecuta los tests, construyendo las imágenes de docker correspondientes
- ```sh run``` Inicia y ejecuta el servidor localmente, en el port 8080.
Se puede modificar docker-compose para alterar el servidor de pagos (puede ser el verdadero o el json-server), o por medio de la variable DEBUG se puede determinar el nivel de logging deseado. En caso de modificarse algún archivo de la raíz de la carpeta, debe ejecutarse nuevamente ```docker-compose build```

## Generación de documentación
Ejecutar el comando ```npm run docs```. De esta manera, se genera la documentación en la carpeta /docs.
Previamente puede ser necesario ejecutar ```npm install```.

## Deploy
Ejecutar el comando ```npm run init-heroku```, que inicializa el repositorio y loggea al usuario en heroku.
Una vez ejecutado init-heroku, correr ```npm run push-heroku```, que sube la imagen al heroku.


# Diseño
La idea que guió el diseño fue separar:
- comunicaciones (Express) 
- construcción de json saliente (reshaperCreator)
- validación del json entrante (apify)
- acceso a la base de datos postgres (paquete tables)
El punto de intersección de todas estas tecnologías es los modelos planteados en la carpeta model. Los submódulos de la carpeta model están abstraídos de los aspectos nombrados arriba.

Pese a que la idea es atractiva, se obtuvo una arquitectura poco conveniente y demasiado pesada, fruto de sobreingeniería. Así, el modelo tiene como principal responsabilidad el hacer joins, que es una tarea que debería estar relegada al paquete tables. Una mejor decisión habría sido relegar tanto los joins como la construcción de json a vistas de SQL, o usar un ORM, y permitir acoplamiento con Express.

# Modelo de datos


# Uso del engine de reglas
Lo que recibe el engine de reglas es (es decir, API para el engine de reglas).
EL objeto "this" de las reglas tiene la forma:
```javascript
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
```