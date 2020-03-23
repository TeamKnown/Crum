'use strict'

const {green, red} = require('chalk')
const db = require('../server/db')
const {User, Crum, CrumInstance} = require('../server/db/models')

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
  }
]
const crums = [
  {
    name: 'Dog'
  },
  {
    name: 'BrainFog'
  },
  {
    name: 'JsHtmlCss'
  },
  {
    name: 'Breakmarker'
  },
  {
    name: 'LaughWithTear'
  },
  {
    name: 'Chocolates'
  },
  {
    name: 'LaughWithTeeth'
  },
  {
    name: 'CoolGuy'
  },
  {
    name: 'Mask'
  },
  {
    name: 'MusicNote'
  },
  {
    name: 'FourthOfJuly'
  },
  {
    name: 'Pinocchio'
  },
  {
    name: 'FullStack'
  },
  {
    name: 'Ring'
  },
  {
    name: 'GreenFace'
  },
  {
    name: 'Sleepy'
  },
  {
    name: 'Halo'
  },
  {
    name: 'Smart'
  },
  {
    name: 'HandSanitizer'
  },
  {
    name: 'Stress'
  }
]
const crumInstances = [
  {
    title: 'april apartment',
    description: 'april apartment 1',
    latitude: 40.7074,
    longitude: -74.0054
  },
  {
    title: 'april apartment',
    description: 'april apartment',
    latitude: 40.7074,
    longitude: -74.0055
  },
  {
    title: 'april apartment',
    description: 'april apartment',
    latitude: 40.7072,
    longitude: -74.0054
  },
  {
    title: 'april apartment',
    description: 'april apartment',
    latitude: 40.7073,
    longitude: -74.0054
  },
  {
    title: 'april apartment',
    description: 'april apartment',
    latitude: 40.7075,
    longitude: -74.0057
  },
  {
    title: 'april apartment',
    description: 'april apartment',
    latitude: 40.7076,
    longitude: -74.0051
  },
  {
    title: 'april apartment',
    description: 'april apartment',
    latitude: 40.7076,
    longitude: -74.0052
  },
  {
    title: 'april apartment',
    description: 'april apartment',
    latitude: 40.7073,
    longitude: -74.0056
  },
  {
    title: 'mark apartment',
    description: 'mark apartment',
    latitude: 40.7127,
    longitude: -73.9495
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
      let k = Math.floor(Math.random() * 9) + 1
      let crumInstanceI = await CrumInstance.findByPk(i)
      let crumI = await Crum.findByPk(j)
      let userK = await User.findByPk(k)
      await crumInstanceI.setCrum(crumI)
      await crumInstanceI.setUser(userK)
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
