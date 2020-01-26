<template>
  <div>
    <q-card class="text-2b" v-if="!$store.state.layout.fullscreen">
      <q-card-section>
        <div class="row justify-between items-center no-wrap">
          <div class="text-h6 text-weight-regular">Details</div>
          <q-btn
            color="cyan"
            :flat="$q.screen.lt.md"
            :round="$q.screen.lt.md"
            size="sm"
            :to="`${$route.path}/edit-details`"
          >
            <q-icon :left="$q.screen.gt.sm" name="edit" />
            <div class="gt-sm">edit details</div>
          </q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-y-md">
          <div class="col-12 col-md-4">
            <q-list>
              <q-item-label header class="text-uppercase">
                Account
              </q-item-label>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">
                    Name
                  </q-item-label>
                  <q-item-label class="text-69">
                    {{ customerData.info.name }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">
                    Description
                  </q-item-label>
                  <q-item-label
                    class="text-69"
                    v-if="customerData.info.description"
                  >
                    {{ customerData.info.description }}
                  </q-item-label>
                  <q-item-label v-else class="text-grey">
                    No description
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">Email</q-item-label>
                  <q-item-label class="text-69">
                    {{ customerData.info.email }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">ID</q-item-label>
                  <q-item-label class="text-69">
                    {{ customerData.info.id }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">Created</q-item-label>
                  <q-item-label class="text-69">
                    {{
                      formatDate(
                        customerData.info.created * 1000,
                        'MMM D, YYYY h:mm A'
                      )
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">
                    Invoice prefix
                  </q-item-label>
                  <q-item-label class="text-69">
                    {{ customerData.info.invoice_prefix }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-12 col-md-4">
            <q-list>
              <q-item-label header class="text-uppercase">
                Billing
              </q-item-label>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">
                    Send emails to
                  </q-item-label>
                  <q-item-label class="text-69">
                    {{ customerData.info.email }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">
                    Billing address
                  </q-item-label>
                  <q-item-label
                    class="text-69"
                    v-if="customerData.info.address.line1"
                  >
                    {{ customerData.info.address.line1 }}<br />
                    <div v-if="customerData.info.address.line2">
                      {{ customerData.info.address.line2 }}<br />
                    </div>
                    {{ customerData.info.address.city }},
                    {{ customerData.info.address.state }}
                    {{ customerData.info.address.postal_code }}<br />
                    {{ customerData.info.address.country }}
                  </q-item-label>
                  <q-item-label v-else class="text-grey">
                    No address provided
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">
                    Phone number
                  </q-item-label>
                  <q-item-label class="text-69" v-if="customerData.info.phone">
                    {{
                      formatInternational(
                        customerData.info.phone,
                        customerData.info.address.country
                      )
                    }}
                  </q-item-label>
                  <q-item-label v-else class="text-grey">
                    No phone number provided
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-12 col-md-4">
            <q-list>
              <q-item-label header class="text-uppercase">
                Shipping
              </q-item-label>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">
                    Name
                  </q-item-label>
                  <q-item-label class="text-69">
                    {{ customerData.info.shipping.name }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">
                    Shipping address
                  </q-item-label>
                  <q-item-label
                    class="text-69"
                    v-if="customerData.info.shipping.address.line1"
                  >
                    {{ customerData.info.shipping.address.line1 }}<br />
                    <div v-if="customerData.info.shipping.address.line2">
                      {{ customerData.info.shipping.address.line2 }}<br />
                    </div>
                    {{ customerData.info.shipping.address.city }},
                    {{ customerData.info.shipping.address.state }}
                    {{ customerData.info.shipping.address.postal_code }}<br />
                    {{ customerData.info.shipping.address.country }}
                  </q-item-label>
                  <q-item-label v-else class="text-grey">
                    No address provided
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">
                    Phone number
                  </q-item-label>
                  <q-item-label
                    class="text-69"
                    v-if="customerData.info.shipping.phone"
                  >
                    {{
                      formatInternational(
                        customerData.info.shipping.phone,
                        customerData.info.shipping.address.country
                      )
                    }}
                  </q-item-label>
                  <q-item-label v-else class="text-grey">
                    No phone number provided
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { date } from 'quasar';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export default {
  name: 'CustomerDetails',
  props: {
    customerData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate: date.formatDate,
    formatInternational(value, country) {
      return parsePhoneNumberFromString(value, country).formatInternational();
    },
  },
};
</script>
