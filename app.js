const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const pg = require('pg');

const inspRoutes = require('./api/routes/inspection')
const vehicleRoutes = require('./api/routes/vehicle')
const techRoutes = require('./api/routes/technician')
const clientRoutes = require('./api/routes/client')

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:  true}));
app.use(bodyparser.json()); 

//res.header("Access-Control-Allow-Origin", "*");
//res.header("Access-Control-Allow-Headers", 
//"Origin, X-Requested-With, Content-Type, Accept, Authorization");
//res.header('Acesss-Control-Allow-Method', 'PUT, POST, PATCH, DELETE, GET');
//next();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Acesss-Control-Allow-Method', 'PUT, POST, PATCH, DELETE, GET');
    next();
});
//Routes which must handle requests 
app.use('/api/insp', inspRoutes);
app.use('/api/veh', vehicleRoutes);
app.use('/api/tech', techRoutes);
app.use('/api', clientRoutes);

app.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            massage: error.message
        }
    });
});
module.exports = app;
