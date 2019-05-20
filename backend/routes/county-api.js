
var express = require('express');
var router = express.Router();
let rawUrl = 'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Local_Law_Enforcement_Locations/FeatureServer/0/query?where=1%3D1&outFields=STATE,NAME,CITY,COUNTY&outSR=4326&f=json';

var request = require("request");

module.exports = function (app) {
    app.get('/County_Agency', function (req, res)    {
        request(rawUrl, { json :true }, (error, response, body) =>  {
            if (error)  {
                res.send(error);
            }
            res.json({County_Agency: body});
        });
    });
}