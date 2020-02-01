<template>
  <q-dialog v-model="toggleDialog" @hide="reset">
    <q-card class="text-2b" style="width: 500px">
      <q-card-section>
        <div class="row items-center">
          <div class="text-h6">Create a new payment</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="toggleDialog = false">
            <q-tooltip :content-style="{ 'font-size': '14px' }">
              close
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <alert :alert="message ? true : false" :message="message" />
      <q-card-section>
        <div class="q-gutter-y-md">
          <!-- Note -->
          <q-banner class="text-light-blue-8 bg-light-blue-1">
            <div class="text-subtitle1">Test card numbers</div>
            Genuine card information cannot be used in test mode. Instead, use
            any of the following test card numbers, a valid expiration date in
            the future, and any random CVC number, to create a successful
            payment.
            <ul>
              <li>4242 4242 4242 4242 Visa</li>
              <li>4000 0566 5566 5556 Visa (debit)</li>
              <li>5555 5555 5555 4444 Mastercard</li>
              <li>2223 0031 2200 3222 Mastercard (2-series)</li>
              <li>5200 8282 8282 8210 Mastercard (debit)</li>
              <li>5105 1051 0510 5100 Mastercard (prepaid)</li>
              <li>3782 822463 10005 American Express</li>
              <li>3714 496353 98431 American Express</li>
              <li>6011 1111 1111 1117 Discover</li>
              <li>6011 0009 9013 9424 Discover</li>
              <li>3056 9300 0902 0004 Diners Club</li>
              <li>3622 7206 2716 67 Diners Club (14 digit card)</li>
              <li>3566 0020 2036 0505 JCB</li>
              <li>6200 0000 0000 0005 UnionPay</li>
            </ul>
          </q-banner>
          <!-- Amount -->
          <q-input
            dense
            @change="$v.form.amount.$touch"
            color="cyan"
            bottom-slots
            :error="$v.form.amount.$error"
            error-message="Minimum charge amount is $0.50"
            fill-mask="0"
            label="Amount"
            mask="#.##"
            outlined
            prefix="$"
            reverse-fill-mask
            v-model="form.amount"
          />
          <!-- Payment method -->
          <q-select
            color="cyan"
            dense
            filled
            v-if="$route.name === 'customer-profile'"
            v-model="source"
            label="Payment method"
            :options="options"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No payment method found
                </q-item-section>
              </q-item>
            </template>
            <template #option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section avatar>
                  <q-icon :name="scope.opt.icon" size="2rem" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ scope.opt.label }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <!-- Stripe card element -->
          <card-element v-else />
          <!-- Description -->
          <q-input
            color="cyan"
            dense
            outlined
            v-model.trim="form.description"
            label="Description"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          outline
          @click="toggleDialog = false"
          label="cancel"
          color="cyan"
        />
        <q-btn @click="charge" color="cyan" label="Charge customer" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { QSpinner } from 'quasar';
import CardElement from 'components/stripe/CardElement.vue';
import { createNamespacedHelpers } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import Alert from 'components/Alert.vue';
import { axiosError } from 'utils/error-handler';
import { notifySuccess } from 'utils/success-handler';
import { zeroDecimalCurrencies } from 'utils/currency';

const { mapGetters, mapMutations } = createNamespacedHelpers('stripe');

export default {
  name: 'PaymentsAddChargeDialog',
  props: {
    showDialog: { type: Boolean, required: true },
    sourceData: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultSource: { type: String, default: '' },
  },
  data() {
    return {
      form: {
        amount: 0,
        capture: true,
        currency: 'usd',
        description: '',
        source: '',
      },
      message: '',
      options: [],
      source: {},
    };
  },
  validations: {
    form: {
      amount: {
        required,
        minValue: val => val >= 0.5,
      },
    },
  },
  components: {
    alert: Alert,
    cardElement: CardElement,
  },
  computed: {
    ...mapGetters(['getElement', 'getError', 'getValue']),
    toggleDialog: {
      get() {
        return this.showDialog;
      },
      set(value) {
        this.$emit('update:showDialog', value);
      },
    },
  },
  methods: {
    ...mapMutations(['updateError']),
    async addPayment(data) {
      if (!zeroDecimalCurrencies.includes(data.currency)) {
        data.amount *= 100;
      }

      try {
        const response = await this.$axios.post(`/payments`, data, {
          headers: {
            Authorization: `Bearer ${this.$store.state.auth.token}`,
          },
        });

        if (response.status === 201) {
          notifySuccess('Created new payment.');

          this.toggleDialog = false;
        }
      } catch (error) {
        this.message = axiosError(error);
      } finally {
        this.$q.loading.hide();
      }
    },
    async charge() {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        this.message = 'Please check the errors below.';
        return;
      }

      this.$q.loading.show({
        message: 'Adding payment...',
        spinner: QSpinner,
        sanitize: true,
      });

      if (this.sourceData.length > 0) {
        const data = { ...this.form };
        data.customer = this.$route.params.id;
        this.addPayment(data);
      } else {
        this.createToken();
      }
    },
    async createToken() {
      const { error, token } = await this.$stripe.createToken(this.getElement);

      if (error) {
        this.message = 'Please check the errors below.';
        this.updateError(error.message);
        this.$q.loading.hide();
      } else {
        this.stripeTokenHandler(token);
      }
    },
    parseSourceData() {
      for (let i = 0; i < this.sourceData.length; i += 1) {
        let card = '';
        let label = '';
        let icon = '';
        let value = '';

        if (this.sourceData[i].object === 'card') {
          card = `•••• ${this.sourceData[i].last4} ${this.sourceData[
            i
          ].exp_month
            .toString()
            .padStart(2, '0')} / ${this.sourceData[i].exp_year}`;
        }

        switch (this.sourceData[i].brand) {
          case 'American Express':
            label = card;
            icon = 'fab fa-cc-amex';
            value = this.sourceData[i].id;
            break;
          case 'Diners Club':
            label = card;
            icon = 'fab fa-cc-diners-club';
            value = this.sourceData[i].id;
            break;
          case 'Discover':
            label = card;
            icon = 'fab fa-cc-discover';
            value = this.sourceData[i].id;
            break;
          case 'JCB':
            label = card;
            icon = 'fab fa-cc-jcb';
            value = this.sourceData[i].id;
            break;
          case 'MasterCard':
            label = card;
            icon = 'fab fa-cc-mastercard';
            value = this.sourceData[i].id;
            break;
          case 'Visa':
            label = card;
            icon = 'fab fa-cc-visa';
            value = this.sourceData[i].id;
            break;
          default:
            label = card;
            icon = 'fas fa-credit-card';
            value = this.sourceData[i].id;
        }

        if (this.sourceData[i].object === 'bank_account') {
          label = `${this.sourceData[i].bank_name} ••••${this.sourceData[i].last4}`;
          icon = 'fas fa-university';
          value = this.sourceData[i].id;
        }
        this.options.push({ label, icon, value });
      }
    },
    reset() {
      this.$v.form.$reset();
      this.alert = false;
    },
    async stripeTokenHandler(token) {
      this.form.source = token.id;
      const data = { ...this.form };

      this.addPayment(data);
    },
  },
  watch: {
    source() {
      if (this.source) {
        this.form.source = this.source.value;
      }
    },
  },
  created() {
    this.parseSourceData();
    const [source] = this.options.filter(
      option => option.value === this.defaultSource
    );
    this.source = source;
  },
};
</script>
