const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')
// const {CrumInstance} = require('.')

const User = db.define('user', {
  userName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  googleId: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.ENUM(['admin', 'user']),
    defaultValue: 'user'
  },
  device: {
    type: Sequelize.ENUM(['noAR', 'standard', 'advanced']),
    defaultValue: 'standard'
  },
  totalCrums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  collectedCrums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  showSlidesAgain: {
    type: Sequelize.ENUM(['true', 'false']),
    defaultValue: 'true'
  }
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

/**
 * classMethods
 */
User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.beforeBulkCreate(users => {
  users.forEach(setSaltAndPassword)
})
