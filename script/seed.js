'use strict'

const {green, red} = require('chalk')
const db = require('../server/db')
const {
  User,
  Crum,
  CrumInstance,
  CommentInstance
} = require('../server/db/models')
const crums = require('./crumSeed')

const users = [
  {
    userName: 'Admin',
    email: 'admin@gmail.com',
    password: 'test1',
    salt: null,
    type: 'admin'
  },
  {
    userName: 'Sharline',
    email: 'scroney1@state.tx.us',
    password: 'gFXBSSV1',
    salt: null
  },
  {
    userName: 'MosheB',
    email: 'mbtham2@angelfire.com',
    password: 'JxmEPQKq0JW4',
    salt: null
  },
  {
    userName: 'FMuffen',
    email: 'fmuffen3@japanpost.jp',
    password: 'NOFv1iBo',
    salt: null
  },
  {
    userName: 'JKleis',
    email: 'jkleis4@google.fr',
    password: 'Drc5fO2',
    salt: null
  },
  {
    userName: 'MCunniffe',
    email: 'mcunniffe5@who.int',
    password: 'vs99rzUHHP',
    salt: null
  },
  {
    userName: 'AmelineA',
    email: 'aandrieu6@google.es',
    password: 'jHm15tU',
    salt: null
  },
  {
    userName: 'CHeald',
    email: 'cheald7@meetup.com',
    password: 'aRlDbxDYsFD',
    salt: null
  },
  {
    userName: 'EBirtwell',
    email: 'ebirtwell8@storify.com',
    password: 'M0oDOqBw4e',
    salt: null
  },
  {
    userName: 'KCarlisle',
    email: 'kcarlisle9@fotki.com',
    password: 'NERY7QB2pRqy',
    salt: null
  },

  {
    userName: 'Peter',
    email: 'Peter@gmail.com',
    password: 'Peter',
    salt: null
  },
  {
    userName: 'Mark',
    email: 'Mark@gmail.com',
    password: 'Mark',
    salt: null
  },
  {
    userName: 'Thomas',
    email: 'Thomas@gmail.com',
    password: 'Thomas',
    salt: null
  },
  {
    userName: 'April',
    email: 'April@gmail.com',
    password: 'April',
    salt: null
  },
  {
    userName: 'Dad',
    email: 'dad@gmail.com',
    password: 'yesDad',
    salt: null
  },
  {
    userName: 'Mom',
    email: 'mom@gmail.com',
    password: 'yesMom',
    salt: null
  },
  {
    userName: 'grandpa',
    email: 'grandpa@gmail.com',
    password: 'yesGrandpa',
    salt: null
  },
  {
    userName: 'grandma',
    email: 'grandma@gmail.com',
    password: 'yesGrandma',
    salt: null
  },
  {
    userName: 'Baby',
    email: 'Baby@gmail.com',
    password: 'yesBaby',
    salt: null
  }
]

const crumInstances = [
  {
    message: 'Every Day is Fathers Day',
    latitude: 40.7185,
    longitude: -73.9743,
    status: 'collected'
  },
  {
    message: 'Please no more...',
    latitude: 40.7077,
    longitude: -74.0112,
    status: 'collected'
  },
  {
    message: 'Beautiful Day!',
    latitude: 40.776,
    longitude: -73.9689,
    status: 'collected'
  },
  {
    message: 'Where is everyone?',
    latitude: 40.7075,
    longitude: -74.0092,
    crumId: 19,
    userId: 2
  },
  {
    message: 'What a show!',
    latitude: 40.7213,
    longitude: -73.9932,
    status: 'collected'
  },
  {
    message: 'hope you like chocolate',
    latitude: 40.7053,
    longitude: -74.0056
    // crumId: 6,
    // userId: 7
  },
  {
    message: 'out for a walk',
    latitude: 40.7222,
    longitude: -73.9539,
    status: 'collected'
  },
  {
    message: 'going out for ice cream',
    latitude: 40.6763,
    longitude: -73.8752,
    status: 'collected'
  },
  {
    message: 'reading the new sutter cane',
    latitude: 40.6812,
    longitude: -73.9955
  },
  {
    message: 'sandwich time',
    latitude: 40.7269,
    longitude: -73.8773
  },
  {
    message: 'for the dads',
    latitude: 40.72357,
    longitude: -73.9831
  },
  {
    message: 'for april testing',
    latitude: 40.70756,
    longitude: -74.00579
  },
  {
    message: 'for april testing',
    latitude: 40.70755,
    longitude: -74.0057
  }
]

const seed = async () => {
  try {
    await db.sync({force: true})
    console.log('db synced!')
    await Promise.all(users.map(user => User.create(user)))
    await Promise.all(crums.map(crum => Crum.create(crum)))

    await Promise.all(
      crumInstances.map(crumInstance => CrumInstance.create(crumInstance))
    )
    for (let i = 1; i < crumInstances.length + 1; i++) {
      let j = Math.floor(Math.random() * 19) + 1

      let k = Math.floor(Math.random() * 2) + 8
      let crumInstanceI = await CrumInstance.findByPk(i)
      let crumI = await Crum.findByPk(j)
      let userK = await User.findByPk(k)
      let userKN = await User.findByPk(13)
      await crumInstanceI.setCrum(crumI)
      await crumInstanceI.setUser(userK)
      await crumInstanceI.setRecipient(userKN)
    }
  } catch (error) {
    console.log(red(error))
  }

  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
