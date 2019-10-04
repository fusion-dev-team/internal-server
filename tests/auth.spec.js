const request = require('supertest');
const app = require('../app');

describe('Auth Endpoints', () => {
  const userCreds = {
    login: 'alexey',
    password: 'qweqwe'
  };
  const newUser = {
    login: 'some_login',
    email: 'asds',
    password: 'qweqwe'
  };

  it('should not sign in user with wrong creds', async () => {
    const res = await request(app)
      .post('/api/auth/sign-in')
      .send({ login: 'asd', password: 'asd ' });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors[0].msg).toEqual('User login wrong');
  });

  it('should sign in user', async () => {
    const res = await request(app)
      .post('/api/auth/sign-in')
      .send(userCreds);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should return email field error for registering in user', async () => {
    const res = await request(app)
      .post('/api/auth/sign-up')
      .send({ ...newUser, email: 'asdasd' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors[0].msg).toEqual('Email has wrong format');
  });

  it('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/sign-up')
      .send({ ...newUser, email: 'asd@asd.asd' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.status).toEqual('registered');
  });
});
