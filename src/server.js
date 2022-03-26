const express = require('express')
const { configEnv } = require('./config')
const app = express()
const db = require('./config/db')
const route = require('./routes/index')
const morgan = require("morgan")
const cors = require("cors")
const server = require("http").Server(app);
var multer = require('multer');
const socket = require('./socket');
const paypal = require("./config/paypal");
//connect db
db.connect()
//connect Paypal
paypal.connectPayPal(process.env.ID_Client, process.env.Secret);

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())
app.use(morgan("dev"))
app.use(cors())
app.use(route)
app.get('/healCheck', (req, res) => res.status(200).json({hello : 'Welcome to FreshFood v1.0'}))
app.get('/*', (req, res) => res.send({message: 'cannot access route'}))

global.io = require('socket.io').listen(server);

socket.init();

server.listen(configEnv.PORT, () => {
    console.log(`App running in port ${configEnv.PORT}`)
})
