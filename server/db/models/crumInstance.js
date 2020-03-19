const Sequelize = require('sequelize')
const db = require('../db')

const CrumInstance = db.define('crumInstance', {
  text: {
    type: Sequelize.TEXT,
  }
})

module.exports = CrumInstance
