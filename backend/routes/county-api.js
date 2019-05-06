
var express = require('express');
var router = express.Router();
let rawUrl = 'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Local_Law_Enforcement_Locations/FeatureServer/0/query?where=1%3D1&outFields=CITY,STATE,COUNTY,STATE_ID&outSR=4326&f=json';

var request = require("request");

router.get("/County_Crime", (req,res) => {
    request(rawUrl, function(error,response,body)   {
        if(error) {
            res.send(error)
        }
        return res.json({County_Crime: body});
    });
});
module.exports = router;
