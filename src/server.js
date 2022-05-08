const express = require('express')
const { configEnv } = require('./config')
const app = express()
const db = require('./config/db')
const route = require('./routes/index')
const morgan = require("morgan")
const cors = require("cors")
const server = require("http").Server(app);
const socket = require('./socket');
const paypal = require("./config/paypal");
const bodyParser = require('body-parser')


global.io = require('socket.io').listen(server);

db.connect()
paypal.connectPayPal(process.env.ID_Client, process.env.Secret);

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json())
app.use(morgan("dev"))
app.use(route)

app.get('/is-available', (req, res) => res.status(200).json({hello : 'Welcome to FreshFood v1.0'}))
app.get('/*', (req, res) => res.send({message: 'cannot access route'}))

socket.init();
server.listen(configEnv.PORT, () => {
    console.log(`App running in port ${configEnv.PORT}`)
})
