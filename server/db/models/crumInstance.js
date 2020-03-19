const Sequelize = require('sequelize')
const db = require('../db')

const CrumInstance = db.define('crumInstance', {
  text: {
    type: Sequelize.TEXT
  },
  latitude: {
    type: Sequelize.DECIMAL
  },
  longitude: {
    type: Sequelize.DECIMAL
  },
  latitudeIdx: {
    type: Sequelize.INTEGER
  },
  longitudeIdx: {
    type: Sequelize.INTEGER
  }
})

module.exports = CrumInstance
