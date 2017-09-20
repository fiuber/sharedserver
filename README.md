# sharedserver
PARA TESTING (local):

para inicia la base de datos, ejecutar 1 sola vez
> docker compose up -d db
para iniciar web y testear, ejecutar cada vez
> docker-compose run -v"./:/app/" web npm test 

