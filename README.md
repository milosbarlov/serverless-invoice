# Serverless Invoice

> WIP

## Requirements

1. Domain name
2. [AWS account](https://aws.amazon.com/)
3. [Unsanboxed Amazon SES account](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html)
4. [Verify your domain](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domains.html)
5. [Stripe account](https://stripe.com/)
6. [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas)
7. [Node.js](https://nodejs.org/en/)

## Installation

```sh
npm install -g @quasar/cli # Node.js >= 8.9.0 is required.
npm install -g serverless # Node.js >= 6 required.
git clone https://github.com/Mirakurun/serverless-invoice.git
cd serverless-invoice/frontend/dashboard
npm install
cd serverless-invoice/frontend/checkout
npm install
cd serverless-invoice/backend/express
npm install
```

## Credentials

[AWS credentials for serverless](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

## Configuration

### Dashboard

```sh
cd frontend/dashboard
```

#### `quasar.conf.js`

```js
build: {
  env: ctx.dev
    ? { // dev
        API: JSON.stringify('http://localhost:3000/api'), // localhost API route
        STRIPE_KEY: JSON.stringify('pk_test_...'), // Stripe publishable test key
      }
    : { // prod
        API: JSON.stringify('https://domain.com/api'), // Production API route
        STRIPE_KEY: JSON.stringify('pk_..._...'), // Stripe publishable key
      },
}
```

### Checkout

```sh
cd frontend/checkout
```

#### `quasar.conf.js`

```js
build: {
  env: ctx.dev
    ? { // dev
        API: JSON.stringify('http://localhost:3000'), // localhost API route
      }
    : { // prod
        API: JSON.stringify('https://domain.com/api'), // Production API route
      },
}
```

### Express

```sh
cd backend/express/config
```

#### `config.js`

```js
// AWS SES config
module.exports.config = {
  from: 'sender@domain.com', // email address of sender
  region: 'us-east-1', // AWS region
  sendingRate: 1, // How many messages per second is allowed to be delivered to SES (check your AWS account for rate limit)
};
```

#### `dev.env`

```yml
# Local dev environment variables
PORT=3000 # port number
SK_TEST=sk_test_... # Stripe secret API test key
DB_URI=mongodb://localhost:27017/serverless_invoice # MongoDB localhost URI
SECRET= # JWT secret
INVOICE_URL=http://localhost:8081 # 'Checkout' app localhost and port number
```

#### `test.env`

```yml
# Unit testing environment variables
PORT=3000 # port number
SK_TEST=sk_test_... # Stripe secret API test key
ID_TEST=cus_... # Customer test ID
DB_URI=mongodb://localhost:27017/serverless_invoice # MongoDB localhost URI
SECRET= # JWT secret
```

#### `env.yml`

```yml
# AWS Lambda environment variables
dev: # Amazon API Gateway stage (dev, prod, etc.)
  SK_TEST: "sk_..._..." # Stripe secret API key
  DB_URI: "mongodb://..." # Hosted MongoDB URI
  SECRET: "" # JWT secret
  INVOICE_URL: "https://checkout.domain.com" # 'Checkout' app hosted url
```

## Development

Starts a Node.js local development server.

### Dashboard

```sh
cd frontend/dashboard
quasar dev
```

### Checkout

```sh
cd frontend/checkout
quasar dev
```

### Express

```sh
cd backend/express
npm run dev
```

## Unit testing

### Express

```sh
cd backend/express
npm test
```

## Production

Build assets for production

### Dashboard

```sh
cd frontend/dashboard
quasar build
```

### Checkout

```sh
cd frontend/checkout
quasar build
```

### Express

The `serverless package` command packages your entire infrastructure into the `.serverless` directory by default and make it ready for deployment. 

```sh
cd backend/express
serverless package
```

## Deployment

### Express

```sh
cd backend/express
serverless deploy --package .serverless
```
