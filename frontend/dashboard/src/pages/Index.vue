<template>
  <q-page>
    <div class="bg-grey-3 flex flex-center" style="height: 50vh">
      <div class="block q-gutter-y-xl">
        <div
          class="text-2b text-center"
          :class="{ 'text-h1': $q.screen.gt.xs, 'text-h2': $q.screen.lt.sm }"
        >
          Serverless Invoice
        </div>
        <div class="flex flex-center">
          <q-btn
            color="cyan"
            icon-right="arrow_right_alt"
            label="demo"
            outline
            size="lg"
            to="/login"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8 offset-md-2 q-px-md q-py-xl">
        <div
          class="row q-col-gutter-xl"
          :class="{ 'text-center': $q.screen.lt.sm }"
        >
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="q-gutter-y-md">
              <q-icon
                color="cyan"
                name="fas fa-file-invoice fa-fw"
                size="3rem"
              />
              <div class="text-h6 text-2b">Invoice</div>
              <div class="text-69">
                Create, customize, and send invoices anytime online. Email
                invoices to your customer.
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="q-gutter-y-md">
              <q-icon color="cyan" name="fas fa-server fa-fw" size="3rem" />
              <div class="text-h6 text-2b">Serverless</div>
              <div class="text-69">
                Backend components are running on fully managed services: Amazon
                API Gateway, AWS Lambda, Amazon S3, Amazon CloudFront, Amazon
                SES, and MongoDB Atlas.
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="q-gutter-y-md">
              <q-icon
                color="cyan"
                name="fas fa-hand-holding-usd fa-fw"
                size="3rem"
              />
              <div class="text-h6 text-2b">Get Paid</div>
              <div class="text-69">
                Accept credit card and bank payments online.
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="q-gutter-y-md">
              <q-icon
                color="cyan"
                name="fas fa-tachometer-alt fa-fw"
                size="3rem"
              />
              <div class="text-h6 text-2b">Dashboard</div>
              <div class="text-69">
                Manage customers, payments, business settings, and more on the
                admin dashboard.
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="q-gutter-y-md">
              <q-icon color="cyan" name="fas fa-chart-line fa-fw" size="3rem" />
              <div class="text-h6 text-2b">Data Analytics</div>
              <div class="text-69">
                Analyze data to make business decisions.
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="q-gutter-y-md">
              <q-icon color="cyan" name="fab fa-stripe fa-fw" size="3rem" />
              <div class="text-h6 text-2b">Payment Processor</div>
              <div class="text-69">
                Payment processing powered by Stripe.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row items-center bg-grey-10 text-white" style="height: 50px">
      <div class="col-md-8 offset-md-2 q-px-md">
        Created by Kevin Chhay
      </div>
    </div>
  </q-page>
</template>

<style></style>

<script>
export default {
  name: 'PageIndex',
};
</script>
