const Sequelize = require('sequelize')
const db = require('../db')
const {Op} = require('sequelize')

const CrumInstance = db.define('crumInstance', {
  title: {
    type: Sequelize.TEXT
  },
  description: {
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
  }
})

CrumInstance.addHook('beforeValidate', (CrumInstance, options) => {
  CrumInstance.latitudeIdx = Math.floor(CrumInstance.latitude * 10000)
  CrumInstance.longitudeIdx = Math.floor(CrumInstance.longitude * 10000)
})

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
  // console.log('here', this.longitudeIdx)
  const near = await CrumInstance.findAll({
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

module.exports = CrumInstance
