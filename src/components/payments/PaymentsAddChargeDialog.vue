<template>
  <q-dialog v-model="toggleDialog" @hide="reset">
    <q-card style="width: 500px">
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
      <alert :alert.sync="alert" :message="alertMsg" />
      <q-card-section>
        <div class="q-col-gutter-md">
          <!-- Amount -->
          <q-input
            outlined
            v-model.lazy="form.amount"
            label="Amount"
            prefix="$"
            v-money="money"
            @blur="$v.form.amount.$touch"
            :error="$v.form.amount.$error"
            error-message="Minimum charge amount is $0.50"
            bottom-slots
          />
          <!-- Payment method -->
          <q-select
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
          color="blue-grey"
        />
        <q-btn @click="charge" color="primary" label="Charge customer" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { QSpinner } from 'quasar';
import { VMoney } from 'v-money';
import CardElement from 'components/stripe/CardElement.vue';
import { createNamespacedHelpers } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import Alert from 'components/Alert.vue';
import { formErrorHandler } from 'mixins/form-error-handler';

const { mapGetters, mapMutations } = createNamespacedHelpers('stripe');

export default {
  name: 'PaymentsAddChargeDialog',
  mixins: [formErrorHandler],
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
      alert: false,
      alertMsg: '',
      form: {
        amount: 0,
        capture: true,
        currency: 'usd',
        description: '',
        source: '',
      },
      money: {
        precision: 2,
        masked: false,
      },
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
    ...mapGetters([
      'getElement',
      'getError',
      'getValue',
      'getZeroDecimalCurrencies',
    ]),
    toggleDialog: {
      get() {
        return this.showDialog;
      },
      set(value) {
        this.$emit('update:showDialog', value);
      },
    },
  },
  directives: {
    money: VMoney,
  },
  methods: {
    ...mapMutations(['updateError']),
    async addPayment(data) {
      if (!this.getZeroDecimalCurrencies.includes(data.currency)) {
        data.amount *= 100;
      }

      try {
        const response = await this.$axios.post(`/payments`, data);

        if (response.status === 201) {
          this.$notifySuccess('Created new payment.');

          this.toggleDialog = false;
        }
      } catch (error) {
        console.error(error);
        this.$errorHandler(error);
      } finally {
        this.$q.loading.hide();
      }
    },
    async charge() {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        this.formError('Please correct the errors below.');
        return;
      }

      this.$q.loading.show({
        message: 'Adding payment...',
        spinner: QSpinner,
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
        console.error(error);
        this.formError('Please correct the errors below.');
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
