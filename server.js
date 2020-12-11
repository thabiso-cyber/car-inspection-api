const http = require('http');
const app = require('./app');
const cors = require('cors')
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Acesss-Control-Allow-Method', 'PUT, POST, PATCH, DELETE, GET');
    next();
})

const server = http.createServer(app);
console.log("connected successfully on: ",port);

server.listen(port);