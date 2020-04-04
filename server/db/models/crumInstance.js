const Sequelize = require('sequelize')
const db = require('../db')

const CrumInstance = db.define('crumInstance', {
  message: {
    type: Sequelize.TEXT
  },
  latitude: {
    type: Sequelize.DECIMAL(10, 6)
  },
  longitude: {
    type: Sequelize.DECIMAL(10, 6)
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
  },
  isPrivate: {
    type: Sequelize.BOOLEAN
  }
})

module.exports = CrumInstance
