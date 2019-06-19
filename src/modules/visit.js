require('dotenv').config();

const { cookieJar, gRequest } = require('./request');
const cheerio = require('cheerio');
const cookie = require('cookie');
const _ = require('lodash');

const foodyHomePage = 'https://www.foody.vn';

const visitHomePage = async () => {
  await gRequest(foodyHomePage, { headers: { 'User-Agent': 'Request-Promise' } });
};

const getCookies = () => {
  const cookiesString = cookieJar.getCookieString(foodyHomePage);
  const cookies = cookie.parse(cookiesString);
  return cookies;
};

const login = () => new Promise((resolve, reject) => {
  gRequest({
    method: 'POST',
    url: 'https://id.foody.vn/dang-nhap',
    form: {
      Email: process.env.FOODY_USERNAME,
      Password: process.env.FOODY_PASSWORD,
      RememberMe: 'true'
    }
  }).then(() => {
    reject(new Error('Login failed'));

  }).catch((err) => {

    gRequest.get('https://id.foody.vn/dang-nhap-thanh-cong?isRemember=True', {
      transform(body) {
        return cheerio.load(body);
      }
    })
      .then(($) => {
        const image = $('img')[4];
        const url = $(image).attr('src');
        console.log(url);

        gRequest({
          url,
          headers: {
            'User-Agent': 'Request-Promise'
          },
          json: true
        })
          .then((res) => {
            console.log(res);
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
  });
});


module.exports = {
  login,
  visitHomePage,
  getCookies
};

// visitHomePage().then(() => {
//   const cookiesString = cookieJar.getCookieString(foodyHomePage);
//   console.log(cookiesString);
//   const cookies = cookie.parse(cookiesString);
//   console.log(cookies);
// }).catch(err => console.log(err));

// login().then().catch(console.log);
