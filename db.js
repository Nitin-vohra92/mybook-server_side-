const Sequelize = require('sequelize')
const express = require('express')
const app = express()

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite'
});


const User = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNULL: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNULL: false
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING
})

const Product = db.define('products', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNULL: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  publishers: {
    type: Sequelize.STRING,
    allowNull: false
  },
  condition: {
    type: Sequelize.STRING,
    defaultValue: 'Good'
  },
  price: {
    type: Sequelize.FLOAT,
    allowNULL: false,
    defaultValue: 0.0
  },
  address: {
    type: Sequelize.TEXT,
    allowNULL: false
  },
  incart: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNULL: false
  }
})

db.sync()
  .then(() => console.log('database synced'))
  .catch((err) => console.log("error"))

exports = module.exports = {
  User, Product
}