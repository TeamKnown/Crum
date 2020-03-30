'use strict'

const {green, red} = require('chalk')
const db = require('../server/db')
const {
  User,
  Crum,
  CrumInstance,
  CommentInstance
} = require('../server/db/models')

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
    userName: 'dad',
    email: 'dad@gmail.com',
    password: 'yesDad',
    salt: null
  }
]
const crums = [
  {
    name: 'Dog',
    category: '2-Animal'
  },
  {
    name: 'BrainFog',
    category: '0-Emoji'
  },
  {
    name: 'JsHtmlCss',
    category: '3-Object'
  },
  {
    name: 'Breakmarker',
    category: '3-Object'
  },
  {
    name: 'LaughWithTear',
    category: '0-Emoji'
  },
  {
    name: 'Chocolates',
    category: '3-Object'
  },
  {
    name: 'LaughWithTeeth',
    category: '0-Emoji'
  },
  {
    name: 'CoolGuy',
    category: '0-Emoji'
  },
  {
    name: 'Mask',
    category: '3-Object'
  },
  {
    name: 'MusicNote',
    category: '4-Symbol'
  },
  {
    name: 'FourthOfJuly',
    category: '4-Symbol'
  },
  {
    name: 'Pinocchio',
    category: '0-Emoji'
  },
  // {
  //   name: 'FullStack',
  //   category: '4-Symbol'
  // },
  {
    name: 'Ring',
    category: '3-Object'
  },
  {
    name: 'GreenFace',
    category: '0-Emoji'
  },
  {
    name: 'Sleepy',
    category: '0-Emoji'
  },
  {
    name: 'Halo',
    category: '0-Emoji'
  },
  {
    name: 'Smart',
    category: '0-Emoji'
  },
  {
    name: 'HandSanitizer',
    category: '3-Object'
  },
  {
    name: 'Stress',
    category: '0-Emoji'
  },
  {
    name: 'Dad',
    category: '1-Human'
  },
  {
    name: 'ThumbUp',
    category: '4-Symbol'
  },
  {
    name: 'ThumbDown',
    category: '4-Symbol'
  },
  {
    name: 'HandWashing',
    category: '4-Symbol'
  },
  {
    name: 'Cat',
    category: '2-Animal'
  },
  {
    name: 'Husky',
    category: '2-Animal'
  },
  {
    name: 'Amazed',
    category: '0-Emoji'
  },
  {
    name: 'Flushed',
    category: '0-Emoji'
  },
  {
    name: 'Shush',
    category: '0-Emoji'
  },
  {
    name: 'Sideeye',
    category: '0-Emoji'
  },
  {
    name: 'ACBunny',
    category: '4-AnimalCrossing'
  },
  {
    name: 'ACRaccoon',
    category: '4-AnimalCrossing'
  },
  {
    name: 'ACBoy',
    category: '4-AnimalCrossing'
  },
  {
    name: 'ACKid',
    category: '4-AnimalCrossing'
  },
  {
    name: 'DogDuo',
    category: '2-Animal'
  },
  {
    name: 'MinionDuo',
    category: '5-DespicableMe'
  },
  {
    name: 'MinionTrio',
    category: '5-DespicableMe'
  },
  {
    name: 'NoCigs',
    category: '3-Object'
  },
  {
    name: 'SillyMinion',
    category: '5-DespicableMe'
  },
  {
    name: 'StareGru',
    category: '5-DespicableMe'
  },
  {
    name: 'SmirkMinion',
    category: '5-DespicableMe'
  }
]
const crumInstances = [
  {
    message: 'Every Day is Fathers Day',
    latitude: 40.7185,
    longitude: -73.9743,
    crumId: 20,
    userId: 11
  },
  {
    message: 'Please no more...',
    latitude: 40.7077,
    longitude: -74.0112,
    crumId: 14,
    userId: 3
  },
  {
    message: 'Beautiful Day!',
    latitude: 40.776,
    longitude: -73.9689,
    crumId: 8,
    userId: 5
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
    crumId: 10,
    userId: 4
  },
  {
    message: 'hope you like chocolate',
    latitude: 40.7053,
    longitude: -74.0056,
    crumId: 6,
    userId: 7
  },
  {
    message: 'out for a walk',
    latitude: 40.7222,
    longitude: -73.9539,
    crumId: 1,
    userId: 8
  },
  {
    message: 'going out for ice cream',
    latitude: 40.6763,
    longitude: -73.8752,
    crumId: 16,
    userId: 10
  },
  {
    message: 'reading the new sutter cane',
    latitude: 40.6812,
    longitude: -73.9955,
    crumId: 17,
    userId: 9
  },
  {
    message: 'sandwich time',
    latitude: 40.7269,
    longitude: -73.8773,
    crumId: 8,
    userId: 6
  },
  {
    message: 'for the dads',
    latitude: 40.7235,
    longitude: -73.9831,
    crumId: 20,
    userId: 11
  }
]

const commentInstances = [
  {
    message: 'yay'
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
    // for (let i = 1; i < crumInstances.length + 1; i++) {
    //   let j = Math.floor(Math.random() * 19) + 1
    //   // let k = Math.floor(Math.random() * 9) + 1
    //   let k = Math.floor(Math.random() * 2) + 1
    //   let crumInstanceI = await CrumInstance.findByPk(i)
    //   let crumI = await Crum.findByPk(j)
    //   let userK = await User.findByPk(k)
    //   await crumInstanceI.setCrum(crumI)
    //   await crumInstanceI.setUser(userK)
    // }

    // await Promise.all(
    //   commentInstances.map(commentInstance =>
    //     CommentInstance.create(commentInstance)
    //   )
    // )
    // for (let i = 1; i < commentInstances.length + 1; i++) {
    //   let j = Math.floor(Math.random() * 4) + 1
    //   let commentInstancesI = await CommentInstance.findByPk(i)
    //   let crumInstanceI = await CrumInstance.findByPk(j)
    //   await commentInstancesI.setCrumInstance(crumInstanceI)
    // }
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
