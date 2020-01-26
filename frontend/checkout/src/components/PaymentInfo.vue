<template>
  <div class="q-gutter-y-md">
    <div class="text-2b text-h6 q-mt-xl gt-sm">Payment information</div>
    <q-markup-table
      class="text-2b"
      :flat="$q.screen.lt.md"
      separator="cell"
      square
      wrap-cells
    >
      <tbody>
        <tr>
          <td>
            <div>Name on Card</div>
          </td>
          <td style="padding: 0">
            <div>
              <input id="name-input" type="text" required v-model="form.name" />
            </div>
          </td>
        </tr>
        <tr>
          <td class="gt-sm">
            <div>Card details</div>
          </td>
          <td :colspan="$q.screen.gt.sm ? 1 : 2" style="padding: 0">
            <div id="card-element">
              <!-- A Stripe Element will be inserted here. -->
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <div id="card-errors" role="alert" style="padding-left: calc(33% + 16px)">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { QSpinner } from 'quasar';

const stripe = Stripe('pk_test_GfqdcTRY5WTeKzKhV3X3RztR');
const elements = stripe.elements();
let card;

export default {
  name: 'PaymentInfo',
  data() {
    return {
      error: '',
      form: {
        name: '',
      },
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
    };
  },
  methods: {
    async createToken(invoice) {
      this.$q.loading.show({
        message: 'Sending payment...',
        spinner: QSpinner,
        sanitize: true,
      });

      const tokenData = {
        name: this.form.name,
        address_line1: invoice.customer.address.line1,
        address_line2: invoice.customer.address.line2,
        address_city: invoice.customer.address.city,
        address_state: invoice.customer.address.state,
        address_zip: invoice.customer.address.postal_code,
        address_country: invoice.customer.address.country,
        currency: invoice.customer.currency,
      };

      const { error, token } = await stripe.createToken(card, tokenData);

      if (error) {
        this.error = error.message;
        this.$q.loading.hide();
      } else {
        this.stripeTokenHandler(invoice, token);
      }
    },
    async stripeTokenHandler(invoice, token) {
      const charge = {
        amount: invoice.total,
        capture: true,
        currency: invoice.customer.currency,
        source: token.id,
      };

      try {
        const { data } = await this.$axios.post('/checkout/payments', charge);

        if (data.status === 'succeeded') {
          const response = await this.$axios.post(
            `/checkout/${this.$route.params.id}/pay`,
            data
          );

          const { email, receipt } = response.data;

          if (response.status === 200) {
            this.$router.push({ name: 'confirmation' }, () => {
              this.$store.dispatch('receipt/asyncSetReceipt', {
                email,
                receipt,
              });
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
  mounted() {
    card = elements.create('card', { style: this.style });
    card.mount('#card-element');
    card.addEventListener('change', event => {
      if (event.error) {
        this.error = event.error.message;
      } else {
        this.error = '';
      }
    });
  },
  beforeDestroy() {
    card.removeEventListener('change', event => {
      if (event.error) {
        this.error = event.error.message;
      } else {
        this.error = '';
      }
    });
  },
  destroyed() {
    card.destroy();
  },
};
</script>

<style lang="sass">
.q-markup-table td:first-child
  background-color: $grey-3
  width: 33%

.StripeElement
  background-color: white
  height: 40px
  padding: 10px 12px
  -webkit-transition: box-shadow 150ms ease
  transition: box-shadow 150ms ease

.StripeElement--webkit-autofill
  background-color: #fefde5 !important

#card-element
  padding: 10px

#card-errors
  height: 20px
  color: #fa755a

#name-input
  border-style: none
  height: 48px
  padding: 0 16px
  width: 100%
</style>
