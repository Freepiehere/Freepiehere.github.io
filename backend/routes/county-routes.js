var express = require('express');
var router = express.Router();

module.exports = function(app,connection)  {
    
    app.get('/County_Crime', function(req,res)  {
        
       // res.send('Hello from simple-react project');
       connection.query("SELECT * FROM USCounties", function(err, data)    {
           (err)?res.send(err):res.json({County_Crime: data});
       })
    });
};