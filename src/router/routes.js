const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
      },
      {
        path: '/customers',
        component: () => import('pages/customers/Customers.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/customers/CustomersHome.vue'),
          },
          {
            path: 'add',
            component: () => import('pages/customers/CustomerAdd.vue'),
          },
          {
            path: ':id',
            component: () => import('pages/customers/Customer.vue'),
            children: [
              {
                name: 'customer-profile',
                path: '',
                component: () => import('pages/customers/CustomerProfile.vue'),
              },
              {
                name: 'customer-edit-details',
                path: 'edit-details',
                component: () =>
                  import('pages/customers/CustomerEditDetails.vue'),
              },
              {
                name: 'customer-add-bank-account',
                path: 'add-bank-account',
                component: () =>
                  import('pages/customers/CustomerAddBankAccount.vue'),
              },
              {
                name: 'customer-add-card',
                path: 'add-card',
                component: () => import('pages/customers/CustomerAddCard.vue'),
              },
              {
                name: 'customer-edit-card',
                path: 'edit-card',
                component: () => import('pages/customers/CustomerEditCard.vue'),
              },
            ],
          },
        ],
      },
      {
        path: '/invoices',
        component: () => import('pages/invoices/Invoices.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/invoices/InvoicesHome.vue'),
          },
          {
            path: ':invoice',
            component: () => import('pages/invoices/Invoice.vue'),
          },
        ],
      },
      {
        path: '/payments',
        component: () => import('pages/payments/Payments.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/payments/PaymentsHome.vue'),
          },
          {
            path: ':id',
            component: () => import('pages/payments/Payment.vue'),
          },
        ],
      },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
