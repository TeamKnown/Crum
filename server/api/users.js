const router = require('express').Router()
const {User, CrumInstance} = require('../db/models')
// const {adminOnly, selfOnly} = require('./utlis')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'userName', 'email', 'type'],
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
      attributes: ['id', 'userName', 'email', 'type'],
      include: [
        {
          model: CrumInstance
        }
      ]
    })
    await user.userCrums()
    user.reload()
    // console.log('server side ', user)
    res.json(user)
  } catch (error) {
    next(error)
  }
})
