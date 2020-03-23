const User = require('./user')
const Crum = require('./crum')
const CrumInstance = require('./crumInstance')
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

CrumInstance.belongsTo(Crum)
Crum.hasMany(CrumInstance)

CrumInstance.prototype.findNear = async function(radium) {
  // console.log('here', this.longitudeIdx)
  const near = await CrumInstance.findAll({
    where: {
      latitudeIdx: {
        [Op.lte]: this.latitudeIdx + radium,
        [Op.gte]: this.latitudeIdx - radium
      },
      longitudeIdx: {
        [Op.lte]: this.longitudeIdx + radium,
        [Op.gte]: this.longitudeIdx - radium
      }
    }
  })
  return near
}

CrumInstance.findNearMe = async function(radium, latitudeIdx, longitudeIdx) {
  console.log('here', this.longitudeIdx)
  const near = await CrumInstance.findAll({
    include: [
      {
        model: Crum
      },
      {
        model: User
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
  CrumInstance
}
