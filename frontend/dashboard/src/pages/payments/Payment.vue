<template>
  <q-page
    :class="[{ 'bread-crumb-padding': $q.screen.gt.sm }, 'container']"
    :padding="!$q.platform.is.mobile"
  >
    <div class="q-gutter-y-md">
      <q-card class="text-2b">
        <q-card-section>
          <div class="row justify-between items-center">
            <div class="text-h6">
              {{ (payment.amount / 100) | formatCurrency(payment.currency) }}
              <span class="text-subtitle2">{{
                payment.currency.toUpperCase()
              }}</span>
              <q-chip
                v-if="payment.refunded"
                color="blue-grey-1"
                dense
                icon-right="reply"
                text-color="blue-grey"
                >Refunded</q-chip
              >
              <q-chip
                v-else-if="payment.status === 'succeeded'"
                color="green-1"
                dense
                icon-right="check"
                text-color="green"
                >Succeeded</q-chip
              >
              <q-chip
                v-else-if="payment.status === 'pending'"
                color="blue-1"
                dense
                icon-right="access_time"
                text-color="blue"
                >Pending</q-chip
              >
              <q-chip
                v-else-if="payment.status === 'failed'"
                color="red-1"
                dense
                icon-right="warning"
                text-color="red"
                >Failed</q-chip
              >
            </div>
            <q-btn
              v-if="!payment.refunded"
              @click="showRefundDialog = true"
              icon="reply"
              label="Refund..."
              size="sm"
            />
          </div>
        </q-card-section>
      </q-card>
      <q-card class="text-2b">
        <q-card-section>
          <div class="text-h6">Payment details</div>
        </q-card-section>
        <q-separator />
        <q-markup-table class="text-2b" separator="none" square wrap-cells>
          <tbody>
            <tr>
              <td style="width: 200px">
                <div class="text-subtitle2">Amount</div>
              </td>
              <td>
                <div class="text-69 text-body2">
                  {{
                    (payment.amount / 100) | formatCurrency(payment.currency)
                  }}
                </div>
              </td>
            </tr>
            <tr>
              <td style="width: 200px">
                <div class="text-subtitle2">Fee</div>
              </td>
              <td>
                <div class="text-69 text-body2">
                  {{ payment.application_fee_amount || 'N/A' }}
                </div>
              </td>
            </tr>
            <tr>
              <td style="width: 200px">
                <div class="text-subtitle2">Net</div>
              </td>
              <td>
                <div class="text-69 text-body2">
                  {{
                    ((payment.amount - payment.application_fee_amount) / 100)
                      | formatCurrency(payment.currency)
                  }}
                </div>
              </td>
            </tr>
            <tr>
              <td style="width: 200px">
                <div class="text-subtitle2">Status</div>
              </td>
              <td>
                <div class="text-69 text-body2 text-capitalize">
                  {{ payment.status }}
                </div>
              </td>
            </tr>
            <tr>
              <td style="width: 200px">
                <div class="text-subtitle2">Description</div>
              </td>
              <td>
                <div class="text-69 text-body2">
                  {{ payment.description }}
                </div>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card>
      <q-card class="text-2b">
        <q-card-section>
          <div class="text-h6">Payment method</div>
        </q-card-section>
        <q-separator />
        <div class="row">
          <div class="col-12 col-md-6">
            <q-markup-table class="text-2b" flat separator="none" wrap-cells>
              <tbody>
                <tr>
                  <td style="width: 200px">
                    <div class="text-subtitle2">Number</div>
                  </td>
                  <td>
                    <div class="text-69 text-body2">
                      {{ payment.payment_method_details.card.last4 }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width: 200px">
                    <div class="text-subtitle2">Fingerprint</div>
                  </td>
                  <td>
                    <div class="text-69 text-body2">
                      {{ payment.payment_method_details.card.fingerprint }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width: 200px">
                    <div class="text-subtitle2">Expires</div>
                  </td>
                  <td>
                    <div class="text-69 text-body2">
                      {{ payment.payment_method_details.card.exp_month }} /
                      {{ payment.payment_method_details.card.exp_year }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width: 200px">
                    <div class="text-subtitle2">Type</div>
                  </td>
                  <td>
                    <div class="text-69 text-body2 text-capitalize">
                      {{ payment.payment_method_details.card.brand }}
                      {{ payment.payment_method_details.card.funding }}
                      {{ payment.payment_method_details.type }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width: 200px">
                    <div class="text-subtitle2">ID</div>
                  </td>
                  <td>
                    <div class="text-69 text-body2">{{ payment.id }}</div>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div class="col-12 col-md-6">
            <q-markup-table class="text-2b" flat separator="none" wrap-cells>
              <tbody>
                <tr>
                  <td style="width: 200px">
                    <div class="text-subtitle2">Postal code</div>
                  </td>
                  <td>
                    <div class="text-69 text-body2">
                      {{ payment.billing_details.address.postal_code || 'N/A' }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width: 200px">
                    <div class="text-subtitle2">Origin</div>
                  </td>
                  <td>
                    <div class="text-69 text-body2">
                      {{ payment.payment_method_details.card.country }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width: 200px">
                    <div class="text-subtitle2">CVC check</div>
                  </td>
                  <td>
                    <div
                      :class="{
                        'text-69': true,
                        'text-body2': true,
                        'text-capitalize': true,
                        'text-positive':
                          payment.payment_method_details.card.checks
                            .address_postal_code_check === 'pass',
                        'text-negative':
                          payment.payment_method_details.card.checks
                            .address_postal_code_check === 'failed',
                      }"
                    >
                      {{
                        payment.payment_method_details.card.checks.cvc_check ||
                          'N/A'
                      }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width: 200px">
                    <div class="text-subtitle2">Zip check</div>
                  </td>
                  <td>
                    <div
                      :class="{
                        'text-69': true,
                        'text-body2': true,
                        'text-capitalize': true,
                        'text-positive':
                          payment.payment_method_details.card.checks
                            .address_postal_code_check === 'pass',
                        'text-negative':
                          payment.payment_method_details.card.checks
                            .address_postal_code_check === 'failed',
                      }"
                    >
                      {{
                        payment.payment_method_details.card.checks
                          .address_postal_code_check || 'N/A'
                      }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
      </q-card>
    </div>

    <!-- Payment refund dialog -->
    <payment-refund-dialog
      :amount="payment.amount"
      :amount-refunded="payment.amount_refunded"
      :currency="payment.currency"
      :id="payment.id"
      :show-dialog.sync="showRefundDialog"
    />

    <!-- Breadcrumbs -->
    <bread-crumbs :breadcrumbs="breadcrumbs" />
  </q-page>
</template>

<script>
import { Loading, QSpinner } from 'quasar';
import { axiosInstance } from 'boot/axios';
import { axiosError, notifyError } from 'utils/error-handler';
import { formatCurrency } from 'utils/currency';
import PaymentRefundDialog from 'components/payments/PaymentRefundDialog.vue';
import BreadCrumbs from 'components/BreadCrumbs.vue';
import store from 'src/store/index';

export default {
  name: 'Payment',
  async beforeRouteEnter(to, from, next) {
    const Store = store();

    Loading.show({
      message: 'Loading payment...',
      spinner: QSpinner,
      spinnerColor: 'purple',
      sanitize: true,
    });

    try {
      const { status, data } = await axiosInstance.get(
        `/payments/${to.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${Store.state.auth.token}`,
          },
        }
      );

      if (status === 200) {
        next(vm => {
          vm.payment = data;
        });
      }
    } catch (error) {
      notifyError(axiosError(error));
      next('*');
    } finally {
      Loading.hide();
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Payments',
          link: '/payments',
        },
        {
          label: this.$route.params.id,
          link: '',
        },
      ],
      payment: {
        application_fee_amount: '',
        amount: '',
        amount_refunded: '',
        billing_details: {
          address: {
            country: '',
          },
        },
        currency: '',
        description: '',
        id: '',
        payment_method_details: {
          card: {
            last4: '',
            fingerprint: '',
            exp_month: '',
            exp_year: '',
            brand: '',
            funding: '',
            country: '',
            checks: {
              cvc_check: '',
              address_postal_code_check: '',
            },
          },
        },
        status: '',
      },
      showRefundDialog: false,
    };
  },
  components: {
    paymentRefundDialog: PaymentRefundDialog,
    breadCrumbs: BreadCrumbs,
  },
  filters: {
    formatCurrency,
  },
};
</script>

<style lang="stylus" scoped>
.container
  max-width 1000px
  margin-left auto
  margin-right auto

.q-table td::before
  background none
</style>
