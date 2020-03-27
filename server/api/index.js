const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/crums', require('./crums'))
router.use('/crumInstances', require('./crumInstances'))
router.use('/commentInstances', require('./commentInstances'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
