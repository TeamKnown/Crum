const Sequelize = require('sequelize')
const db = require('../db')

const CommentInstance = db.define('CommentInstance', {
  message: {
    type: Sequelize.TEXT
  },
  numUpVote: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  numDownVote: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

module.exports = CommentInstance
