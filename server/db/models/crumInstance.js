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
  altitude: {
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
  }
})

module.exports = CrumInstance
