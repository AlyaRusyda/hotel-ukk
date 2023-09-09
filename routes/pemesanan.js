const express = require('express')
// var body = require("body-parser");

const app = express()

app.use(express.json())

var bodyParser = require("body-parser");
app.use(bodyParser.json());
// // penggunaan body-parser untuk ekstrak data request dari body
app.use(bodyParser.urlencoded({extended: true}));

const pemesananController = require("../controllers/pemesanan.controller")
// const upload = require('../controller/upload-cover');
const auth = require(`../auth/auth`)

app.get("/getAll", auth.authVerify, pemesananController.getAllPemesanan)
app.get("/find",auth.authVerify, pemesananController.find)
app.get("/getByUser/:id", auth.authVerify, pemesananController.getByUser)
app.post("/",auth.authVerify, pemesananController.addPemesanan)
app.delete("/:id", auth.authVerify, pemesananController.deletePemesanan)
app.put("/:id", auth.authVerify, pemesananController.updatePemesanan)
app.put("/status/:id", auth.authVerify, pemesananController.updateStatusBooking)
app.get("/get/:id", auth.authVerify, pemesananController.getPemesananById)

module.exports=app