const router = require('express').Router()
const {CrumInstance, Crum, User, CommentInstance} = require('../db/models')
// const {adminOnly, selfOnly} = require('./utlis')
module.exports = router

// https://sequelize.org/master/manual/eager-loading.html no way to condense it
router.get('/', async (req, res, next) => {
  try {
    const crumInstances = await CrumInstance.findAll({
      include: [
        {
          model: User
        },
        {
          model: Crum
        },
        {
          model: CommentInstance
        }
      ]
    })
    res.json(crumInstances)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const newCrumInstance = await CrumInstance.create({
      ...req.body
    })

    const user = await User.findByPk(req.query.userId)
    const crum = await Crum.findByPk(req.query.crumId)
    await newCrumInstance.setUser(user)
    await newCrumInstance.setCrum(crum)
    await user.reload()
    await user.userCrums()
    const returnVal = newCrumInstance.dataValues
    returnVal.crum = crum.dataValues
    returnVal.user = user.dataValues
    returnVal.CommentInstances = []
    if (newCrumInstance) {
      res.json(returnVal)
    }
  } catch (error) {
    next(error)
  }
})

// this post route takes three parameters: radium, latitude and longitude
// http://localhost:19001/api/cruminstances/nearme?radium=1000&latitudeIdx=40707&longitudeIdx=-74000
router.get('/nearme', async (req, res, next) => {
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

//http://localhost:19001/api/cruminstances/66
router.get('/:id', async (req, res, next) => {
  try {
    const crumInstance = await CrumInstance.findByPk(req.params.id, {
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
      ]
    })
    res.json(crumInstance)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const crumInstance = await CrumInstance.findByPk(req.params.id)
    await crumInstance.destroy()
    res.json({})
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const crumInstance = await CrumInstance.findByPk(req.params.id, {
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
      ]
    })
    await crumInstance.update(req.body)
    res.json(crumInstance)
  } catch (err) {
    next(err)
  }
})

router.get('/user/:id', async (req, res, next) => {
  try {
    const crumInstance = await CrumInstance.findAll({
      include: [
        {
          model: User
        },
        {
          model: Crum
        },
        {
          model: CommentInstance
        }
      ],
      where: {
        userId: req.params.id
      }
    })
    res.json(crumInstance)
  } catch (err) {
    next(err)
  }
})

// this post route takes one parameters: the id of the cruminstances
//http://localhost:19001/api/cruminstances/near/1?radium=1
router.get('/near/:id', async (req, res, next) => {
  try {
    const crumInstances = await crumInstance.findNear(+req.query.radium, {
      include: [
        {
          model: Crum
        },
        {
          model: CommentInstance
        }
      ]
    })
    res.json(crumInstances)
  } catch (err) {
    next(err)
  }
})
