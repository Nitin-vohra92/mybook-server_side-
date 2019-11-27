  
const express = require('express')
const app = express()
const Product = require('./db').Product
const User = require('./db').User
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const path = require('path')
const hbs = require('hbs')
const bodyParser = require("body-parser")
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')


app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

hbs.registerPartials(path.join(__dirname, '/partials'))

//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname + '/public'))



app.use(session({
  secret: 'nobody can guess',
  saveUninitialized: true,
  resave: false,
  cookie: { secure: false,
  maxAge:6000000 },
  
}))


app.use(passport.initialize())
app.use(passport.session())


passport.use('local', new LocalStrategy(
  function (username, password, done) {
    User.findOne({
      where: { username: username }
    }).then(function (user) {
      if (!user) {
        return done(null,false,{message:"No such user"})
      }
      if(user.password !== password) {
        return res.done(null,false,{message:"Wrong password"})
      }
      return done(null,user)
    }).catch((err)=>{
      return done(err)
    })
    }))
       

/*
passport.serializeUser((user, done) => {
  return done(null, user)
})
passport.deserializeUser((user, done) => {
  return done(null, user)
})
*/
//serialize
passport.serializeUser(function (user, done) {

  return done(null, user.username);

});

// deserialize user 
passport.deserializeUser(function (username, done) {
  User.findOne({
    username:username
  }).then((user)=>{
    if(!user){
      return done(new Error("No such user"))
    }
    return done(null,user)
  }).catch((err)=>{
    done(err)
  })
  
})

app.get('/', (req, res) => {
  if(req.user)
  {
    Product.findAll()
    .then(function (products) {
      res.render('index', { products })

    })
  }
  else{
    res.redirect('/signup')
  }
 
})


app.get('/add', (req, res) => {
  res.render('add')
})


app.get('/cart', (req, res) => {
  Product.findAll({ where: { incart: { [Op.gt]: 0 } } }).
    then(function (products) {
      res.render('cart', { products })
    })
})

app.post('/add', (req, res) => {
  Product.create({
    name: req.body.name,
    publishers: req.body.publishers,
    condition: req.body.condition,
    price: req.body.price,
    address: req.body.address
  })
  res.redirect('/add')
})



app.post('/cart', (req, res) => {
  Product.update({ incart: Sequelize.literal('incart+1') },
    { where: { name: req.body.name,
               } })
  res.redirect('/');
})

app.get('/cart/delete/:name',(req,res)=>{
Product.update({ incart: Sequelize.literal('incart-1') },
{ where: { name: req.params.name,
           } })
res.redirect('/cart');
})

app.get('/cart/delete-all/:name',(req,res)=>{
  Product.update({ incart: Sequelize.literal('0') },
  { where: { name: req.params.name,
             } })
  res.redirect('/cart');
  })
  

/*
app.get('/', (req, res) => {
  if(req.user)
  res.render('index', { user: req.user })
  else{
    res.redirect('/login')
  }
})
*/
app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/signup',(req,res)=>{
  res.render('signup')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/signup'
}))


/*
app.post('/login',(req,res)=>{
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then((user)=>{
    if(!user){
      return res.send("No such user")
    }
    if(user.password !== req.body.password){
      return res.send("Wrong password")
    }
    return res.send("HEllo " + user.firstName )
  })
})
*/
app.post('/signup',(req,res)=>{
  User.create({
    username:req.body.username,
    password:req.body.password,
    firstName:req.body.firstName,
    lastName:req.body.lastName
  }).then((createdUser) => {
    res.redirect('/login')
  })
})

app.listen(8060)