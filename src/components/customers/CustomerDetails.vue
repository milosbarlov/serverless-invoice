<template>
  <div>
    <q-card class="q-mb-md" v-if="!$store.state.layout.fullscreen">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="text-h6 text-weight-regular">Details</div>
          <q-space />
          <q-btn
            class="gt-sm"
            color="primary"
            :to="`${$route.path}/edit-details`"
          >
            <q-icon left name="fas fa-user-edit" size="1rem" />
            <div>edit details</div>
          </q-btn>
          <q-btn
            round
            class="lt-md"
            color="primary"
            :to="`${$route.path}/edit-details`"
          >
            <q-icon name="fas fa-user-edit" size="1rem" />
          </q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-sm">
        <q-list>
          <q-item-label header>Account Information</q-item-label>
          <q-item>
            <q-item-section>
              <q-item-label>ID</q-item-label>
              <q-item-label caption>{{ customerData.info.id }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Created</q-item-label>
              <q-item-label caption>
                {{
                  $moment
                    .unix(customerData.info.created)
                    .format('YYYY/MM/DD h:mm A')
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Email</q-item-label>
              <q-item-label caption>{{ customerData.info.email }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Description</q-item-label>
              <q-item-label caption>
                {{ customerData.info.description }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Invoice prefix</q-item-label>
              <q-item-label caption>
                {{ customerData.info.invoice_prefix }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item-label header>Billing Information</q-item-label>
          <q-item>
            <q-item-section>
              <q-item-label>Send emails to</q-item-label>
              <q-item-label caption>
                {{ customerData.info.email }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Billing address</q-item-label>
              <q-item-label caption>
                <div
                  v-if="customerData.info.shipping.address.line1 === null"
                  class="text-grey"
                >
                  No address provided
                </div>
                <address v-else>
                  {{ customerData.info.shipping.address.line1 }}<br />
                  <div v-if="customerData.info.shipping.address.line2">
                    {{ customerData.info.shipping.address.line2 }}<br />
                  </div>
                  {{ customerData.info.shipping.address.city }},
                  {{ customerData.info.shipping.address.state }}
                  {{ customerData.info.shipping.address.postal_code }}<br />
                  {{ customerData.info.shipping.address.country }}
                </address>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Phone number</q-item-label>
              <q-item-label caption>
                {{ customerData.info.shipping.phone }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'CustomerDetails',
  props: {
    customerData: {
      type: Object,
      required: true,
    },
  },
};
</script>
