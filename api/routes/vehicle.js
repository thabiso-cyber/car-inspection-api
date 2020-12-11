const e = require('express');
const {json } = require('express');
const express = require('express');
const router = express.Router();

const Client = require('pg').Client
const client = new Client({
    user: "postgres",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "cardealerd"
})

//get all vehicle makes or list all available inspections`
router.get('/veh', (req, res, next) => {
    return new Promise((resolve, reject) => {
        let placeholder = '';
        let count = 1;
        const params = Object.keys(req.body).map(key => [(key), req.body[key]]);

        const paramsvalues = Object.keys(req.body).map(key => req.body[key]);

        if (Array.isArray(params)) {
            params.forEach(() => {
                placeholder += `$${count},`;
                count += 1;
            });
        } 
        placeholder = placeholder.replace(/,\s*$/, '');

        const getQuery = `cardealer.fn_listwithoutid_vehicle`;

        const sql = "SELECT * FROM " + getQuery + "("+placeholder+")";
  
      client.connect()
            .then(() => client.query(sql,paramsvalues)
                .then((results) => {
                    console.log(results);
                    res.status(201).json({
                      message: 'List of all vehicle',
                      vehicles: results.rows
                    });
                    
                    client.end();
                    resolve(results);
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                })
            )
    })
});
//get a single inspection by id 
router.get('/car/:id', (req, res, next) => {    
    return new Promise((resolve, reject) => {

        client.connect()
            .then(() => client.query(`SELECT * FROM cardealer.fn_list_vehicle(${req.params.id})`))
            .then((results) => {
                console.log(results);
                res.status(200).json({
                    message: 'vehicle Details',
                    Details: results.rows
                });
                resolve(client.end());
            }).catch((error) => {
                console.log(error);
                client.end();
                reject();
            })
    })
});
router.post('/addveh',  (req, res, next) => {
    debugger;
    return new Promise((resolve, reject) => {
        let placeholder = '';
        let count = 1;
        const params = Object.keys(req.body).map(key => [(key), req.body[key]]);

        const paramsvalues = Object.keys(req.body).map(key => req.body[key]);

        if (Array.isArray(params)) {
            params.forEach(() => {
                placeholder += `$${count},`;
                count += 1;
            });
        } 
        placeholder = placeholder.replace(/,\s*$/, '');

        const insertQuery = `cardealer.fn_post_vehicle`;

        const sql = "SELECT * FROM " + insertQuery + "("+placeholder+")";

        // req.body.added_by = parseInt(req.body.added_by); 
        client.connect().then(() => {
            console.log("connected succesfully!")
            client.query(sql,paramsvalues)
                .then((results,error) => {
                    console.log("Vehicle Added: ", results);
                    res.status(201).json({
                        message: 'Newly Added Vehicle',
                        addedVehicle: results.rows
                    });
                    resolve(results);
                    client.end();
                }).catch((error) => {
                    console.log('Vehicle error:', error);
                    res.status(500).json({
                        message: 'Vehicle error',
                        data: error
                    });
                    reject(error);
                })
        })
    })
});
router.put('/updveh', (req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Acesss-Control-Allow-Method', 'PUT, POST, PATCH, DELETE, GET');

    debugger;
    return new Promise((resolve, reject) => {
        let placeholder = '';
        let count = 1;
        const params = Object.keys(req.body).map(key => [(key), req.body[key]]);

        const paramsvalues = Object.keys(req.body).map(key => req.body[key]);

        if (Array.isArray(params)) {
            params.forEach(() => {
                placeholder += `$${count},`;
                count += 1;
            });
        } 

        placeholder = placeholder.replace(/,\s*$/, '');

        const updateQuery = `cardealer.fn_update_vehicle`;

        const sql = `SELECT * FROM ${updateQuery}(${placeholder})`;
        client.connect().then(() => {
            console.log("connected succesfully!")
            client.query(sql, paramsvalues)
                .then((results) => {
                    console.log(results);
                    res.status(201).json({
                        message: 'Updated Vehicle',
                        updatedVehicle: results.rows
                    });
                    resolve(results);
                    client.end();
                }).catch((error) => {
                    console.log('update error:', error);
                    res.status(500).json({
                        message: 'update Error',
                        data: error
                    });
                    client.end();
                    reject(error);
                })
        })
    })
});
 router.get('/', (req, res, next) => {
    
    /*res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Acesss-Control-Allow-Method', 'PUT, POST, PATCH, DELETE, GET');*/
    
    debugger;
     return new Promise((resolve, reject) => {
        let placeholder = '';
        let count = 1;
        const params = Object.keys(req.body).map(key => [(key), req.body[key]]);
        const paramsvalues = Object.keys(req.body).map(key => req.body[key]);
        if (Array.isArray(params)) {
            params.forEach(() => {
                placeholder += `$${count},`;
                count += 1;
            });
        } 
        placeholder = placeholder.replace(/,\s*$/, '');
        const deleteQuery = `cardealer.fn_delete_vehicle`;
        const sql = `SELECT * FROM ${deleteQuery}(${placeholder})`;

         client.connect().then(() => {
          console.log("connected succesfully!")
             client.query(sql,paramsvalues)
            .then((results) => {
                console.log(results);
                 res.status(200).json({
                     message: 'Deleted Vehicle',
                     deletedVehicle: results.rows
                 });
                 resolve();
                 client.end();
                }).catch((error) => {
                    console.log('Delete error:', error);
                    res.status(500).json({
                        message: 'delete Error',
                        data: error
                    });
                client.end();
                reject();
           })
        })
    })
});
module.exports = router;