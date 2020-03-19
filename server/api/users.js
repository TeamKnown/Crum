const router = require('express').Router()
const {User} = require('../db/models')
// const {adminOnly, selfOnly} = require('./utlis')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'userName', 'email', 'googleId']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})
