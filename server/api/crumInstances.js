/* eslint-disable complexity */
const router = require('express').Router()
const {userOnly} = require('./utils')
const {CrumInstance, Crum, User, CommentInstance} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const crumInstances = await CrumInstance.findAll(
      {
        include: {all: true}
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
router.post('/', async (req, res, next) => {
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
      include: {all: true}
    })
    res.json(crumInstance)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/cruminstances/38
router.delete('/:id', async (req, res, next) => {
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
router.put('/collect/:id', async (req, res, next) => {
  try {
    const crumInstance = await CrumInstance.findByPk(
      req.params.id,
      {
        include: {all: true}
      },
      {where: {status: 'floating'}}
    )
    if (crumInstance.recipient && req.user.id !== crumInstance.recipient.id) {
      res.sendStatus(404)
    }
    if (crumInstance.recipient) {
      await crumInstance.update({status: 'collected'})
      res.json({collected: crumInstance.id})
    }
    if (!crumInstance.recipient && crumInstance.numLeft === 1) {
      await crumInstance.update({status: 'collected'})
      const recipient = await User.findByPk(req.user.id)
      crumInstance.setRecipient(recipient)
      crumInstance.reload()
      res.json({collected: crumInstance.id})
    }
    if (!crumInstance.recipient && crumInstance.numLeft > 1) {
      const count = crumInstance.numLeft
      await crumInstance.update({numLeft: count - 1})

      crumInstance.reload()

      let crumInstanceNew = await CrumInstance.create({
        message: crumInstance.message,
        status: 'collected',
        numLeft: 1,
        longitudeIdx: crumInstance.longitudeIdx,
        latitudeIdx: crumInstance.latitudeIdx,
        longitude: crumInstance.longitude,
        latitude: crumInstance.latitude,
        heading: crumInstance.heading,
        fromId: crumInstance.id
      })
      await crumInstanceNew.save()
      await crumInstanceNew.setCrum(await crumInstance.getCrum())
      await crumInstanceNew.setUser(await crumInstance.getUser())
      const recipient = await User.findByPk(req.user.id)
      crumInstanceNew.setRecipient(recipient)
      res.json({collected: crumInstanceNew.id, remaining: crumInstance.id})
    }
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const crumInstance = await CrumInstance.findByPk(req.params.id, {
      include: {all: true},
      where: {
        userId: req.params.id
      }
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
      include: {all: true},
      where: {
        userId: req.params.id
      }
    })
    res.json(crumInstance)
  } catch (err) {
    next(err)
  }
})

router.get('/collect/:id', async (req, res, next) => {
  try {
    const crumInstance = await CrumInstance.findAll({
      include: {all: true},
      where: {
        recipientId: req.params.id,
        status: 'collected'
      }
    })
    res.json(crumInstance)
  } catch (err) {
    next(err)
  }
})
