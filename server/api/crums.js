const router = require('express').Router()
const {Crum} = require('../db/models')
// const {adminOnly, selfOnly} = require('./utlis')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const crums = await Crum.findAll({
      order: [['category', 'ASC']]
    })
    res.json(crums)
  } catch (err) {
    next(err)
  }
})
