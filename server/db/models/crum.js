const Sequelize = require('sequelize')
const db = require('../db')

const Crum = db.define('crum', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  imageUrl: {
    type: Sequelize.STRING,
  }
})

module.exports = Crum
