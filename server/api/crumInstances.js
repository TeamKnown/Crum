const router = require('express').Router()
const {CrumInstance, Crum, User} = require('../db/models')
// const {adminOnly, selfOnly} = require('./utlis')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const crumInstances = await CrumInstance.findAll({})
    res.json(crumInstances)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    concole.log(req.body)
    const newCrumInstance = await CrumInstance.create(req.body)
    const user = await User.findByPk(req.query.userId)
    const crum = await Crum.findByPk(req.query.crumId)
    newCrumInstance.setUser(user)
    newCrumInstance.setCrum(crum)
    if (newCrumInstance) {
      res.json(newCrumInstance)
    }
  } catch (error) {
    next(error)
  }
})

// this post route takes three parameters: radium, latitude and longitude
// http://localhost:19001/api/cruminstances/nearme?radium=1000&latitudeIdx=407074&longitudeIdx=-740000
router.get('/nearme', async (req, res, next) => {
  console.log(req.query)
  try {
    const crumInstances = await CrumInstance.findNearMe(
      +req.query.radium,
      +req.query.latitudeIdx,
      +req.query.longitudeIdx
    )
    res.json(crumInstances)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const crumInstance = await CrumInstance.findByPk(req.params.id)
    res.json(crumInstance)
  } catch (err) {
    next(err)
  }
})

// this post route takes one parameters: the id of the cruminstances
//http://localhost:19001/api/cruminstances/near/1?radium=1
router.get('/near/:id', async (req, res, next) => {
  try {
    // console.log(req.query.radium)
    // const crumInstance = await CrumInstance.findByPk(req.params.id)
    const crumInstances = await crumInstance.findNear(+req.query.radium, {
      include: [
        {
          model: Crum
        }
      ]
    })
    res.json(crumInstances)
  } catch (err) {
    next(err)
  }
})
