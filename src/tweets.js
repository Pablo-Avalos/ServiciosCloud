const Twitter = require('twitter');
const config = require('./config');
const { mk_error_response, mk_ok_response } = require('./utils');
const yandex = require('yandex-translate')('trnsl.1.1.20171126T174839Z.acdd09d50a536ca9.d6e35f41386e99c34f14ed728048ab0ed8a748d3');
const promisify = require('util').promisify;

/*
library doc - https://www.npmjs.com/package/twitter
twitter API doc - https://developer.twitter.com/en/docs/api-reference-index
twitter API - tweet object - https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object
twitter API - user object - https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object


Obtener user credentials:
  1. Loggearse a twitter
  2. IR a https://apps.twitter.com/
  3. Crear una app y conseguir las credenciales
  4. Poner las credenciales en el archivo config.js
*/

const client = new Twitter(config.auth.twitter);

function tweets(req, res) {
  const city = JSON.parse(req.query.city);
  let cityName = city.name;
  const translate = promisify(yandex.translate);
  let data = [];
  const params = {
    q: cityName,
    count: 10,
  };
  res2 = ""; // esta variable guarda el resultado del response llamada response2
  let promisList = [];
  
  client.get('search/tweets', params)
    .then((response) => (
      client.get('/statuses/user_timeline', getUser(response.statuses)))
    ).then((response2) => {
      promisList = response2.map((tweet)=> translate(tweet.text, { to: 'es' }));
    return Promise.all(promisList)
    }).then((result)=>
      res.json(mk_ok_response(result))
    ).catch((error) =>
      res.json(mk_error_response(error.message)))
}


function getUser(tweets) {
  let user = tweets.sort(function (u1, u2) { return u2.user.followers_count - u1.user.followers_count })[0].user;
  const data = {
    screen_name: user.screen_name,
    count: 2
  };
  return data;
}


/*
function makeResponse(tweets) {
  let data = []
  data.push({ text: tweets[0].text, author: tweets[0].user.name });
  data.push({ text: tweets[1].text, author: tweets[1].user.name });
  return data;
}
*/
module.exports = tweets;

/*
 client.get('search/tweets', params)
    .then((response) => (
      client.get('/statuses/user_timeline', getUser(response.statuses)))
    ).then((response2) => {
      promisList = response2.map((tweet)=> translate(tweet.text, { to: 'es' }));
      res2 = response2;
      return translate(res2[0].text, { to: 'es' })
    }
    ).then((msj1) => {
      data.push({ text: msj1.text, author: res2[0].user.name, lang: res2[0].lang });
      return translate(res2[1].text, { to: 'es' })
    }
    ).then((msj2) => {
      data.push({ text: msj2.text, author: res2[1].user.name, lang: res2[1].lang });
      res.json(mk_ok_response(data))      
    }
    ).catch((error) =>
      res.json(mk_error_response(error.message)))
      */



















