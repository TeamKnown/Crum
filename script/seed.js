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
  },
  {
    latitude: 40.739528,
    longitude: -73.982488
  },

  {
    latitude: 40.6840608397,
    longitude: -73.8705374096
  },
  {
    latitude: 40.6846250902,
    longitude: -73.868974527
  },
  {
    latitude: 40.6847015539,
    longitude: -73.8683087895
  },
  {
    latitude: 40.6851309404,
    longitude: -73.8667773299
  },
  {
    latitude: 40.6764746696,
    longitude: -73.8971674505
  },
  {
    latitude: 40.6772216502,
    longitude: -73.8974635303
  },
  {
    latitude: 40.6769941203,
    longitude: -73.89835842
  },
  {
    latitude: 40.6770425302,
    longitude: -73.8992120797
  },
  {
    latitude: 40.6775400004,
    longitude: -73.9019513697
  },
  {
    latitude: 40.6778949796,
    longitude: -73.9029900497
  },
  {
    latitude: 40.6778615496,
    longitude: -73.9043006705
  },
  {
    latitude: 40.67784547,
    longitude: -73.9059013106
  },
  {
    latitude: 40.6512299704,
    longitude: -73.94206208
  },
  {
    latitude: 40.6509474903,
    longitude: -73.9455446295
  },
  {
    latitude: 40.6509619998,
    longitude: -73.9478340004
  },
  {
    latitude: 40.6487330002,
    longitude: -73.9524139996
  },
  {
    latitude: 40.6486891904,
    longitude: -73.9559619698
  },
  {
    latitude: 40.6486071201,
    longitude: -73.9578195903
  },
  {
    latitude: 40.7181870001,
    longitude: -73.9596884103
  },
  {
    latitude: 40.814105,
    longitude: -73.9404430002
  },
  {
    latitude: 40.8239255499,
    longitude: -73.9085494403
  },
  {
    latitude: 40.6927500003,
    longitude: -74.0162
  },
  {
    latitude: 40.6927199996,
    longitude: -74.0157800002
  },
  {
    latitude: 40.6887299999,
    longitude: -74.0173300004
  },
  {
    latitude: 40.6925299998,
    longitude: -74.0145400001
  },
  {
    latitude: 40.6902299998,
    longitude: -74.0146499995
  },
  {
    latitude: 40.6901699999,
    longitude: -74.0144399999
  },
  {
    latitude: 40.6895899998,
    longitude: -74.0133999997
  },
  {
    latitude: 40.6893400002,
    longitude: -74.0146699994
  },
  {
    latitude: 40.6885699998,
    longitude: -74.0147000004
  },
  {
    latitude: 40.6927399998,
    longitude: -74.0147700003
  },
  {
    latitude: 40.7415832891,
    longitude: -74.0047109131
  },
  {
    latitude: 40.7410467844,
    longitude: -74.001803398
  },
  {
    latitude: 40.7436317201,
    longitude: -74.0059179066
  },
  {
    latitude: 40.7421021446,
    longitude: -74.0042110753
  },
  {
    latitude: 40.8100140004,
    longitude: -73.9375529998
  },
  {
    latitude: 40.795988,
    longitude: -73.9474260006
  },
  {
    latitude: 40.8075429999,
    longitude: -73.9527930003
  },
  {
    latitude: 40.8110419997,
    longitude: -73.9414040002
  },
  {
    latitude: 40.798959,
    longitude: -73.9523960004
  },
  {
    latitude: 40.8098880004,
    longitude: -73.9390120002
  },
  {
    latitude: 40.8083379998,
    longitude: -73.948989
  },
  {
    latitude: 40.8151320004,
    longitude: -73.9396849997
  },
  {
    latitude: 40.8145630004,
    longitude: -73.9400299999
  },
  {
    latitude: 40.7974669996,
    longitude: -73.9507169999
  },
  {
    latitude: 40.7997030003,
    longitude: -73.9509940006
  },
  {
    latitude: 40.799435,
    longitude: -73.950994
  },
  {
    latitude: 40.8037859998,
    longitude: -73.9461589995
  },
  {
    latitude: 40.6918600003,
    longitude: -73.988721
  },
  {
    latitude: 40.6916769998,
    longitude: -73.988841
  },
  {
    latitude: 40.8126109997,
    longitude: -73.9454579999
  },
  {
    latitude: 40.8062489603,
    longitude: -73.9500945898
  },
  {
    latitude: 40.8223078,
    longitude: -73.9424445303
  },
  {
    latitude: 40.8471969,
    longitude: -73.9351479
  },
  {
    latitude: 40.7494585504,
    longitude: -73.8864554498
  },
  {
    latitude: 40.7495324942,
    longitude: -73.8858318964
  },
  {
    latitude: 40.7333421001,
    longitude: -73.8708377505
  },
  {
    latitude: 40.7264949997,
    longitude: -73.8531379997
  },
  {
    latitude: 40.7266949997,
    longitude: -73.8539290005
  },
  {
    latitude: 40.7270949999,
    longitude: -73.854789
  },
  {
    latitude: 40.753121769,
    longitude: -73.9207195344
  },
  {
    latitude: 40.7518341599,
    longitude: -73.9705930597
  },
  {
    latitude: 40.7647862798,
    longitude: -73.9915898402
  },
  {
    latitude: 40.7406856598,
    longitude: -73.99799948
  },
  {
    latitude: 40.7370879999,
    longitude: -73.9813679001
  },
  {
    latitude: 40.8231244696,
    longitude: -73.9382020003
  },
  {
    latitude: 40.7485946813,
    longitude: -73.8742030692
  },
  {
    latitude: 40.8296624199,
    longitude: -73.9484220401
  },
  {
    latitude: 40.74349317,
    longitude: -73.9859719702
  },
  {
    latitude: 40.8112048322,
    longitude: -73.9538487753
  },
  {
    latitude: 40.7334000001,
    longitude: -73.9548860003
  },
  {
    latitude: 40.8355860004,
    longitude: -73.9395889996
  },
  {
    latitude: 40.7144457399,
    longitude: -73.9459483206
  },
  {
    latitude: 40.8166790698,
    longitude: -73.9164828502
  },
  {
    latitude: 40.8012472402,
    longitude: -73.9612785295
  },
  {
    latitude: 40.7139130004,
    longitude: -73.944206
  },
  {
    latitude: 40.846169,
    longitude: -73.9019509996
  },
  {
    latitude: 40.8133669998,
    longitude: -73.91962478
  },
  {
    latitude: 40.8108964904,
    longitude: -73.9214341701
  },
  {
    latitude: 40.8000700004,
    longitude: -73.9467620005
  },
  {
    latitude: 40.8121627203,
    longitude: -73.9164668698
  },
  {
    latitude: 40.7368059996,
    longitude: -73.993513
  },
  {
    latitude: 40.7622099,
    longitude: -73.9818807495
  },
  {
    latitude: 40.7437055002,
    longitude: -73.9920842906
  },
  {
    latitude: 40.7502370001,
    longitude: -73.9773059999
  },
  {
    latitude: 40.7668612898,
    longitude: -73.9834415303
  },
  {
    latitude: 40.71665239,
    longitude: -73.9976459205
  },
  {
    latitude: 40.7781408199,
    longitude: -73.9525943999
  },
  {
    latitude: 40.716869,
    longitude: -73.9975780003
  },
  {
    latitude: 40.7380968799,
    longitude: -73.9877384002
  },
  {
    latitude: 40.7470545903,
    longitude: -73.9810610705
  },
  {
    latitude: 40.7666831948,
    longitude: -73.9902100974
  },
  {
    latitude: 40.7619766,
    longitude: -73.9632130101
  },
  {
    latitude: 40.7672819398,
    longitude: -73.9565366
  },
  {
    latitude: 40.72048554,
    longitude: -73.98908323
  },
  {
    latitude: 40.74671976,
    longitude: -73.9859357197
  },
  {
    latitude: 40.7621465403,
    longitude: -73.9633536195
  },
  {
    latitude: 40.816104,
    longitude: -73.8964350002
  },
  {
    latitude: 40.7234019998,
    longitude: -73.989938
  },
  {
    latitude: 40.8748110001,
    longitude: -73.8788550004
  },
  {
    latitude: 40.8732440004,
    longitude: -73.8871380001
  },
  {
    latitude: 40.866978,
    longitude: -73.893509
  },
  {
    latitude: 40.8393059996,
    longitude: -73.9133999997
  },
  {
    latitude: 40.8209480003,
    longitude: -73.8905490002
  },
  {
    latitude: 40.7626599996,
    longitude: -73.9672579996
  },
  {
    latitude: 40.8504100004,
    longitude: -73.905227
  },
  {
    latitude: 40.8458999998,
    longitude: -73.9101360005
  },
  {
    latitude: 40.8279049997,
    longitude: -73.9256510001
  },
  {
    latitude: 40.7575519997,
    longitude: -73.969055
  },
  {
    latitude: 40.7625260003,
    longitude: -73.9679670005
  },
  {
    latitude: 40.7571069999,
    longitude: -73.9719199995
  },
  {
    latitude: 40.8612959996,
    longitude: -73.8977489998
  },
  {
    latitude: 40.8560929997,
    longitude: -73.900741
  },
  {
    latitude: 40.7173040001,
    longitude: -73.9568719995
  },
  {
    latitude: 40.7145650003,
    longitude: -73.9440530001
  },
  {
    latitude: 40.7313520001,
    longitude: -73.954449
  },
  {
    latitude: 40.724635,
    longitude: -73.9512770002
  },
  {
    latitude: 40.7243290001,
    longitude: -73.9977020004
  },
  {
    latitude: 40.7334220001,
    longitude: -74.0029059997
  },
  {
    latitude: 40.7282509998,
    longitude: -74.0053669994
  },
  {
    latitude: 40.7303280003,
    longitude: -73.9926289996
  },
  {
    latitude: 40.7195270002,
    longitude: -74.0017749996
  },
  {
    latitude: 40.7183829998,
    longitude: -74.0004599995
  },
  {
    latitude: 40.7132820004,
    longitude: -74.0069779997
  },
  {
    latitude: 40.7202799998,
    longitude: -73.9939149995
  },
  {
    latitude: 40.718092,
    longitude: -73.9998919998
  },
  {
    latitude: 40.7328489997,
    longitude: -73.9861220002
  },
  {
    latitude: 40.7309530004,
    longitude: -73.9816279997
  },
  {
    latitude: 40.7323380004,
    longitude: -74.0004949999
  },
  {
    latitude: 40.7262270004,
    longitude: -74.0037389996
  },
  {
    latitude: 40.7208240001,
    longitude: -74.005229
  },
  {
    latitude: 40.7141109999,
    longitude: -74.0085849996
  },
  {
    latitude: 40.7125819997,
    longitude: -74.0097810003
  },
  {
    latitude: 40.7182669996,
    longitude: -73.9937530003
  },
  {
    latitude: 40.7228539996,
    longitude: -74.0062770002
  },
  {
    latitude: 40.7193180004,
    longitude: -74.0068860004
  },
  {
    latitude: 40.7154780001,
    longitude: -74.0092660005
  },
  {
    latitude: 40.7075130004,
    longitude: -74.013783
  },
  {
    latitude: 40.713051,
    longitude: -74.008811
  },
  {
    latitude: 40.7068209998,
    longitude: -74.0090999996
  },
  {
    latitude: 40.722301,
    longitude: -73.9971410001
  },
  {
    latitude: 40.8284679996,
    longitude: -73.9226999999
  },
  {
    latitude: 40.8280570004,
    longitude: -73.9230749999
  },
  {
    latitude: 40.8278309999,
    longitude: -73.9226770005
  },
  {
    latitude: 40.8274409997,
    longitude: -73.9230079996
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
