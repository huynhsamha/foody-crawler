const _ = require('lodash');

const visit = require('../modules/visit');
const { cookieJar, gRequest } = require('../modules/request');

const getMetaData = async () => {
  await visit.visitHomePage();
  const cookies = visit.getCookies();

  const data = await gRequest.post('https://gappapi.tablenow.vn/api/metadata/get_metadata', {
    json: true,
    headers: {
      'User-Agent': 'Request-Promise',
      'X-Foody-Api-Version': 1,
      'X-Foody-App-Type': 2000,
      'X-Foody-Client-Id': cookies.__ondemand_sessionid,
      'X-Foody-Client-Language': cookies.flg,
      'X-Foody-Client-Version': 1,
      'X-Foody-Client-Type': 1
    }
  });

  // console.log(data);

  const metadata = data.reply.metadata;

  return {
    provinces: metadata.province,
    cuisines: metadata.cuisine,
    facilities: metadata.facilities
  };
};

const getProvinces = async () => {
  const metadata = await this.getMetaData();
  return metadata.provinces;
};

const getCuisines = async () => {
  const metadata = await this.getMetaData();
  return metadata.cuisines;
};

const getFacilities = async () => {
  const metadata = await this.getMetaData();
  return metadata.facilities;
};

const getCategories = async () => {
  const url = 'https://www.foody.vn/__get/Directory/GetSearchFilter';
  const query = {
    t: Date.now(),
    ds: 'Restaurant',
    vt: 'row',
    st: 1,
    filter: 'category'
  };

  const data = await gRequest({
    json: true,
    url,
    qs: query,
    headers: {
      'User-Agent': 'Request-Promise',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  console.log(data);

  const categories = _.map(data.allCategories, c => _.pick(c, [
    'Id', 'Name', 'UrlRewriteName',
    'Avatar', 'ResultCount'
  ]));

  return categories;
};

module.exports = {
  getMetaData,
  getProvinces,
  getCuisines,
  getFacilities,
  getCategories
};

// getMetaData().then(console.log).catch(console.log);
// getCategories().then(console.log).catch(console.log);
