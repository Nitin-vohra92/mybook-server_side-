const express = require('express')
const app = express()
const Product =require('./db').Product


app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname + '/public'))

app.get('/',(req,res)=>{
    Product.findAll()
    .then(function(products){
        res.render('index',{ products })
        
    })
})



app.listen(8060)


































































