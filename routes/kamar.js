const express = require('express')
// var body = require("body-parser");

const app = express()

app.use(express.json())

var bodyParser = require("body-parser");
app.use(bodyParser.json());
// // penggunaan body-parser untuk ekstrak data request dari body
app.use(bodyParser.urlencoded({extended: true}));

const roomController = require("../controllers/kamar.controller");
// const upload = require('../controller/upload-cover');
const auth = require(`../auth/auth`)

app.get("/getAll", auth.authVerify, roomController.getAllKamar)
app.post("/getAvailable", auth.authVerify, roomController.availableRoom)
app.post("/find", auth.authVerify, roomController.findKamar)
app.post("/add", auth.authVerify, roomController.addKamar)
app.delete("/:id",auth.authVerify, roomController.deleteKamar)
app.put("/update/:id", auth.authVerify, roomController.updateKamar)

module.exports=app