# sharedserver

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