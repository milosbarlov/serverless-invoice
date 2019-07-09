<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card style="width: 800px; max-width: 100vw; min-width: 300px">
        <q-card-section>
          <div class="text-h6">Add bank account</div>
        </q-card-section>
        <q-separator />
        <alert :alert.sync="alert" :message="alertMsg" />
        <q-card-section>
          <div class="q-gutter-md">
            <!-- Account holder name -->
            <q-input
              outlined
              v-model="form.bank_account.account_holder_name"
              label="Account holder name"
              @blur="$v.form.bank_account.account_holder_name.$touch"
              :error="$v.form.bank_account.account_holder_name.$error"
              error-message="Cannot be blank"
              bottom-slots
            />
            <!-- Account holder type -->
            <q-select
              filled
              label="Account holder type"
              :options="form.accountHolderTypeOptions"
              v-model="form.bank_account.account_holder_type"
              bottom-slots
            />
            <!-- Routing number -->
            <q-input
              outlined
              v-model="form.bank_account.routing_number"
              label="Routing number"
              mask="#########"
              @blur="$v.form.bank_account.routing_number.$touch"
              :error="$v.form.bank_account.routing_number.$error"
              error-message="Routing number must have 9 digits."
              bottom-slots
            />
            <!-- Account number -->
            <q-input
              outlined
              v-model="form.bank_account.account_number"
              label="Account number"
              mask="#################"
              @blur="$v.form.bank_account.account_number.$touch"
              :error="$v.form.bank_account.account_number.$error"
              error-message="Cannot be blank"
              bottom-slots
            />
            <!-- Confirm number -->
            <q-input
              outlined
              v-model="form.confirm_account_number"
              label="Confirm account number"
              mask="#################"
              @blur="$v.form.confirm_account_number.$touch"
              :error="$v.form.confirm_account_number.$error"
              error-message="Account numbers do not match."
              bottom-slots
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            outline
            label="cancel"
            color="primary"
            @click="$router.back()"
          />
          <q-btn
            label="add bank account"
            color="primary"
            @click="addBankAccount"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';
import { QSpinner } from 'quasar';
import { mapActions } from 'vuex';
import { formErrorHandler } from 'mixins/form-error-handler';
import Alert from 'components/Alert.vue';

export default {
  name: 'CustomerAddBankAccount',
  mixins: [formErrorHandler],
  data() {
    return {
      alert: false,
      alertMsg: '',
      form: {
        deposits: {
          first: '',
          second: '',
        },
        bank_account: {
          country: 'US',
          currency: 'usd',
          routing_number: '',
          account_number: '',
          account_holder_name: '',
          account_holder_type: 'individual',
        },
        confirm_account_number: '',
        accountHolderTypeOptions: [
          { label: 'Individual', value: 'individual' },
          { label: 'Company', value: 'company' },
        ],
      },
    };
  },
  validations: {
    form: {
      bank_account: {
        routing_number: {
          required,
          minLength: minLength(9),
        },
        account_number: {
          required,
          minLength: minLength(1),
        },
        account_holder_name: {
          required,
          minLength: minLength(1),
        },
      },
      confirm_account_number: {
        required,
        isConfirmed: (value, vm) => value === vm.bank_account.account_number,
      },
    },
  },
  components: {
    alert: Alert,
  },
  methods: {
    ...mapActions('customers', ['asyncUpdateCustomer']),
    async addBankAccount() {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        this.formError('Please correct the errors below.');
        return;
      }

      this.$q.loading.show({
        message: 'Adding bank account...',
        spinner: QSpinner,
      });

      this.createToken();
    },
    async createToken() {
      const { error, token } = await this.$stripe.createToken(
        'bank_account',
        this.form.bank_account
      );

      if (error) {
        console.error(error);
        this.$errorHandler(error);
        this.$q.loading.hide();
      } else {
        this.stripeTokenHandler(token);
      }
    },
    async stripeTokenHandler(token) {
      try {
        const response = await this.$axios.post(
          `/customers/${this.$route.params.id}/source`,
          { token: token.id }
        );

        if (response.status === 201) {
          this.$notifySuccess('Added new bank account.');
          this.$router.push(`/customers/${this.$route.params.id}`, () => {
            this.asyncUpdateCustomer({
              id: this.$route.params.id,
            });
          });
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
