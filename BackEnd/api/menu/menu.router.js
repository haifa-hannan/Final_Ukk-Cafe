const express = require('express')
const app = express()
app.use(express.json())
const  menuController = require('./menu.controller')
const { getAllMenu } = require('./menu.controller')
const { getMenuByID } = require('./menu.controller')
const { addMenu } = require('./menu.controller')
const { updateMenu } = require('./menu.controller')


const {AuthUser, AuthAdmin} = require('../../middleware/AuthUser')

app.get("/", AuthUser, getAllMenu)
app.post("/find", AuthUser, menuController.findMenu)
app.get("/:id", AuthUser, getMenuByID)
// app.post("/", [upload.single(`images`)], addMenu)
app.post("/", AuthUser, addMenu)
app.put("/:id", AuthUser, menuController.updateMenu)
app.delete("/:id", AuthUser, menuController.deleteMenu)


module.exports = app