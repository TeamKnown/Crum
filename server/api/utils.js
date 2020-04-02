const userOnly = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.sendStatus(404)
  }
}

module.exports = {userOnly}
