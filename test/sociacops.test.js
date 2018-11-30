const request = require('supertest');
const assert = require('chai').assert;
const errorcodes = require('./../utils/errorcodes');

const {app} = require('./../app');

const User = require('./../models/user');

const dummyUser = {
    username: 'sriramr',
    password: 'Sriram@1998',
};

let dummyUserToken = '';

// delete all users before the tests start
// also insert a dummy user for testing
before(() => {
    // delete all existing users
    User.deleteMany({})
        .then(() => {
            return new User(dummyUser).save();
        })
        .then((user) => {
            return user.generateAuthToken();
        })
        .then((token) => (dummyUserToken = token))
        .catch((e) => {});
});

// TEST login route
describe('POST /api/login', () => {
    it('should login a new user', (done) => {
        const newUser = {
            username: 'sriramr98',
            password: 'testpassword1234',
        };

        request(app)
            .post('/api/login')
            .send(newUser)
            .expect(200)
            .expect((res) => {
                // check for a token in the body
                assert.exists(res.body);
                assert.exists(res.body.data);
                assert.typeOf(res.body.data, 'string');
            })
            .end((err, res) => {
                if (err) return done(err);
                User.findOne({
                    username: newUser.username,
                })
                    .then((user) => {
                        // passwords should not match as it has to be hashed before saving
                        assert.exists(user);
                        assert.notEqual(user.password, newUser.password);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    it('should login previously existing user', (done) => {
        request(app)
            .post('/api/login')
            .send(dummyUser)
            .expect(200)
            .expect((res) => {
                // check for a token in the body
                assert.exists(res.body);
                assert.exists(res.body.data);
                assert.typeOf(res.body.data, 'string');
            })
            .end((err, res) => {
                if (err) return done(err);
                User.findOne({
                    username: dummyUser.username,
                })
                    .then((user) => {
                        // passwords should not match as it has to be hashed before saving
                        assert.exists(user);
                        assert.notEqual(user.password, dummyUser.password);
                        assert.equal(res.body.data, user.authTokens[0]);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    it('should not login an user without username', (done) => {
        request(app)
            .post('/api/login')
            .send({
                password: 'sriramr123',
            })
            .expect(400)
            .expect((res) => {
                assert.exists(res.body);
                assert.isNotNull(res.body.error);
                assert.isNull(res.body.data);
                assert.equal(
                    res.body.error.errorCode,
                    errorcodes.ERROR_INVALID_BODY_PARAMETER
                );
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should not login an user without password', (done) => {
        request(app)
            .post('/api/login')
            .send({
                username: 'sriramr123',
            })
            .expect(400)
            .expect((res) => {
                assert.exists(res.body);
                assert.isNotNull(res.body.error);
                assert.isNull(res.body.data);
                assert.equal(
                    res.body.error.errorCode,
                    errorcodes.ERROR_INVALID_BODY_PARAMETER
                );
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});

// TEST patch route
describe('POST /api/patch', () => {
    const jsonData = {
        baz: 'qux',
        foo: 'bar',
    };
    const jsonPatch = [
        {
            op: 'replace',
            path: '/baz',
            value: 'boo',
        },
        {
            op: 'add',
            path: '/hello',
            value: ['world'],
        },
        {
            op: 'remove',
            path: '/foo',
        },
    ];

    const expectedOutput = {
        baz: 'boo',
        hello: ['world'],
    };

    it('should patch successfully', (done) => {
        request(app)
            .post('/api/patch')
            .send({
                jsonData,
                jsonPatch,
            })
            .set('Authorization', dummyUserToken)
            .expect(200)
            .expect((res) => {
                assert.exists(res.body);
                assert.equal(res.body.success, true);
                assert.isNotNull(res.body.data);
                assert.deepEqual(res.body.data, expectedOutput);
                assert.isNull(res.body.error);
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should reject if auth token is absent', (done) => {
        request(app)
            .post('/api/patch')
            .send({
                jsonData,
                jsonPatch,
            })
            .expect(404)
            .expect((res) => {
                assert.exists(res.body);
                assert.isNull(res.body.data);
                assert.isNotNull(res.body.error);
                assert.equal(res.body.success, false);
                assert.equal(res.body.error.errorCode, errorcodes.ERROR_INVALID_TOKEN);
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should reject if json data is not passed', (done) => {
        request(app)
            .post('/api/patch')
            .send({
                jsonPatch,
            })
            .set('Authorization', dummyUserToken)
            .expect(400)
            .expect((res) => {
                assert.exists(res.body);
                assert.equal(res.body.success, false);
                assert.isNull(res.body.data);
                assert.isNotNull(res.body.error);
                assert.equal(
                    res.body.error.errorCode,
                    errorcodes.ERROR_INVALID_BODY_PARAMETER
                );
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should reject if json patch is not passed', (done) => {
        request(app)
            .post('/api/patch')
            .send({
                jsonData,
            })
            .set('Authorization', dummyUserToken)
            .expect(400)
            .expect((res) => {
                assert.exists(res.body);
                assert.equal(res.body.success, false);
                assert.isNull(res.body.data);
                assert.isNotNull(res.body.error);
                assert.equal(
                    res.body.error.errorCode,
                    errorcodes.ERROR_INVALID_BODY_PARAMETER
                );
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});

// TEST resize route
describe('POST /api/resize', () => {
    it('should resize successfully', (done) => {
        request(app)
            .post('/api/resize')
            .send({
                imageUrl:
          'https://images.unsplash.com/photo-1543428994-15e7df56a5a3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0a519147afeb5734eb6e2896f06d22d1&auto=format&fit=crop&w=700&q=80',
                imageName: 'image1.png',
                imageFormat: 'png',
            })
            .set('Authorization', dummyUserToken)
            .expect(200, done);
    });

    it('should return error when auth token is not sent', (done) => {
        request(app)
            .post('/api/resize')
            .send({
                imageUrl:
          'https://images.unsplash.com/photo-1543428994-15e7df56a5a3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0a519147afeb5734eb6e2896f06d22d1&auto=format&fit=crop&w=700&q=80',
                imageName: 'image1.png',
                imageFormat: 'png',
            })
            .expect(404)
            .expect((res) => {
                assert.exists(res.body);
                assert.equal(res.body.success, false);
                assert.isNull(res.body.data);
                assert.isNotNull(res.body.error);
                assert.equal(res.body.error.errorCode, errorcodes.ERROR_INVALID_TOKEN);
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should return error when image url is not sent', (done) => {
        request(app)
            .post('/api/resize')
            .send({
                imageName: 'image1.png',
                imageFormat: 'png',
            })
            .set('Authorization', dummyUserToken)
            .expect(400)
            .expect((res) => {
                assert.exists(res.body);
                assert.equal(res.body.success, false);
                assert.isNull(res.body.data);
                assert.isNotNull(res.body.error);
                assert.equal(
                    res.body.error.errorCode,
                    errorcodes.ERROR_INVALID_BODY_PARAMETER
                );
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should return error when image name is not sent', (done) => {
        request(app)
            .post('/api/resize')
            .send({
                imageUrl:
          'https://images.unsplash.com/photo-1543428994-15e7df56a5a3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0a519147afeb5734eb6e2896f06d22d1&auto=format&fit=crop&w=700&q=80',
                imageFormat: 'png',
            })
            .set('Authorization', dummyUserToken)
            .expect(400)
            .expect((res) => {
                assert.exists(res.body);
                assert.equal(res.body.success, false);
                assert.isNull(res.body.data);
                assert.isNotNull(res.body.error);
                assert.equal(
                    res.body.error.errorCode,
                    errorcodes.ERROR_INVALID_BODY_PARAMETER
                );
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should return error when image format is not sent', (done) => {
        request(app)
            .post('/api/resize')
            .send({
                imageUrl:
          'https://images.unsplash.com/photo-1543428994-15e7df56a5a3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0a519147afeb5734eb6e2896f06d22d1&auto=format&fit=crop&w=700&q=80',
                imageName: 'image1.png',
            })
            .set('Authorization', dummyUserToken)
            .expect(400)
            .expect((res) => {
                assert.exists(res.body);
                assert.equal(res.body.success, false);
                assert.isNull(res.body.data);
                assert.isNotNull(res.body.error);
                assert.equal(
                    res.body.error.errorCode,
                    errorcodes.ERROR_INVALID_BODY_PARAMETER
                );
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});
