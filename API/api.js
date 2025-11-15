const { writeFile , stat} = require('node:fs/promises')
const bodyParser = require('body-parser')
const { readFile } = require('node:fs')
const express = require('express')

const ur = bodyParser.urlencoded({ extended : true})
const ParsJson = bodyParser.json()

POST = express.Router()
POST.post('/submit', ParsJson, ur ,(req,res) => {

    readFile(__dirname +"/File.json", 'utf8', (err,data) =>{            
        const js = JSON.parse(data)       
        const name = "Nirvana_Do", Pass = "3761"
        const nom = req.body.nom, MotsPass = req.body.pass 
            if(nom === name && MotsPass === Pass){
                res.render("Syst.ejs",{js})                  
            }else{  
                res.send('400')
            }   
    })
})

POST.post('/submit/api', ParsJson, ur, (req,res) => {

    const js = JSON.stringify(req.body) 
    res.json(js).status(202)
    writeFile('./API/file.json', `${js}`)
})
    
POST.post("/api",ParsJson,ur,(req,res) => {
    const r = '{"Salut": "nirva"}'
    res.json(r).status(203)
    console.log('Login Serveur')
})

module.exports = POST


