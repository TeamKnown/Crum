const router = require('express').Router()
const {userOnly} = require('./utils')
const {CrumInstance, CommentInstance} = require('../db/models')
module.exports = router

// localhost:19001/api/commentinstances/
router.get('/', userOnly, async (req, res, next) => {
  try {
    const commentInstances = await CommentInstance.findAll({
      include: [
        {
          model: CrumInstance
        }
      ]
    })
    res.json(commentInstances)
  } catch (err) {
    next(err)
  }
})

// /api/commentinstances?crumInstanceId=1
router.post('/', async (req, res, next) => {
  try {
    const newCommentInstance = await CommentInstance.create(req.body)
    const crumInstance = await CrumInstance.findByPk(req.query.crumInstanceId)
    await newCommentInstance.setCrumInstance(crumInstance)

    if (newCommentInstance) {
      res.json(newCommentInstance)
    }
  } catch (error) {
    next(error)
  }
})
