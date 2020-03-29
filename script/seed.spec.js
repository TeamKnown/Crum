'use strict'
/* global describe it */
const {expect} = require('chai')
const seed = require('./seed')
const {
  Crum,
  User,
  CrumInstance,
  CommentInstance
} = require('../server/db/models/')

describe('seed script', async () => {
  it('completes successfully', seed)

  it('populates the database with at least ten Crums', async () => {
    const seedCrums = await Crum.findAll()
    expect(seedCrums).to.have.lengthOf.at.least(10)
  })

  it('populates the database with at least five users', async () => {
    const seedUsers = await User.findAll()
    expect(seedUsers).to.have.lengthOf.at.least(5)
  })

  it('populates the database with at least four crumInstance', async () => {
    const seedCrumInstances = await CrumInstance.findAll()
    expect(seedCrumInstances).to.have.lengthOf.at.least(4)
  })
})
