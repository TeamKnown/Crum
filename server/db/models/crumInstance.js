const Sequelize = require('sequelize')
const db = require('../db')

const CrumInstance = db.define('crumInstance', {
  message: {
    type: Sequelize.TEXT
  },
  latitude: {
    type: Sequelize.DECIMAL(10, 4)
  },
  longitude: {
    type: Sequelize.DECIMAL(10, 4)
  },
  latitudeIdx: {
    type: Sequelize.INTEGER
  },
  longitudeIdx: {
    type: Sequelize.INTEGER
  },
  headingInt: {
    type: Sequelize.INTEGER
  },
  status: {
    type: Sequelize.ENUM(['floating', 'collected']),
    defaultValue: 'floating'
  },
  numLeft: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  numDropped: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  fromId: {
    type: Sequelize.INTEGER
  }
})

module.exports = CrumInstance
