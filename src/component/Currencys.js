import request from 'superagent';
import cacheModule from 'cache-service-cache-module';
var cache = new cacheModule({storage: 'session', defaultExpiration: 3600});
var cacheForNames = new cacheModule({storage: 'session', defaultExpiration: 3600*24});
var superagentCache = require('superagent-cache-plugin')(cache);
var superagentCacheNames = require('superagent-cache-plugin')(cacheForNames);
let DEVELOPER_USER_ID="ce26c44699c34381ab742da51be57365";
let URL_GET_CURRENCYS="https://openexchangerates.org/api/latest.json?app_id=";
let URL_GET_CURRENCYS_NAMES="https://openexchangerates.org/api/currencies.json";

let currencies={};

async function getCurrencys() {
    await request.get(URL_GET_CURRENCYS+DEVELOPER_USER_ID)
        .set('Content-Type', 'application/json;charset=UTF-8')
        .use(superagentCache)
        .then(async res => {
            currencies=res.body.rates;
        });
    return currencies;
}

async function getCurrencysNames() {
    await request.get(URL_GET_CURRENCYS_NAMES)
        .set('Content-Type', 'application/json;charset=UTF-8')
        .use(superagentCacheNames)
        .then(async res => {
            currencies=res.body;
        });
    return currencies;
}

const Currencys = {
    getCurrencys, getCurrencysNames
};

export default Currencys;