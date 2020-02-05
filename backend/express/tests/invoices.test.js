const request = require('supertest');
const app = require('../app');

test('Get invoices', async () => {
  try {
    const response = await request(app)
      .get('/invoices')
      .expect(200);

    expect(typeof response.body.invoices).toBe('object');
  } catch (error) {
    console.error(error);
  }
});

test('Get 10 invoices or less', async () => {
  try {
    const response = await request(app)
      .get('/invoices')
      .query({
        descending: true,
        page: 1,
        rowsPerPage: 10,
        sortBy: 'createdAt',
      })
      .expect(200);

    expect(response.body.invoices.length).toBeLessThanOrEqual(10);
  } catch (error) {
    console.error(error);
  }
});

describe('Creating a new invoice', () => {
  let invoice = '';

  test('Add invoice', async () => {
    try {
      const response = await request(app)
        .post('/invoices')
        .send({
          customer: {
            id: 'cus_test',
            invoice_prefix: 'ABCDEF',
          },
          shippable: true,
          shipping: '0',
          subtotal: '100',
          total: '100',
        })
        .expect(201);

      expect(response.body.object).toBe('invoice');

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

      expect(response.body._id).toBe(invoice);
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
