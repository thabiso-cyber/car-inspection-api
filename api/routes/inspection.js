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
//get all vehicle makes or list all available inspections
router.get('/insp', (req, res, next) => {
    debugger;
    return new Promise((resolve, reject) => {
        client.connect()
            .then(() => client.query(`select * from cardealer.vehicle_insp`)
                .then((results) => {
                    client.end();
                    console.log(results);
                    res.status(201).json({
                      message: 'List of all inspections',
                      Inspection:results.rows
                    });
                    
                    resolve(results);
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                })
            )
    })
});

//get a single inspection by id 
router.get('/:id', (req, res, next) => {
    debugger;
    return new Promise((resolve, reject) => {

        client.connect()
            .then(() => client.query(`SELECT * FROM cardealer.fn_list_inspection(${req.params.id})`))
            .then((results) => {
                console.log(results);
                res.status(200).json({
                    message: 'Inspection Details',
                    Details: results.rows
                });
                resolve();
                client.end();
            }).catch((error) => {
                console.log(error);
                reject();
            })
    })
});

router.post('/add', (req, res, next) => {
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

        const insertQuery = `cardealer.fn_post_inspection`;

        const sql = "SELECT * FROM " + insertQuery + "("+placeholder+")";

        // req.body.added_by = parseInt(req.body.added_by); 
        client.connect().then(() => {
            console.log("connected succesfully!")
            client.query(sql,paramsvalues)
                .then((results,error) => {
                    console.log("Inspection Added: ", results);
                    res.status(201).json({
                        message: 'Newly Added Inspection',
                        addedInspection: results.rows
                    });
                    resolve(results);
                    client.end();
                }).catch((error) => {
                    console.log('Inspection error:', error);
                    res.status(500).json({
                        message: 'Inspection error',
                        data: error
                    });
                    reject(error);
                })
        })
    })
});

router.put('/upd', (req, res, next) => {
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

        const updateQuery = `cardealership.fn_update_inspection`;

        const sql = `SELECT * FROM ${updateQuery}(${placeholder})`;
        client.connect().then(() => {
            console.log("connected succesfully!")
            client.query(sql, paramsvalues)
                .then((results) => {
                    console.log(results);
                    res.status(201).json({
                        message: 'Updated Vehicle',
                        updatedInspection: results.rows
                    });
                    resolve(results);
                    client.end();
                }).catch((error) => {
                    console.log('update error:', error);
                    res.status(500).json({
                        message: 'update Error',
                        data: error
                    });
                    client.end();3
                    reject(error);
                })
        })
    })
});

 router.delete('/delete', (req, res, next) => {
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
        const deleteQuery = `cardealer.fn_delete_inspection`;
        const sql = `SELECT * FROM ${deleteQuery}(${placeholder})`;

         client.connect().then(() => {
          console.log("connected succesfully!")
             client.query(sql,paramsvalues)
            .then((results) => {
                console.log(results);
                 res.status(200).json({
                     message: 'Deleted inspection',
                     deletedInspection: results.rows
                 });
                 resolve(results);
                 client.end();
                }).catch((error) => {
                    console.log('Delete error:', error);
                    res.status(500).json({
                        message: 'delete Error',
                        data: error
                    });
                client.end();
                reject(error);
           })
        })
    })
});

module.exports = router;