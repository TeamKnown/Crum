/* global describe beforeEach it */

const {expect} = require('chai')
const db = require('../index')
const {Crum, User, CrumInstance, CommentInstance} = require('.')
describe('CrumInstance model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('receives comments', () => {
    const exampleCrumInstance = {
      message: 'Every Day is Fathers Day',
      latitude: 40.7185,
      longitude: -73.9743
    }
    const exampleCommentInstance = {
      message: 'yay'
    }
    beforeEach(async () => {
      cody = await CrumInstance.create(exampleCrumInstance)
      cody2 = await CrumInstance.create(exampleCrumInstance)
      const comment = await CommentInstance.create(exampleCommentInstance)

      await cody.addCommentInstance(comment)
    })

    it('comment is empty array if no comment', async () => {
      let comments = await cody2.getCommentInstances()

      expect(comments).to.deep.equal([])
    })
    it('comment is an non empty array if no comment', async () => {
      let comments = await cody.getCommentInstances()

      expect(comments.map(elm => elm.id)).to.deep.equal([1])
    })
  })
})
