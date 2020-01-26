<template>
  <q-page class="container" padding>
    <form @submit.prevent="pay">
      <div class="text-69 text-center text-h5 q-mb-md">Checkout</div>
      <q-separator class="q-mb-xl" />
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-7 q-gutter-y-md">
          <q-list bordered separator v-if="$q.screen.lt.md">
            <q-expansion-item
              header-class="text-primary"
              icon="fas fa-file-invoice"
              label="Invoice details"
            >
              <invoice-details :invoice="invoice" />
            </q-expansion-item>
            <q-expansion-item
              header-class="text-primary"
              icon="fas fa-credit-card"
              label="Payment information"
              v-if="!isPastDue(invoice.due_date)"
            >
              <payment-info ref="payment" />
            </q-expansion-item>
            <q-expansion-item
              header-class="text-primary"
              icon="fas fa-user"
              label="Customer information"
            >
              <customer-info :invoice="invoice" />
            </q-expansion-item>
          </q-list>

          <invoice-details :invoice="invoice" v-if="$q.screen.gt.sm" />

          <payment-info
            ref="payment"
            v-if="$q.screen.gt.sm && !isPastDue(invoice.due_date)"
          />

          <customer-info :invoice="invoice" v-if="$q.screen.gt.sm" />
        </div>
        <div class="col-12 col-md-5 q-gutter-y-md">
          <div class="text-2b text-h6">Order details</div>
          <q-separator />
          <div class="row items-center">
            <div class="text-overline">Item count</div>
            <q-chip color="deep-orange" text-color="white" dense v-if="invoice">
              {{ itemTotal }}
            </q-chip>
          </div>
          <div v-if="invoice">
            <div v-for="(line, index) in invoice.lines" :key="index">
              <div class="row justify-between text-subtitle2">
                <div>
                  {{ line.description }} &times; {{ line.quantity }} @
                  {{ line.unit_amount | currencyFormat }}
                </div>
                <div>{{ line.amount | currencyFormat }}</div>
              </div>
              <div class="text-caption" v-if="line.item_discount">
                {{ line.item_discount | currencyFormat }} off
              </div>
            </div>
          </div>
          <q-separator />
          <div class="row justify-between">
            <div>Subtotal</div>
            <div>{{ invoice.subtotal | currencyFormat }}</div>
          </div>
          <div
            class="row justify-between text-positive"
            v-if="invoice.discount"
          >
            <div>Total discount</div>
            <div>{{ invoice.discount | currencyFormat }}</div>
          </div>
          <div class="row justify-between" v-if="invoice.shippable">
            <div>Shipping</div>
            <div v-if="invoice.shipping">
              {{ invoice.shipping | currencyFormat }}
            </div>
            <div class="text-positive" v-else>Free</div>
          </div>
          <q-separator />
          <div class="row justify-between text-subtitle1 text-weight-medium">
            <div>Total</div>
            <div>{{ invoice.total | currencyFormat }}</div>
          </div>
          <div
            class="text-h6 text-center text-negative"
            v-if="isPastDue(invoice.due_date)"
          >
            PAST DUE
          </div>
          <div
            class="text-h6 text-center text-positive"
            v-else-if="invoice.status === 'paid'"
          >
            PAID
          </div>
          <q-btn
            class="full-width q-mt-lg"
            color="primary"
            no-caps
            rounded
            size="lg"
            type="submit"
            v-else
          >
            Pay Invoice
          </q-btn>

          <q-banner class="bg-grey-3 q-mt-xl" v-if="invoice.footer">
            {{ invoice.footer }}
          </q-banner>
        </div>
      </div>
    </form>
  </q-page>
</template>

<script>
import { Loading, QSpinner } from 'quasar';
import { axiosInstance } from 'boot/axios';
import InvoiceDetails from 'components/InvoiceDetails.vue';
import CustomerInfo from 'components/CustomerInfo.vue';
import PaymentInfo from 'components/PaymentInfo.vue';
import { isPastDue } from 'utils/date';

export default {
  name: 'Checkout',
  async beforeRouteEnter(to, from, next) {
    Loading.show({
      message: 'Loading invoice...',
      spinner: QSpinner,
      spinnerColor: 'purple',
      sanitize: true,
    });

    try {
      const { status, data } = await axiosInstance.get(
        `/checkout/${to.params.id}`
      );

      if (status === 200) {
        next(vm => {
          vm.invoice = data;
        });
      }
    } catch (error) {
      console.error(error);
      next('*');
    } finally {
      Loading.hide();
    }
  },
  data() {
    return {
      invoice: '',
    };
  },
  components: {
    invoiceDetails: InvoiceDetails,
    customerInfo: CustomerInfo,
    paymentInfo: PaymentInfo,
  },
  computed: {
    itemTotal() {
      return this.invoice.lines.reduce((total, value) => {
        return total + +value.quantity;
      }, 0);
    },
  },
  filters: {
    currencyFormat(value) {
      if (value) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(value / 100);
      }
      return null;
    },
  },
  methods: {
    pay() {
      this.$refs.payment.createToken(this.invoice);
    },
    isPastDue,
  },
};
</script>

<style lang="sass" scoped>
.container
  max-width: 1200px
  margin-left: auto
  margin-right: auto
</style>
