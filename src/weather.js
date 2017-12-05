const { mk_error_response, mk_ok_response } = require('./utils.js');
const promisify = require('util').promisify;
const weather = require('request-promise');
let data = [];


function mk_weather_response(cityName) {
  return mk_ok_response(
    {
      lastBuildDate: cityName.query.results.channel.lastBuildDate,
      location: cityName.query.results.channel.location.city,
      wind: cityName.query.results.channel.wind,
      current: cityName.query.results.channel.item.forecast[0],
    }
  );
}

module.exports = function (req, res) {
    const cityName = JSON.parse(req.query.city).name;
    let req_params = {
      q: `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${cityName}") and u='c'`,
      format: 'json'
    }

    // JSON: serializar informacion
    let request = {
      uri: 'https://query.yahooapis.com/v1/public/yql',
      qs: req_params,
      json: true,
      encoding: 'utf8'
    };
    weather(request).then((response3) => {
    res.json(mk_weather_response(response3))
  }
  ).catch((error) =>
    res.json(mk_weather_response(cityName)));
};


/*
const cityName = JSON.parse(req.query.city).name;


let req_params = {
  q: `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${cityName}") and u='c'`,
  format: 'json'
}

let request = {
  uri: 'https://query.yahooapis.com/v1/public/yql',
  qs: req_params,
  json: true,
  encoding: 'utf8'
};
weather(request).then((response3) => {
  data.push({ weather: response3.query.results.channel.atmosphere });
  console.log((response3.query.results.channel.atmosphere));
  res.json(mk_weather_response(data));
}
).catch((error) =>
res.json(mk_weather_response(error.message)))
};
*/