const request = require('supertest');
const app = require('../app');

describe('Auth Endpoints', () => {
  const userCreds = {
    login: 'alexey',
    password: 'qweqwe'
  };

  it('should sign in user', async () => {
    const res = await request(app)
      .post('/api/auth/sign-in')
      .send(userCreds);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
  });
});
