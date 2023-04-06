const express = require(`express`)
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000
const cors = require(`cors`)
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
    "/",
    express.static(__dirname)
);

const userRoute = require('./routes/user')
app.use('/user', userRoute)

const tipe_kamarRoute = require('./routes/tipe_kamar')
app.use('/tipekamar', tipe_kamarRoute)

const kamarRoute = require('./routes/kamar')
app.use('/kamar', kamarRoute)

const pemesananRoute = require('./routes/pemesanan')
app.use('/pesan', pemesananRoute)

app.listen(PORT, () => {
    console.log(`Server of Wikusama Hotel runs on port
    ${PORT}`)   
})