const { mk_error_response, mk_ok_response } = require('./utils');
const config = require('./config');
const GooglePlaces = require('node-googleplaces');
const placesApi = new GooglePlaces(config.auth.googleplaces);



function mk_places_response(places) {
  let lugares = JSON.parse(places.text);
  let ret = [];
  let ordenados= lugares.results.sort(function(l1, l2){return l2.rating - l1.rating});
  ordenados.forEach(function (place) {
  ret.push({
      name: place.name,
      rating: place.rating,
      description: place.description
    })
  });
  return mk_ok_response(ret);
}

function places(req, res) {

    let city = JSON.parse(req.query.city);
    let idDeCiudad = city.place_id;

    placesApi.details({ place_id: idDeCiudad }).then((PlacesServiceStatus) => {
      let obj = JSON.parse(PlacesServiceStatus.text);
      let lat = obj.result.geometry.location.lat;
      let lng = obj.result.geometry.location.lng
      let coord = lat + "," + lng;
      let params = {
        location: coord,
        radius: 2000,
        types: ['restaurant', 'food', 'bar'],
        key: 'AIzaSyCezwIp00tACuiEDB_gikM2TGLH0YINcpw'
      };
      placesApi.nearbySearch(params).then((results, status) => {
        res.json(mk_places_response(results));
      });
    }).catch ((error) => {
    res.json(mk_error_response(error));
  });
}

module.exports = places;