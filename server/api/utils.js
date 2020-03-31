const userOnly = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    console.log('This is a user only request')
    res.sendStatus(404)
  }
}

module.exports = {userOnly}
