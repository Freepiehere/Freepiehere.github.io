const url = require('url');
const querystring = require('querystring')
const axios = require('axios');

let rawUrl = 'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Local_Law_Enforcement_Locations/FeatureServer/0/query?where=1%3D1&outFields=CITY,STATE,COUNTY,STATE_ID&outSR=4326&f=json';

let parsedUrl = url.parse(rawUrl);
let parsedQs = querystring.parse(parsedUrl.query);
var request = require("request");

request.get(rawUrl, (error,response,body) => {
    if(error)   {
        console.log(error);
    }
    console.log(body)
});
module.exports = request;
/*
axios.get(rawUrl)
    .then(response => {
        console.log(response.data.status);
        res.sen
        console.log(body)d(response.data.status)
    });
    .catch(error => {
        console.log(error);
    });


module.exports = axios;