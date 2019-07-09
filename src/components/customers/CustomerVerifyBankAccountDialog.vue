<template>
  <q-dialog v-model="toggleDialog" @hide="reset">
    <q-card style="width: 500px">
      <q-card-section class="row items-center">
        <div class="text-h6">
          Microdeposit amounts in cents
        </div>
        <q-space />
        <q-btn flat round dense icon="close" @click="toggleDialog = false" />
      </q-card-section>
      <q-separator />
      <alert :alert="alert" :message="alertMsg" />
      <q-card-section class="q-gutter-md">
        <q-input
          filled
          v-model="form.deposits.first"
          @blur="$v.form.deposits.first.$touch"
          label="First deposit"
          prefix="$0."
          mask="##"
          :error="$v.form.deposits.first.$error"
          error-message="Requires 2 digits"
          autofocus
        />
        <q-input
          filled
          v-model="form.deposits.second"
          @blur="$v.form.deposits.second.$touch"
          label="Second deposit"
          prefix="$0."
          mask="##"
          :error="$v.form.deposits.second.$error"
          error-message="Requires 2 digits"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          outline
          label="Cancel"
          color="blue-grey"
          @click="toggleDialog = false"
        />
        <q-btn label="Verify" color="primary" @click="verify" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';
import { QSpinner } from 'quasar';
import { formErrorHandler } from 'mixins/form-error-handler';
import Alert from 'components/Alert.vue';
import { mapActions } from 'vuex';

export default {
  name: 'CustomerVerifyBankAccountDialog',
  mixins: [formErrorHandler],
  props: {
    showDialog: { type: Boolean, required: true },
    bankId: { type: String, required: true },
  },
  data() {
    return {
      alert: false,
      alertMsg: '',
      form: {
        deposits: {
          first: '',
          second: '',
        },
      },
    };
  },
  validations: {
    form: {
      deposits: {
        first: {
          required,
          minLength: minLength(2),
        },
        second: {
          required,
          minLength: minLength(2),
        },
      },
    },
  },
  components: {
    alert: Alert,
  },
  computed: {
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
    ...mapActions('customers', ['asyncUpdateCustomer']),
    reset() {
      this.$v.form.deposits.$reset();
      this.alert = false;
    },
    async verify() {
      this.$v.form.deposits.$touch();

      if (this.$v.form.deposits.$error) {
        this.formError('Please correct the errors below.');
        return;
      }

      this.$q.loading.show({
        message: 'Verifying bank account...',
        spinner: QSpinner,
      });

      try {
        const response = await this.$axios.post(
          `/customers/${this.$route.params.id}/bankaccount/${this.bankId}/verify`,
          this.form
        );

        if (response.data.status === 'verified') {
          this.$notifySuccess('Verified bank account.');
          this.asyncUpdateCustomer({
            id: this.$route.params.id,
          });
          this.toggleDialog = false;
        }
      } catch (error) {
        console.error(error);
        this.$errorHandler(error);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
};
</script>
