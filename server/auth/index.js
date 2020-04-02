const router = require('express').Router()
const User = require('../db/models/user')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({where: {userName: req.body.userName}})
    if (!user) {
      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      res.status(401).send('Wrong username and/or password')
    } else {
      req.session.user = user
      req.login(user, err => (err ? next(err) : res.json(user)))
    }
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const checkUser = await User.findOne({where: {userName: req.body.userName}})

    if (checkUser) {
      res.status(401).send('User already exists')
    } else {
      const user = await User.create(req.body)

      req.login(user, err => (err ? next(err) : res.json(user)))
    }
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('Sequelize Error, User already exists')
    } else {
      next(err)
    }
  }
})

// DELETE /auth/logout 302 4.389 ms - 28
router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.json({})
  // res.redirect('/letustryit') // DELETE /login 404 2.556 ms - 147
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))
