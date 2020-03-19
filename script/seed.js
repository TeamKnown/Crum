'use strict'

const {green, red} = require('chalk')
const db = require('../server/db')
const {User, Crumb, CrumbInstance} = require('../server/db/models')

const seed = async () => {
  try {
    await db.sync({force: true})
    console.log('db synced!')
  } catch (error) {
    console.log(red(error))
  }

  console.log(`seeded successfully`)
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
