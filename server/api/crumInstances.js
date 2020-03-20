const router = require('express').Router()
const {CrumInstance} = require('../db/models')
// const {adminOnly, selfOnly} = require('./utlis')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    // console.dir(ip.address())
    // console.log('GET ROUTE HITTING')
    const crumInstances = await CrumInstance.findAll({})
    res.json(crumInstances)
  } catch (err) {
    next(err)
  }
})

// http://localhost:19001/api/cruminstances/nearme?radium=1000&latitudeIdx=407074&longitudeIdx=-740000

router.post('/', async (req, res, next) => {
  try {
    const newCrumInstance = await CrumInstance.create(req.body, {
      include: [
        {
          model: Crum
        }
      ]
    })
    if (newCrumInstance) {
      res.json(newCrumInstance)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/nearme', async (req, res, next) => {
  try {
    const crumInstances = await CrumInstance.findNearMe(
      +req.query.radium,
      +req.query.latitudeIdx,
      +req.query.longitudeIdx
    )
    res.json(crumInstances)
    // res.json({})
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

//http://localhost:19001/api/cruminstances/near/1?radium=1
router.get('/near/:id', async (req, res, next) => {
  try {
    console.log(req.query.radium)
    const crumInstance = await CrumInstance.findByPk(req.params.id)
    const crumInstances = await crumInstance.findNear(+req.query.radium)
    res.json(crumInstances)
  } catch (err) {
    next(err)
  }
})
//http://localhost:19001/api/cruminstances/near/?radium=1&altitude=-74.00564098060971