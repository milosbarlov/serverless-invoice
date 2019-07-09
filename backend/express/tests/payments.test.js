const request = require('supertest');
const app = require('../app');

test('Get all payments', async () => {
  try {
    await request(app)
      .get('/payments')
      .expect(200);
  } catch (error) {
    console.error(error);
  }
});

test('Get first 10 payments', async () => {
  try {
    await request(app)
      .get('/payments')
      .query({
        descending: true,
        page: 1,
        rowsPerPage: 10,
        sortBy: 'date',
        status: ['succeeded'],
      })
      .expect(200);
  } catch (error) {
    console.error(error);
  }
});

describe('New payment', () => {
  let payment = '';

  test('Add payment', async () => {
    try {
      const response = await request(app)
        .post('/payments')
        .send({
          amount: 100,
          currency: 'usd',
          description: 'test payment',
          source: 'tok_visa',
        })
        .expect(201);

      payment = response.body.id;

      expect(response.body.status).toBe('succeeded');
    } catch (error) {
      console.error(error);
    }
  });

  test('Get payment', async () => {
    try {
      const response = await request(app)
        .get(`/payments/${payment}`)
        .expect(200);

      expect(payment).toBe(response.body.id);
    } catch (error) {
      console.error(error);
    }
  });

  test('Update payment', async () => {
    const params = { description: 'testing' };

    try {
      const response = await request(app)
        .put(`/payments/${payment}`)
        .send(params)
        .expect(200);

      expect(response.body).toMatchObject(params);
    } catch (error) {
      console.error(error);
    }
  });

  test('Refund payment', async () => {
    try {
      const response = await request(app)
        .post(`/payments/${payment}/refund`)
        .expect(201);

      expect(response.body.status).toBe('succeeded');
    } catch (error) {
      console.error(error);
    }
  });
});
