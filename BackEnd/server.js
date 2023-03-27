const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const cors = require('cors')

const app = express();
dotenv.config()

app.use(express())
app.use(bodyParser.json())
app.use(cors())

// const Role = require('./api/role/role.router')
// app.use('/api/role', Role)

const User = require('./api/user/user.router')
app.use('/api/user', User)

const Menu = require('./api/menu/menu.router')
app.use('/api/menu', Menu)

const Meja = require('./api/meja/meja.router')
app.use('/api/meja', Meja)

const Transaksi = require('./api/transaksi/transaksi.router')
app.use('/api/transaksi', Transaksi)

app.listen(3000)
console.log("server run at port 3000")