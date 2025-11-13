const bodyParser = require('body-parser')
const express = require('express')

const ur = bodyParser.urlencoded({ extended : true})

lienRed = express.Router()
lienRed.get('/',ur, (req,res) => {
        res.render("form.ejs")     
    })
    
module.exports = lienRed