/* global describe beforeEach it */

const {expect} = require('chai')
const db = require('../index')
const User = db.model('user')

describe('User model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      let cody

      beforeEach(async () => {
        cody = await User.create({
          userName: 'cody',
          email: 'cody@puppybook.com',
          password: 'bones'
        })
      })

      it('returns true if the password is correct', () => {
        expect(cody.correctPassword('bones')).to.be.equal(true)
      })

      it('returns false if the password is incorrect', () => {
        expect(cody.correctPassword('bonez')).to.be.equal(false)
      })

      it('type cannot be null', async () => {
        const typeArray = await User.findAll({
          where: {
            type: null
          }
        })

        expect(typeArray.length).to.be.equal(0)
      })

      it('Admin cannot be guest - must have userName and password', async () => {
        const adminArray = await User.findAll({
          where: {
            type: 'admin'
          }
        })
        const nullAdmin = adminArray.filter(
          admin => admin.userName === null || admin.password === null
        )

        expect(nullAdmin.length).to.be.equal(0)
      })
    }) // end describe('correctPassword')
  }) // end describe('instanceMethods')
}) // end describe('User model')
