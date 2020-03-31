const router = require('express').Router()
const {userOnly} = require('./utils')
const {CrumInstance, Crum, User, CommentInstance} = require('../db/models')
module.exports = router

// https://sequelize.org/master/manual/eager-loading.html no way to condense it
router.get('/', userOnly, async (req, res, next) => {
  try {
    const crumInstances = await CrumInstance.findAll(
      {
        include: [
          {
            model: User
          },
          {
            model: Crum
          },
          {
            model: CommentInstance
          },
          {
            model: User,
            as: 'recipient'
          }
        ]
      },
      {
        where: {
          status: 'floating'
        }
      }
    )
    res.json(crumInstances)
  } catch (err) {
    next(err)
  }
})

const computeLocation = (headingInt, latitude, longitude) => {
  const headingRadian = (headingInt * 3.24) / 180
  const rtnLatitude = latitude + (Math.cos(headingRadian) * 20) / 6356000
  const rtnLongitude =
    longitude +
    (Math.sin(headingRadian) * 20) /
      (6356000 * Math.cos((longitude * 2 * 3.14) / 360))
  return {latitude: rtnLatitude, longitude: rtnLongitude}
}

// POST /api/cruminstances?userId=11&crumId=21&direction=front
router.post('/', userOnly, async (req, res, next) => {
  if (req.user.id !== +req.query.userId) {
    console.log('Do not drop on other user behalf')
    res.sendStatus(404)
  }
  try {
    const computedLocation = computeLocation(
      req.body.headingInt,
      req.body.latitude,
      req.body.longitude
    )
    const newCrumInstance = await CrumInstance.create({
      ...req.body,
      latitude: computedLocation.latitude,
      longitude: computedLocation.longitude
    })
    const user = await User.findByPk(req.query.userId)
    await newCrumInstance.setUser(user)

    const crum = await Crum.findByPk(req.query.crumId)
    await newCrumInstance.setCrum(crum)

    const returnVal = newCrumInstance.dataValues
    returnVal.crum = crum.dataValues
    returnVal.user = user.dataValues
    returnVal.CommentInstances = []
    if (req.body.recipient !== '') {
      const recipient = await User.findOne({
        where: {userName: req.body.recipient}
      })
      await newCrumInstance.setRecipient(recipient)
      returnVal.recipient = recipient.dataValues
    }

    if (newCrumInstance) {
      res.json(returnVal)
    }
  } catch (error) {
    next(error)
  }
})

// this post route takes three parameters: radium, latitude and longitude
// http://localhost:19001/api/cruminstances/nearme?radium=1000&latitudeIdx=40707&longitudeIdx=-74000
router.get('/nearme', userOnly, async (req, res, next) => {
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
router.get('/:id', userOnly, async (req, res, next) => {
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
        },
        {
          model: User,
          as: 'recipient'
        }
      ]
    })
    res.json(crumInstance)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/cruminstances/38
router.delete('/:id', userOnly, async (req, res, next) => {
  try {
    const crumInstance = await CrumInstance.findByPk(req.params.id, {
      include: [
        {
          model: User,
          where: {id: req.user.id}
        }
      ]
    })
    await crumInstance.destroy()
    res.json({})
  } catch (err) {
    next(err)
  }
})
// PUT /api/cruminstances/37
router.put('/collect/:id', userOnly, async (req, res, next) => {
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
        },
        {
          model: User,
          as: 'recipient',
          where: {id: req.user.id}
        }
      ]
    })
    await crumInstance.update({status: 'collected'})
    res.json(crumInstance)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', userOnly, async (req, res, next) => {
  try {
    const crumInstance = await CrumInstance.findByPk(req.params.id, {
      include: [
        {
          model: Crum
        },
        {
          model: User,
          where: {id: req.user.id}
        },
        {
          model: CommentInstance
        },
        {
          model: User,
          as: 'recipient'
        }
      ]
    })
    await crumInstance.update(req.body)
    res.json(crumInstance)
  } catch (err) {
    next(err)
  }
})

router.get('/user/:id', userOnly, async (req, res, next) => {
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
        },
        {
          model: User,
          as: 'recipient'
        }
      ],
      where: {
        userId: req.params.id
        // status: 'floating'
      }
    })
    res.json(crumInstance)
  } catch (err) {
    next(err)
  }
})
