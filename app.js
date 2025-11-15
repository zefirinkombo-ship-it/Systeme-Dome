const bodyParser = require("body-parser")
const express = require('express')
const lien = require('./RED/Red')
const Api = require('./API/api')


const app = express()

    app.use(lien)
    app.use(Api)

    app.set("views","./Back-end")
    app.set("view engine", "ejs")
    app.use(express.static("./Back-end/Public"))
    
    const PORT = process.env.PORT || 8080
    app.listen(PORT , () => {
        console.log('Serveur en ligne')
})

 


