const provinces = require('../db/provinces.json');
const { login } = require('./modules/visit');
const async = require('async');
const { getRestaurantsInDistrict } = require('./crawlers/restaurant');

// const province = provinces[1];
// console.log(province.id);
// console.log(province.name);

// const district = province.district[3];
// console.log(district.id);
// console.log(district.name);

// getRestaurantsInDistrict({
//   nameUrl: province.name_url,
//   provinceId: province.id,
//   districtId: district.id
// }).then().catch(console.log);

// login().then(() => {
//   console.log('Logined');
//   return getRestaurantsInDistrict({
//     nameUrl: province.name_url,
//     provinceId: province.id,
//     districtId: district.id
//   });
// }).then().catch(console.log);

// const crawlInLocation = async () => {
//   await login();
//   console.log('===================================');
//   console.log(`Province ${province.id}`);
//   await async.eachLimit(province.district, 10, async (district) => {
//     console.log(`   District ${district.id}`);
//     await getRestaurantsInDistrict({
//       nameUrl: province.name_url,
//       provinceId: province.id,
//       districtId: district.id
//     });
//     console.log(`Done district ${district.id}`);
//   });
//   console.log(`Finish province ${province.id}`);
// };

// crawlInLocation().then(() => console.log('Done')).catch(err => console.log(err));

const crawlAll = async () => {
  await login();
  await async.eachSeries(provinces, async (province) => {
    console.log('===================================');
    console.log(`Province ${province.id}`);
    await async.eachLimit(province.district, 8, async (district) => {
      console.log(`   District ${district.id}`);
      await getRestaurantsInDistrict({
        nameUrl: province.name_url,
        provinceId: province.id,
        districtId: district.id
      });
      console.log(`Done district ${district.id}`);
    });
    console.log(`Finish province ${province.id}`);
  });
};

crawlAll().then(() => console.log('OK')).catch(err => console.log(err));
