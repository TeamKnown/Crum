const router = require('express').Router()
const {User, CrumInstance} = require('../db/models')
const {userOnly} = require('./utils')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'userName', 'email', 'type', 'device'],
      include: [
        {
          model: CrumInstance
        }
      ]
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/userCollectedThis/', userOnly, async (req, res, next) => {
  try {
    const crusInstance = await CrumInstance.findOne({
      where: {recipientId: req.query.userId, fromId: req.query.crumInstanceId}
    })
    if (crusInstance) {
      res.json({exists: true})
    } else {
      res.json({exists: false})
    }
  } catch (err) {
    next(err)
  }
})

router.get('/exists/', userOnly, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {userName: req.query.userName}
    })
    if (user) {
      res.json({exists: true})
    } else {
      res.json({exists: false})
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'userName', 'email', 'type', 'device'],
      include: [
        {
          model: CrumInstance
        }
      ]
    })

    await user.userCrums()
    await user.crumsCollected()
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const currentUser = await User.findByPk(req.params.id)
    const updatedUser = await currentUser.update(req.body)

    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
})
