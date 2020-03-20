const db = require('./db')
const User = require('./models/user')
const Crum = require('./models/crum')
const CrumInstance = require('./models/crumInstance')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */

// Crum.belongsTo(User)
// User.hasMany(Crum)

// CrumInstance.belongsTo(Crum)
// Crum.hasMany(CrumInstance)

// Crum.belongsToMany(User, {through: CrumInstance})
// User.belongsToMany(Crum, {through: CrumInstance})

// register models
require('./models')

module.exports = db
