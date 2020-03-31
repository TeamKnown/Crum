const router = require('express').Router()
const {userOnly} = require('./utils')
const {Crum} = require('../db/models')
module.exports = router

router.get('/', userOnly, async (req, res, next) => {
  try {
    const crums = await Crum.findAll({
      order: [['category', 'ASC']]
    })
    res.json(crums)
  } catch (err) {
    next(err)
  }
})
