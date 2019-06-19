const _ = require('lodash');
const path = require('path');
const fse = require('fs-extra');
const { gRequest } = require('../modules/request');

const getRestaurantsInDistrict = async ({ nameUrl, provinceId, districtId }) => {
  const url = `https://www.foody.vn/${nameUrl}/food/dia-diem`;
  const _query = {
    ds: 'Restaurant',
    vt: 'row',
    st: 1,
    append: true,
    provinceId,
    dt: districtId,
    page: null
  };

  const dirPath = path.join(__dirname, '../../db/restaurant');
  const filePath = path.join(dirPath, `in_${provinceId}_${districtId}.jl`);
  fse.ensureDirSync(dirPath);
  fse.removeSync(filePath);

  const ids = {};

  const fetchPage = async (page) => {
    // console.log(page);
    const query = { ..._query, page };
    const data = await gRequest({
      url,
      qs: query,
      headers: {
        'User-Agent': 'Request-Promise',
        'X-Requested-With': 'XMLHttpRequest'
      },
      json: true
    });
    // console.log(data);

    const { searchItems } = data;
    // console.log(`Length: ${searchItems.length}`);

    let hasNext = searchItems && searchItems.length > 0;
    if (hasNext) {
      const lid = searchItems.map(u => u.Id);
      lid.forEach((u) => {
        if (ids[u]) {
          hasNext = false;
        }
      });
      if (hasNext) {
        lid.forEach((u) => { ids[u] = true; });
        _.forEach(searchItems, (dt) => {
          dt.LocationId = provinceId;
          const data = _.pick(dt, [
            'Id', 'Name',
            'Address', 'District', 'City', 'DistrictId', 'Location', 'LocationId',
            'Phone', 'Cuisines', 'SpecialDesc',
            'Categories', 'Services',
            'Latitude', 'Longitude',
            'MainCategoryId', 'MasterCategoryId',
            'HasDelivery', 'HasBooking',
            'TotalReview', 'TotalView', 'TotalFavourite', 'TotalCheckins', 'TotalPictures',
            'AvgRating', 'AvgRatingOriginal',
            'PicturePath', 'PicturePathLarge', 'MobilePicturePath',
            'ReviewUrl', 'AlbumUrl', 'IconUrl', 'IsAd',
            'DetailUrl']);

          fse.appendFileSync(filePath, `${JSON.stringify(data)}\n`);
        });
        return fetchPage(page + 1);
      }
    }
  };

  return fetchPage(1);
};


module.exports = { getRestaurantsInDistrict };
