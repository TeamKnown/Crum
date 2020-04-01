const User = require('./user')
const Crum = require('./crum')
const CrumInstance = require('./crumInstance')
const CommentInstance = require('./commentInstance')
const {Op} = require('sequelize')

CrumInstance.belongsTo(User)
User.hasMany(CrumInstance)

User.hasMany(CrumInstance, {
  foreignKey: 'recipientId'
})

CrumInstance.belongsTo(User, {
  as: 'recipient',
  foreignKey: 'recipientId'
})

CommentInstance.belongsTo(CrumInstance)
CrumInstance.hasMany(CommentInstance)

CrumInstance.belongsTo(Crum)
Crum.hasMany(CrumInstance)

const SCALER = 1000
CrumInstance.addHook('beforeValidate', (crumInstance, options) => {
  crumInstance.latitudeIdx = Math.floor(crumInstance.latitude * SCALER)
  crumInstance.longitudeIdx = Math.floor(crumInstance.longitude * SCALER)
})

CrumInstance.findNearMe = async function(radium, latitudeIdx, longitudeIdx) {
  const near = await CrumInstance.findAll({
    include: [
      {
        model: Crum
      },
      {
        model: User
      },
      {
        model: CommentInstance
      },
      {
        model: User,
        as: 'recipient'
      }
    ],
    where: {
      latitudeIdx: {
        [Op.lte]: latitudeIdx + radium,
        [Op.gte]: latitudeIdx - radium
      },
      longitudeIdx: {
        [Op.lte]: longitudeIdx + radium,
        [Op.gte]: longitudeIdx - radium
      },
      status: 'floating'
    }
  })
  return near
}

User.prototype.userCrums = async function() {
  const crums = await this.getCrumInstances()
  this.totalCrums = crums.length
  this.save()
  return crums.length
}

User.prototype.crumsCollected = async function() {
  const crums = await CrumInstance.findAll({
    where: {
      recipientId: this.id,
      status: 'collected'
    }
  })
  this.collectedCrums = crums.length
  this.save()
  return crums.length
}

module.exports = {
  User,
  Crum,
  CrumInstance,
  CommentInstance
}
