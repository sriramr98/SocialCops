const request = require('supertest');
const assert = require('chai').assert;
const errorcodes = require('./../utils/errorcodes');

const {
  app
} = require('./../app');

const User = require('./../models/user');

const dummyUser = {
  username: 'sriramr',
  password: 'Sriram@1998'
};

let dummyUserToken = '';

// delete all users before the tests start
// also insert a dummy user for testing
before(() => {
  // delete all existing users
  User.deleteMany({})
    .then(() => {
      return new User(dummyUser).save();
    }).then(user => {
      return user.generateAuthToken()
    })
    .then(token => dummyUserToken = token)
    .catch(e => {

    })
});

describe('POST /api/login', () => {
  it('should login a new user', done => {
    const newUser = {
      username: 'sriramr98',
      password: 'testpassword1234'
    };

    request(app)
      .post('/api/login')
      .send(newUser)
      .expect(200)
      .expect(res => {
        // check for a token in the body
        assert.exists(res.body);
        assert.exists(res.body.data);
        assert.typeOf(res.body.data, 'string')
      })
      .end((err, res) => {
        if (err) return done(err);
        User.findOne({
          username: newUser.username
        }).then(user => {
          // passwords should not match as it has to be hashed before saving
          assert.exists(user);
          assert.notEqual(user.password, newUser.password);
          done();
        }).catch(e => done(e));
      });

  });

  it('should login previously existin user', done => {
    request(app)
      .post('/api/login')
      .send(dummyUser)
      .expect(200)
      .expect(res => {
        // check for a token in the body
        assert.exists(res.body);
        assert.exists(res.body.data);
        assert.typeOf(res.body.data, 'string')
      })
      .end((err, res) => {
        if (err) return done(err);
        User.findOne({
          username: dummyUser.username
        }).then(user => {
          // passwords should not match as it has to be hashed before saving
          assert.exists(user);
          assert.notEqual(user.password, dummyUser.password);
          assert.equal(res.body.data, user.authTokens[0]);
          done();
        }).catch(e => done(e));
      });
  });

  it('should not login an invalid user body', done => {
    request(app)
      .post('/api/login')
      .send({
        username: 'sriramr123'
      })
      .expect(400)
      .expect(res => {
        assert.exists(res.body);
        assert.isNotNull(res.body.error);
        assert.isNull(res.body.data);
        assert.equal(res.body.error.errorCode, errorcodes.ERROR_INVALID_BODY_PARAMETER);
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

});