const express = require('express')
const app = express()
const Product =require('./db').Product
const path = require('path')
const hbs = require('hbs')


app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

hbs.registerPartials(path.join(__dirname, '/partials' ))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname + '/public'))

app.get('/',(req,res)=>{
    Product.findAll()
    .then(function(products){
        res.render('index',{ products })
        
    })
})

app.get('/add', (req, res) => {
    res.render('add')
  })

  app.post('/add',(req,res)=>{
      Product.create({
        name: req.body.name,
        publishers: req.body.publishers,
        condition:req.body.condition,
        price:req.body.price,
        address:req.body.address
      })
      res.redirect('/index')
  })


app.listen(8060)


































































