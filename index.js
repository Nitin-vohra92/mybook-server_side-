const express = require('express')
const app = express()
const Product = require('./db').Product
const User = require('./db').User
const path = require('path')
const hbs = require('hbs')
const bodyParser=require("body-parser")
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')


app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

hbs.registerPartials(path.join(__dirname, '/partials'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname + '/public'))





passport.use('local',new LocalStrategy(
  function (username, password, done) {
    User.findOne({
      where: {username: username}
    }).then(function (user) {
      if (user) {
        return done(null, user,{
          message: 'Already exists'
        });
      }
      else{
        var data={
          username:username,
          password:password
        };
      
        User.create(data).then(function(newUser, created) {
 
            if (!newUser) {
 
                return done(null, false);
 
            }
 
            if (newUser) {
 
                return done(null, newUser);
 
            }
 
        });
 
    }
 
})
  }));

app.use(session({
  secret: 'nobody can guess',
  saveUninitialized: true,
  resave: false,
  cookie: { secure: false }
}))


app.use(passport.initialize())
app.use(passport.session())
/*
passport.serializeUser((user, done) => {
  return done(null, user)
})

passport.deserializeUser((user, done) => {
  return done(null, user)
})
*/
//serialize
passport.serializeUser(function(user, done) {
 
  return done(null, user);

});

// deserialize user 
passport.deserializeUser(function(user, done) {
 
  return done(null, user)
})

app.get('/', (req, res) => {
  Product.findAll()
    .then(function (products) {
      res.render('index', { products })

    })
})



app.get('/add', (req, res) => {
  res.render('add')
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


app.get('/', (req, res) => {
  res.render('index', { user: req.user })
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.listen(8060)


































































