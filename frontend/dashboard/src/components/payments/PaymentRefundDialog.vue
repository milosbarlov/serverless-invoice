<template>
  <q-dialog v-model="toggleDialog" @hide="reset" @before-show="show">
    <q-card style="width: 500px">
      <q-card-section>
        <div class="row items-center">
          <div class="text-h6 text-2b">Refund payment</div>
          <q-space />
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="toggleDialog = false"
            text-color="69"
          >
            <q-tooltip :content-style="{ 'font-size': '14px' }">
              close
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <alert :alert="$v.form.$error" :message="message" />
      <q-card-section>
        <div class="q-col-gutter-md">
          <!-- Amount -->
          <q-input
            @change="$v.form.amount.$touch"
            color="cyan"
            bottom-slots
            :error="$v.form.amount.$error"
            :error-message="error"
            label="Amount"
            mask="#.##"
            outlined
            prefix="$"
            reverse-fill-mask
            unmasked-value
            v-model="form.amount"
          />
          <!-- Reason -->
          <q-select
            bottom-slots
            color="cyan"
            emit-value
            :error="$v.form.reason.$error"
            :error-message="'Please select a reason.'"
            filled
            label="Reason"
            map-options
            :options="options"
            v-model="form.reason"
          >
            <template #append>
              <q-icon
                v-if="form.reason"
                name="close"
                @click.stop="form.reason = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
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
        <q-btn @click="refund" color="cyan" label="Refund" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { formatCurrency, zeroDecimalCurrencies } from 'utils/currency';
import { axiosError } from 'utils/error-handler';
import { notifySuccess } from 'utils/success-handler';
import { required } from 'vuelidate/lib/validators';
import { QSpinner } from 'quasar';
import Alert from 'components/Alert.vue';

export default {
  name: 'PaymentRefundDialog',
  props: {
    amount: { type: [Number, String], required: true },
    amountRefunded: { type: [Number, String], required: true },
    currency: { type: String, required: true },
    id: { type: String, required: true },
    showDialog: { type: Boolean, required: true },
  },
  data() {
    return {
      form: {
        amount: '',
        reason: '',
      },
      message: '',
      options: [
        { label: 'Duplicate', value: 'duplicate' },
        { label: 'Fraudulent', value: 'fraudulent' },
        { label: 'Requested by customer', value: 'requested_by_customer' },
      ],
    };
  },
  validations: {
    form: {
      amount: {
        required,
        isGreaterThanZero(value) {
          return value > 0;
        },
        isLessThanMaxValue(value) {
          return value <= this.amount - this.amountRefunded;
        },
      },
      reason: {
        required,
      },
    },
  },
  components: {
    alert: Alert,
  },
  computed: {
    error() {
      if (!this.$v.form.amount.isGreaterThanZero) {
        return 'Refund cannot be zero.';
      }
      if (!this.$v.form.amount.isLessThanMaxValue) {
        return `Refund cannot be more than ${formatCurrency(
          this.maxValue(),
          this.currency
        )}`;
      }
      return 'Error';
    },
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
    maxValue() {
      if (zeroDecimalCurrencies.includes(this.currency)) {
        return this.amount - this.amountRefunded;
      }
      return (this.amount - this.amountRefunded) / 100;
    },
    isZeroDecimalCurrency(value) {
      if (zeroDecimalCurrencies.includes(this.currency)) {
        return value <= this.amount - this.amountRefunded;
      }
      return value * 100 <= this.amount - this.amountRefunded;
    },
    async refund() {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        this.message = 'Please check the errors below.';
        return;
      }

      this.$q.loading.show({
        message: 'Refunding payment...',
        spinner: QSpinner,
        sanitize: true,
      });

      try {
        const response = await this.$axios.post(
          `/payments/${this.id}/refund`,
          this.form,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.auth.token}`,
            },
          }
        );

        if (response.status === 201) {
          notifySuccess('Refunded payment.');

          this.toggleDialog = false;
        }
      } catch (error) {
        console.error(error);
        this.message = axiosError(error);
      } finally {
        this.$q.loading.hide();
      }
    },
    reset() {
      this.$v.form.$reset();
      this.form.amount = '';
    },
    show() {
      this.form.amount = this.amount.toString();
    },
  },
};
</script>
