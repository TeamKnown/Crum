'use strict'

const {green, red} = require('chalk')
const db = require('../server/db')
const {User, Crum, CrumInstance} = require('../server/db/models')

const users = [
  {
    userName: 'Alric Venners',
    email: 'avenners0@businessweek.com',
    password: 'CzXV0m8',
    salt: null,
    googleId: null,
    stripeId: null,
    type: 'admin',
    address: '1352 Gulseth Parkway, New York, NY',
    zip: '10001',
    phone: '703-457-2792'
  },
  {
    userName: 'Sharline Croney',
    email: 'scroney1@state.tx.us',
    password: 'gFXBSSV1',
    salt: null,
    googleId: null,
    stripeId: null,
    address: '9452 Rieder Way, San Francisco, CA',
    zip: '90210',
    phone: '567-970-1143'
  },
  {
    userName: 'Moshe Btham',
    email: 'mbtham2@angelfire.com',
    password: 'JxmEPQKq0JW4',
    salt: null,
    googleId: null,
    stripeId: null,
    address: '5734 Dapin Place, Englewood, FL',
    zip: '34223',
    phone: '529-336-3251'
  },
  {
    userName: 'Frederica Muffen',
    email: 'fmuffen3@japanpost.jp',
    password: 'NOFv1iBo',
    salt: null,
    googleId: null,
    stripeId: null,
    address: '5 Mccormick Crossing, Montville, NJ',
    zip: '07045',
    phone: '298-412-5928'
  },
  {
    userName: 'Jerry Kleis',
    email: 'jkleis4@google.fr',
    password: 'Drc5fO2',
    salt: null,
    googleId: null,
    stripeId: null,
    address: '990 Blackbird Avenue, Denver, CO',
    zip: '80014',
    phone: '650-764-6969'
  },
  {
    userName: 'Morey Cunniffe',
    email: 'mcunniffe5@who.int',
    password: 'vs99rzUHHP',
    salt: null,
    googleId: null,
    stripeId: null,
    address: '0 Columbus Center, New York, NY',
    zip: '10016',
    phone: '581-323-2900'
  },
  {
    userName: 'Ameline Andrieu',
    email: 'aandrieu6@google.es',
    password: 'jHm15tU',
    salt: null,
    googleId: null,
    stripeId: null,
    address: '7832 Gateway Junction, Las Vegas, NV',
    zip: '88901',
    phone: '100-845-9393'
  },
  {
    userName: 'Courtenay Heald',
    email: 'cheald7@meetup.com',
    password: 'aRlDbxDYsFD',
    salt: null,
    googleId: null,
    stripeId: null,
    address: '724 Coolidge Hill, Richmond, VA',
    zip: '23713',
    phone: '795-984-3609'
  },
  {
    userName: 'Emlynn Birtwell',
    email: 'ebirtwell8@storify.com',
    password: 'M0oDOqBw4e',
    salt: null,
    googleId: null,
    stripeId: null,
    address: '106 Monterey Point, Detroit, MI',
    zip: '48127',
    phone: '775-369-1751'
  },
  {
    userName: 'Kayle Carlisle',
    email: 'kcarlisle9@fotki.com',
    password: 'NERY7QB2pRqy',
    salt: null,
    googleId: null,
    stripeId: null,
    address: '35 Di Loreto Place, Providence, RI',
    zip: '02860',
    phone: '523-678-1359'
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
    des: 'april apartment 1',
    latitude: 40.7074,
    longitude: -74.0054
  },
  {
    title: 'april apartment',
    des: 'april apartment',
    latitude: 40.7074,
    longitude: -74.0055
  },
  {
    title: 'april apartment',
    des: 'april apartment',
    latitude: 40.7072,
    longitude: -74.0054
  },
  {
    title: 'april apartment',
    des: 'april apartment',
    latitude: 40.7073,
    longitude: -74.0054
  },
  {
    title: 'april apartment',
    des: 'april apartment',
    latitude: 40.7075,
    longitude: -74.0057
  },
  {
    title: 'april apartment',
    des: 'april apartment',
    latitude: 40.7076,
    longitude: -74.0051
  },
  {
    title: 'april apartment',
    des: 'april apartment',
    latitude: 40.7076,
    longitude: -74.0052
  },
  {
    title: 'april apartment',
    des: 'april apartment',
    latitude: 40.7073,
    longitude: -74.0056
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
