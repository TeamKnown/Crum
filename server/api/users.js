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
