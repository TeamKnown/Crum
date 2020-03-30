const router = require('express').Router()
const {User, CrumInstance} = require('../db/models')
// const {adminOnly, selfOnly} = require('./utlis')
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

router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: ['id', 'userName', 'email', 'type', 'device'],
      include: [
        {
          model: CrumInstance
        }
      ]
    })
    // console.log('server side ', user.dataValues.CrumInstances.length)
    // console.log('server side ', user.dataValues.totalCrums)
    // user.reload()
    await user.userCrums()
    // console.log('server side ', user.dataValues.totalCrums)

    // console.log('server side ', user.dataValues.CrumInstance.length)
    console.log('in get ', user.dataValues.totalCrums)
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
