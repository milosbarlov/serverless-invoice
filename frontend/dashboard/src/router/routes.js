import store from 'src/store/index';

const Store = store();

const routes = [
  {
    path: '/',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('pages/Index.vue'),
        meta: { title: 'Serverless Invoice' },
      },
      {
        name: 'login',
        path: '/login',
        component: () => import('pages/login/Login.vue'),
        meta: { backBtn: true, title: 'Login' },
        beforeEnter(to, from, next) {
          if (Store.state.auth.token) {
            next('/dashboard');
          } else {
            next();
          }
        },
      },
    ],
  },
  {
    path: '/customers',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        name: 'customers',
        path: '',
        component: () => import('pages/customers/CustomersHome.vue'),
        meta: { title: 'Customers' },
      },
      {
        name: 'add-customer',
        path: 'add',
        component: () => import('pages/customers/CustomerAdd.vue'),
        meta: {
          backBtn: true,
          submitBtn: true,
          submitText: 'Create',
          title: 'New Customer',
        },
      },
      {
        path: ':id',
        component: () => import('pages/customers/Customer.vue'),
        children: [
          {
            name: 'customer-profile',
            path: '',
            component: () => import('pages/customers/CustomerProfile.vue'),
            meta: { backBtn: true, title: 'Customer' },
          },
          {
            name: 'customer-edit-details',
            path: 'edit-details',
            component: () => import('pages/customers/CustomerEditDetails.vue'),
            meta: {
              backBtn: true,
              submitBtn: true,
              submitText: 'save',
              title: 'Edit Details',
            },
          },
          {
            name: 'customer-add-bank-account',
            path: 'add-bank-account',
            component: () =>
              import('pages/customers/CustomerAddBankAccount.vue'),
            meta: {
              backBtn: true,
              submitBtn: true,
              submitText: 'create',
              title: 'New Bank Account',
            },
          },
          {
            name: 'customer-add-card',
            path: 'add-card',
            component: () => import('pages/customers/CustomerAddCard.vue'),
            meta: {
              backBtn: true,
              submitBtn: true,
              submitText: 'create',
              title: 'New Card',
            },
          },
          {
            name: 'customer-edit-card',
            path: 'edit-card',
            component: () => import('pages/customers/CustomerEditCard.vue'),
            meta: {
              backBtn: true,
              submitBtn: true,
              submitText: 'save',
              title: 'Edit Card',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        name: 'dashboard',
        path: '',
        component: () => import('pages/dashboard/Dashboard.vue'),
        meta: { title: 'Dashboard' },
      },
    ],
  },
  {
    path: '/invoices',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        name: 'invoices-home',
        path: '',
        component: () => import('pages/invoices/InvoicesHome.vue'),
        meta: { title: 'Invoice' },
      },
      {
        path: 'create',
        component: () => import('pages/invoices/InvoiceCreate.vue'),
        children: [
          {
            name: 'invoice-create-home',
            path: '',
            component: () => import('pages/invoices/InvoiceCreateHome.vue'),
            meta: { backBtn: true, title: 'Create Invoice' },
          },
          {
            name: 'add-item',
            path: 'add-item',
            component: () => import('pages/invoices/InvoiceAddItem.vue'),
            meta: {
              backBtn: true,
              submitBtn: true,
              submitText: 'add',
              title: 'Add Item',
            },
          },
          {
            name: 'add-shipping',
            path: 'add-shipping',
            component: () => import('pages/invoices/InvoiceAddShipping.vue'),
            meta: {
              backBtn: true,
              submitBtn: true,
              submitText: 'add',
              title: 'Add Shipping',
            },
          },
          {
            name: 'edit-item',
            path: 'edit-item',
            component: () => import('pages/invoices/InvoiceEditItem.vue'),
            meta: {
              backBtn: true,
              submitBtn: true,
              submitText: 'save',
              title: 'Edit Item',
            },
          },
        ],
      },
      {
        path: ':id',
        component: () => import('pages/invoices/Invoice.vue'),
        children: [
          {
            name: 'invoice-home',
            path: '',
            component: () => import('pages/invoices/InvoiceHome.vue'),
            meta: { title: 'Invoice' },
          },
          {
            name: 'edit-invoice',
            path: 'edit',
            component: () => import('pages/invoices/InvoiceCreateHome.vue'),
            meta: { backBtn: true, kebabMenu: true, title: 'Edit Invoice' },
          },
        ],
      },
    ],
  },
  {
    path: '/payments',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        name: 'payments',
        path: '',
        component: () => import('pages/payments/PaymentsHome.vue'),
        meta: { title: 'Payments' },
      },
      {
        name: 'Payment',
        path: ':id',
        component: () => import('pages/payments/Payment.vue'),
        meta: { backBtn: true, title: 'Payment' },
      },
    ],
  },
  {
    path: '/settings',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        name: 'settings',
        path: '',
        component: () => import('pages/settings/Settings.vue'),
        meta: {
          backBtn: true,
          submitBtn: true,
          submitText: 'save',
          title: 'Settings',
        },
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
