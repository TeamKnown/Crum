const {expect} = require('chai')
const db = require('../index')
const {Crum, User, CrumInstance, CommentInstance} = require('.')

describe('Model Associations', () => {
  beforeEach(() => db.sync({force: true}))
  afterEach(() => db.sync({force: true}))

  it('a crumInstance is associated with a user and a crum', async () => {
    const crumInstance = await CrumInstance.create({
      message: 'going out for ice cream',
      latitude: 40.6763,
      longitude: -73.8752
    })

    const user = await User.create({
      userName: 'Admin',
      email: 'admin@gmail.com',
      password: 'test1',
      salt: null,
      type: 'admin'
    })

    const crum = await Crum.create({
      name: 'Ring',
      category: '3-Object'
    })

    await crumInstance.setUser(user)
    await crumInstance.setCrum(crum)
    const userOf = await crumInstance.getUser()
    const crumOf = await crumInstance.getCrum()
    expect(userOf.id).to.deep.equal(1)
    expect(crumOf.id).to.deep.equal(1)
  })
})
