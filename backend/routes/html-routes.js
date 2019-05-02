var express = require('express');
var router = express.Router();

module.exports = function(app,connection)  {
    
    app.get('/State_Crime', function(req,res)  {
        
       // res.send('Hello from simple-react project');
       connection.query("SELECT * FROM stscrime", function(err, data)    {
           (err)?res.send(err):res.json({State_Crime: data});
       })
    });
};