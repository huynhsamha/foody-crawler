# Foody crawler

Crawl database from https://www.foody.vn/ using Node.JS (`request-promise`, `cheerio`, `async`, ...)

Crawled collections:

+ `Provinces`, `Districts` in `db/provinces.json`
+ `Cuisines` in `db/cuisines.json`
+ `Categories` in `db/categories.json`
+ `Facilities` in `db/facilities.json`
+ `Restaurants`: all restaurants in each district, located in the directory `db/restaurant` with chunk files `.jl` (JSON line format). These files are too large with total size is larger than 50 MB, so they are ignored in git. You can unzip `db/restaurant.zip`.

## Quickstart

### Install dependencies

```bash
yarn
# or `npm install`
```

### Crawl simple collections

Crawl all simple collections: province, district, cuisine, category, facility

```bash
node src/getMetadata.js
```

### Crawl all restaurants

Create an account on https://www.foody.vn

Create file `.env` similar to `.env.example`

Change `FOODY_USERNAME` and `FOODY_PASSWORD` to your account

Start crawling process

```bash
node src/getRestaurants.js

## Output:

https://www.foody.vn:443/account/validatetoken?token=C6E96F82-9F8C-4DBA-91AF-622E22D18627&isremember=True
done
===================================
Province 217
   District 1
   District 2
   District 4
   District 5
   District 6
   District 7
   District 8
   District 9
Done district 8
   District 10
Done district 6
   District 11
Done district 4
   District 12
Done district 5
   District 13

...

   District 824
Done district 824
Done district 126
Done district 124
Done district 123
Done district 125
Done district 128
Done district 122
Done district 127
Finish province 230
===================================
Province 265
Finish province 265
OK
```

## Understanding the crawler

```
├── cookies.json              <=== generated when crawling process, ignored in git
├── db
│   ├── categories.json
│   ├── cuisines.json
│   ├── facilities.json
│   ├── .gitignore
│   ├── provinces.json
│   ├── restaurant            <=== ignored in git
│   │   ├── in_217_10.jl
│   │   ├── in_217_11.jl
│   │   ├── in_273_305.jl
|   |   |── ...
│   │   ├── in_273_306.jl
│   │   ├── in_273_307.jl
│   │   ├── in_273_308.jl
│   │   └── in_273_309.jl
│   └── restaurant.zip       <=== zip directory `restaurant`
├── .editorconfig
├── .env                     <=== containing foody account, ignored in git
├── .env.example
├── .eslintignore
├── .eslintrc
├── .gitignore
├── package.json
├── README.md
├── src
│   ├── crawlers
│   │   ├── metadata.js      <=== crawling simple collections
│   │   └── restaurant.js    <=== crawling all restaurants
│   ├── getMetadata.js       <=== file to execute crawling
│   ├── getRestaurants.js    <=== file to execute crawling
│   └── modules
│       ├── request.js       <=== managing global request and cookies jar
│       └── visit.js         <=== visit home page to get cookies and login
└── yarn.lock
```