const request = require('supertest');
const app = require('../app');

test('Get all customers', async () => {
  try {
    const response = await request(app)
      .get('/customers')
      .expect(200);

    expect(typeof response.body.customers).toBe('object');
  } catch (error) {
    console.error(error);
  }
});

test('Get 10 customers or less', async () => {
  try {
    const response = await request(app)
      .get('/customers')
      .query({ descending: true, page: 1, rowsPerPage: 10, sortBy: 'created' })
      .expect(200);

    expect(response.body.customers.length).toBeLessThanOrEqual(10);
  } catch (error) {
    console.error(error);
  }
});

describe('Creating a new customer', () => {
  let customer = '';

  test('Add customer', async () => {
    try {
      const response = await request(app)
        .post('/customers')
        .send({
          address: {
            line1: '123 Fake Street',
            line2: 'Apt 4',
            city: 'Fake',
            state: 'TX',
            postal_code: '56879',
            country: 'US',
          },
          description: 'test',
          email: 'test@test.com',
          name: 'Some Guy',
          phone: '(888) 123-4567',
          shipping: {
            address: {
              line1: '123 Fake Street',
              line2: 'Apt 4',
              city: 'Fake',
              state: 'TX',
              postal_code: '56879',
              country: 'US',
            },
            name: 'Some Guy',
            phone: '(888) 123-4567',
          },
        })
        .expect(201);

      expect(response.body.object).toBe('customer');

      customer = response.body.id;
    } catch (error) {
      console.error(error);
    }
  });

  test('Get customer', async () => {
    try {
      const response = await request(app)
        .get(`/customers/${customer}`)
        .expect(200);

      expect(response.body.info.id).toBe(customer);
    } catch (error) {
      console.error(error);
    }
  });

  test('Update customer', async () => {
    const param = {
      description: 'test2',
      email: 'test2@test.com',
      shipping: {
        address: {
          line1: '123 Fake Street',
          line2: 'Apt 4',
          city: 'Fake',
          state: 'TX',
          postal_code: '56879',
          country: 'US',
        },
        name: 'Some Guy',
        phone: '(888) 123-4567',
      },
    };

    try {
      const response = await request(app)
        .put(`/customers/${customer}`)
        .send(param)
        .expect(200);

      expect(response.body).toMatchObject(param);
    } catch (error) {
      console.error(error);
    }
  });

  test('Delete customer', async () => {
    try {
      const response = await request(app)
        .del(`/customers/${customer}`)
        .expect(200);

      expect(response.body.id).toBe(customer);
    } catch (error) {
      console.error(error);
    }
  });
});

describe('Creating a new card', () => {
  let card = '';

  test('Add card', async () => {
    try {
      const response = await request(app)
        .post(`/customers/${process.env.ID_TEST}/source`)
        .send({ token: 'tok_visa' })
        .expect(201);

      card = response.body.id;

      expect(response.body.object).toBe('card');
    } catch (error) {
      console.error(error);
    }
  });

  test('Update card', async () => {
    const params = { name: 'John Doe' };

    try {
      const response = await request(app)
        .put(`/customers/${process.env.ID_TEST}/cards/${card}`)
        .send(params)
        .expect(200);

      expect(response.body).toMatchObject(params);
    } catch (error) {
      console.error(error);
    }
  });

  test('Delete card', async () => {
    try {
      const response = await request(app)
        .del(`/customers/${process.env.ID_TEST}/cards/${card}`)
        .expect(200);

      expect(response.body.deleted).toBe(true);
    } catch (error) {
      console.error(error);
    }
  });
});

describe('Creating a new bank account', () => {
  let bank = '';

  test('Add bank account', async () => {
    try {
      const response = await request(app)
        .post(`/customers/${process.env.ID_TEST}/source`)
        .send({
          object: 'bank_account',
          country: 'US',
          currency: 'usd',
          account_holder_name: 'John Doe',
          account_holder_type: 'individual',
          routing_number: '110000000',
          account_number: '000123456789',
        })
        .expect(201);

      bank = response.body.id;

      expect(response.body.object).toBe('bank_account');
    } catch (error) {
      console.error(error);
    }
  });

  test('Verify bank account', async () => {
    try {
      const response = await request(app)
        .post(`/customers/${process.env.ID_TEST}/bankaccount/${bank}/verify`)
        .send({ deposits: { first: '32', second: '45' } })
        .expect(200);

      expect(response.body.status).toBe('verified');
    } catch (error) {
      console.error(error);
    }
  });

  test('Delete bank account', async () => {
    try {
      const response = await request(app)
        .del(`/customers/${process.env.ID_TEST}/bankaccount/${bank}`)
        .expect(200);

      expect(response.body.deleted).toBe(true);
    } catch (error) {
      console.error(error);
    }
  });
});
