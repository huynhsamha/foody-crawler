const fse = require('fs-extra');
const path = require('path');
const request = require('request');
const rp = require('request-promise');
const FileCookieStore = require('tough-cookie-filestore');

const cookiefilePath = path.join(__dirname, '../../cookies.json');

fse.writeJSONSync(cookiefilePath, {});

const cookieStore = new FileCookieStore(cookiefilePath);

const cookieJar = request.jar(cookieStore);

const gRequest = rp.defaults({ jar: cookieJar });

module.exports = {
  gRequest,
  cookieJar
};
