echo "ESTO SOLO VA A ENVIAR EL COVERAGE SI SE CORRE ADENTRO DE TRAVIS jejejeje"
pwd
./node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha -R spec $(find src -name *-test.js )
#ls / -R
#curl -s https://codecov.io/bash | sh


#./node_modules/.bin/istanbul cover 