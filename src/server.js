const express = require('express');

const weather = require('./weather');
const places = require('./places');
const tweets = require('./tweets');
const cities = require('./cities');


const app = express();

app.use('/', express.static('client/build/'));

app.get('/helloworld',(req, res)=>{
  res.send('Hello World');
});

function hellojson(req,res){
  res.json({
    clave: 'valor',
    clave_2: 'valor 2',
    una_lista: [1,2,3,4,5,6]
  });
} 

app.get('/api/hellojson', hellojson);

// Make hello world on /api/test

// Make /api/hostInfo Endpoint
// Should return { numberOfCPus: , hostname, freeMem:}

app.get('/api/cities', cities);
app.get('/api/tweets', tweets);
app.get('/api/weather', weather);
app.get('/api/places', places);

app.listen(3001, () => {
  console.log('Service listening on port 3001!');
});