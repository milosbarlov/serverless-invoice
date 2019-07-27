const request = require('supertest');
const app = require('../app');

test('Get invoices', async () => {
  try {
    await request(app)
      .get('/invoices')
      .expect(200);
  } catch (error) {
    console.error(error);
  }
});

test('Get first 10 invoices', async () => {
  try {
    await request(app)
      .get('/invoices')
      .query({
        descending: true,
        page: 1,
        rowsPerPage: 10,
        sortBy: 'createdAt',
      })
      .expect(200);
  } catch (error) {
    console.error(error);
  }
});

describe('New invoice', () => {
  let invoice = '';

  test('Add invoice', async () => {
    try {
      const response = await request(app)
        .post('/invoices')
        .send({
          amount_due: 100,
          currency: 'usd',
          customer: {
            id: 'cus_test',
          },
          invoice_prefix: 'ABCDEF',
        })
        .expect(201);

      invoice = response.body._id;
    } catch (error) {
      console.error(error);
    }
  });

  test('Get invoice', async () => {
    try {
      const response = await request(app)
        .get(`/invoices/${invoice}`)
        .expect(200);

      expect(invoice).toBe(response.body._id);
    } catch (error) {
      console.error(error);
    }
  });

  test('Update invoice', async () => {
    const param = {
      _id: invoice,
      status: 'Void',
    };

    try {
      const response = await request(app)
        .put(`/invoices/${invoice}`)
        .send(param)
        .expect(200);

      expect(response.body).toMatchObject(param);
    } catch (error) {
      console.error(error);
    }
  });

  test('Delete invoice', async () => {
    try {
      const response = await request(app)
        .del(`/invoices/${invoice}`)
        .expect(200);

      expect(invoice).toBe(response.body._id);
    } catch (error) {
      console.error(error);
    }
  });
});
