const fse = require('fs-extra');
const path = require('path');
const crawler = require('./crawlers/metadata');

const crawl = async () => {
  const metadata = await crawler.getMetaData();

  const { provinces, cuisines, facilities } = metadata;

  fse.writeJSONSync(path.join(__dirname, '../db/provinces.json'), provinces, { spaces: 2 });
  fse.writeJSONSync(path.join(__dirname, '../db/cuisines.json'), cuisines, { spaces: 2 });
  fse.writeJSONSync(path.join(__dirname, '../db/facilities.json'), facilities, { spaces: 2 });

  const categories = await crawler.getCategories();

  fse.writeJSONSync(path.join(__dirname, '../db/categories.json'), categories, { spaces: 2 });
};

crawl().then(() => console.log('OK')).catch(console.log);
