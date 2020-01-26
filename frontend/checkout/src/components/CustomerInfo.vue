<template>
  <div class="q-gutter-y-md">
    <div class="text-2b text-h6 q-mt-xl gt-sm">Customer information</div>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      no-caps
    >
      <q-tab name="billing" label="Billing" />
      <q-tab name="shipping" label="Shipping" />
    </q-tabs>
    <div :class="{ 'shadow-2': $q.screen.gt.sm }">
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel class="q-pa-none" name="billing" style="height: 384px">
          <q-markup-table
            class="text-2b"
            separator="cell"
            square
            wrap-cells
            v-if="invoice"
          >
            <tbody>
              <tr>
                <td>
                  <div>Name</div>
                </td>
                <td>
                  <div>{{ invoice.customer.name }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>Email</div>
                </td>
                <td>
                  <div>{{ invoice.customer.email }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>Phone</div>
                </td>
                <td>
                  <div>{{ invoice.customer.phone | phoneFormat }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>Country</div>
                </td>
                <td>
                  <div>{{ invoice.customer.address.country }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>Street address</div>
                </td>
                <td>
                  <div>
                    {{ invoice.customer.address.line1 }}
                    <span v-if="invoice.customer.address.line2">
                      {{ invoice.customer.address.line2 }}
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>City</div>
                </td>
                <td>
                  <div>{{ invoice.customer.address.city }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>State</div>
                </td>
                <td>
                  <div>{{ invoice.customer.address.state }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>Zip code</div>
                </td>
                <td>
                  <div>{{ invoice.customer.address.postal_code }}</div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-tab-panel>
        <q-tab-panel class="q-pa-none" name="shipping" style="height: 384px">
          <q-markup-table
            class="text-2b"
            separator="cell"
            square
            wrap-cells
            v-if="invoice"
          >
            <tbody>
              <tr>
                <td>
                  <div>Name</div>
                </td>
                <td>
                  <div>{{ invoice.customer.shipping.name }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>Phone</div>
                </td>
                <td>
                  <div>
                    {{ invoice.customer.shipping.phone | phoneFormat }}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>Country</div>
                </td>
                <td>
                  <div>{{ invoice.customer.shipping.address.country }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>Street address</div>
                </td>
                <td>
                  <div>
                    {{ invoice.customer.shipping.address.line1 }}
                    <span v-if="invoice.customer.shipping.address.line2">
                      {{ invoice.customer.shipping.address.line2 }}
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>City</div>
                </td>
                <td>
                  <div>{{ invoice.customer.shipping.address.city }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>State</div>
                </td>
                <td>
                  <div>{{ invoice.customer.shipping.address.state }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>Zip code</div>
                </td>
                <td>
                  <div>
                    {{ invoice.customer.shipping.address.postal_code }}
                  </div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export default {
  name: 'CustomerInfo',
  props: {
    invoice: {
      type: [Object, String],
      required: true,
    },
  },
  data() {
    return {
      tab: 'billing',
    };
  },
  filters: {
    phoneFormat(value) {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber.formatInternational();
    },
  },
};
</script>

<style lang="sass">
.q-markup-table td:first-child
  background-color: $grey-3
  width: 33%
</style>
