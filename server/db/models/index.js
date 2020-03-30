const User = require('./user')
const Crum = require('./crum')
const CrumInstance = require('./crumInstance')
const CommentInstance = require('./CommentInstance')
const {Op} = require('sequelize')
/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */

CrumInstance.belongsTo(User)
User.hasMany(CrumInstance)

// CommentInstance.belongsTo(User)
// User.hasMany(CommentInstance)

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
      }
    }
  })
  return near
}

module.exports = {
  User,
  Crum,
  CrumInstance,
  CommentInstance
}
