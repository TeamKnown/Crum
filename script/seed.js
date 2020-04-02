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
  },
  {
    message:
      'You are in Times Square! This is a major commercial intersection, tourist destination, entertainment center, and a bustling neighborhood of Midtown Manhattan. \nFun Fact: Roughly 350,000 pedestrians pass through on a typical day!',
    latitude: 40.758,
    longitude: 73.9855
  },
  {
    message:
      'This is the State of Liberty! This colossal neoclassical sculpture residing on Liberty Island came to exist as a gift from the people of France. It has since then become one of America’s most well-known and iconic symbols. Lady Liberty has undergone some updates and changes over the 130+ years of existance.\nFun Fact: Lady Liberty was supposed to have a sister statue and lighthouse in Egypt!',
    latitude: 40.6892,
    longitude: 74.0445
  },
  {
    message:
      'Welcome to the Empire State Building! This enormous building totals to 103 stories tall (1,250 feet!). This work of art took only one year and 45 days to build, but consumed seven million man-hours. It was actually constructed during a race to create the world’s tallest building!\nFun Fact: Once, a woman actually survived a 75-story plunge in one of the building’s elevators, but luckily the amount of severed elevator cable at the bottom cushioned the blow... talk about luck!',
    latitude: 40.7484,
    longitude: 73.9857
  },
  {
    message:
      'We are at The Metropolitan Museum of Art! Often called "the Met", it is the largest art museum in the entire United States. With 17 curatorial departments, 2.2 million square feet, and more than 2 million works in its permanent collections, the Met contains more treasures than most visitors will ever be able to see in a lifetime.\nFun Fact: Hard to image, but the Met was not always this enormous. This institution was originally located in a much smaller building at 681 Fifth Avenue!',
    latitude: 40.7794,
    longitude: 73.9632
  },
  {
    message:
      'This is DUMBO! No... not the elephant, but short for Down Under the Manhattan Bridge Overpass. What used to be full of warehouse buildings, is not a trendy Brooklyn neighborhood of cobblestone streets, independent boutiques, high-end resturants and trendy cafes. Head on over to Jane’s Carousel at Brooklyn Bridge Park for an unforgettable view of the Manhattan skyline.',
    latitude: 40.7033,
    longitude: 73.9881
  },
  {
    message:
      'We are at the Brooklyn Bridge! This bridge is a hybrid cable-stayed and suspension bridge, spanning the East River between the boroughs of Manhattan and Brooklyn. At the time of creation, it’s 486m long span easily made it the longest suspension beidge in the world.\nFun Fact: The infamously corrupt William M. "Boss" Tweed, was a very influential contributor to the Brooklyn Bridge project. He facilitated $65,000 in bribes to New York’s aldermen in order to win their backing of a $1.5 million bond issue!',
    latitude: 40.7061,
    longitude: 73.9969
  },
  {
    message:
      'This is Prospect Park! This urban park is situated between the neighborhoods of Park Slope, Propsect Heights and Flatbush. Prospect Park is the second largest public park in Brooklyn, right behind Maine Park.\nFun Fact: There are at least 18 species of fish and more than 200 species of birds throughout the park!',
    latitude: 40.6602,
    longitude: 73.969
  },
  {
    message:
      'You are at the Brooklyn Botanic Garden! This urban botanic garden was founded in 1910. Their goal is to connect people to the world of plants, fostering delight and curiousity while inspiring an appreciation and sense of stewardship of the environment.\nFun Fact: Before the intense development of NYC, this beautiful garden actually used to be an ash dump!',
    latitude: 40.6694,
    longitude: 73.9624
  },
  {
    message:
      'We are at Coney Island! Locals and tourists alike crowd this beach, the Wonder Wheel, and Luna Park. You’ll find street performers, seasonal events, and of course the July 4th hot-dog eating contest right here!\nFun Fact: Up to 2 MILLION people used to visit this beach each day! The borough president had to embark on a expansion project to deal with this congestion!',
    latitude: 40.5721,
    longitude: 73.9793
  },
  {
    message:
      'This is The Unisphere and the Panorama of NYC! Thisgiant globe is often refered to as the symbol of Queens. Located at the center of Flushing Meadows Park, it is a popular hangout spot for locals. You can visit the Queens Museum of Art right next door!',
    latitude: 40.7464,
    longitude: 73.844819
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
