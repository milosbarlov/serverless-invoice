<template>
  <q-page
    :class="{
      'bread-crumb-padding': $q.screen.gt.sm,
      flex: true,
      'flex-center': true,
    }"
    :padding="!$q.platform.is.mobile"
  >
    <q-card
      :class="{
        'text-2b': true,
        'full-width': $q.platform.is.mobile || $q.screen.lt.sm,
        'window-height': $q.platform.is.mobile || $q.screen.lt.sm,
        'w-500px': !$q.platform.is.mobile,
      }"
      :flat="$q.platform.is.mobile"
    >
      <q-card-section class="gt-sm">
        <div class="text-h6">New bank account</div>
      </q-card-section>
      <q-separator class="gt-sm" />
      <alert :alert="$v.form.$error" :message="message" />
      <q-card-section>
        <div class="q-gutter-md">
          <q-banner class="text-light-blue-8 bg-light-blue-1">
            <div class="text-subtitle1">Testing ACH</div>
            You can mimic successful and failed ACH charges using the following
            bank routing and account numbers:
            <ul>
              <li>Routing number: 110000000</li>
              <li>Account number:</li>
              <ul>
                <li>000123456789 (success)</li>
                <li>000111111116 (failure upon use)</li>
                <li>000111111113 (account closed)</li>
                <li>000222222227 (NSF/insufficient funds)</li>
                <li>000333333335 (debit not authorized)</li>
                <li>000444444440 (invalid currency)</li>
              </ul>
            </ul>
          </q-banner>
          <!-- Account holder name -->
          <q-input
            bottom-slots
            @change="$v.form.bank_account.account_holder_name.$touch"
            color="cyan"
            dense
            :error="$v.form.bank_account.account_holder_name.$error"
            error-message="Cannot be blank"
            outlined
            label="Account holder name"
            v-model="form.bank_account.account_holder_name"
          />
          <!-- Account holder type -->
          <q-select
            bottom-slots
            color="cyan"
            dense
            emit-value
            label="Account holder type"
            map-options
            :options="accountHolderTypeOptions"
            outlined
            v-model="form.bank_account.account_holder_type"
          />
          <!-- Routing number -->
          <q-input
            bottom-slots
            @change="$v.form.bank_account.routing_number.$touch"
            color="cyan"
            dense
            :error="$v.form.bank_account.routing_number.$error"
            error-message="Routing number must have 9 digits."
            label="Routing number"
            mask="#########"
            outlined
            v-model="form.bank_account.routing_number"
          />
          <!-- Account number -->
          <q-input
            bottom-slots
            @change="$v.form.bank_account.account_number.$touch"
            color="cyan"
            dense
            :error="$v.form.bank_account.account_number.$error"
            error-message="Cannot be blank"
            label="Account number"
            mask="#################"
            outlined
            v-model="form.bank_account.account_number"
          />
          <!-- Confirm number -->
          <q-input
            bottom-slots
            @change="$v.form.confirm_account_number.$touch"
            color="cyan"
            dense
            :error="$v.form.confirm_account_number.$error"
            error-message="Account numbers do not match."
            label="Confirm account number"
            mask="#################"
            outlined
            v-model="form.confirm_account_number"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="gt-sm q-pa-md">
        <q-btn outline label="cancel" color="cyan" @click="$router.back()" />
        <q-btn label="add bank account" color="cyan" @click="addBankAccount" />
      </q-card-actions>
    </q-card>

    <!-- Breadcrumbs -->
    <bread-crumbs :breadcrumbs="breadcrumbs" />
  </q-page>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';
import { QSpinner } from 'quasar';
import { mapActions } from 'vuex';
import { axiosError } from 'utils/error-handler';
import { notifySuccess } from 'utils/success-handler';
import Alert from 'components/Alert.vue';
import BreadCrumbs from 'components/BreadCrumbs.vue';

export default {
  name: 'CustomerAddBankAccount',
  data() {
    return {
      breadcrumbs: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Customers',
          link: '/customers',
        },
        {
          label: 'New bank account',
          link: '',
        },
      ],
      accountHolderTypeOptions: [
        { label: 'Individual', value: 'individual' },
        { label: 'Company', value: 'company' },
      ],
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
      },
      message: '',
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
        isConfirmed(value) {
          return value === this.form.bank_account.account_number;
        },
      },
    },
  },
  components: {
    alert: Alert,
    breadCrumbs: BreadCrumbs,
  },
  methods: {
    ...mapActions('customers', ['asyncUpdateCustomer']),
    async addBankAccount() {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        this.message = 'Please check the errors below.';
        return;
      }

      this.$q.loading.show({
        message: 'Adding bank account...',
        spinner: QSpinner,
        sanitize: true,
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
        this.message = error;
        this.$q.loading.hide();
      } else {
        this.stripeTokenHandler(token);
      }
    },
    async stripeTokenHandler(token) {
      try {
        const response = await this.$axios.post(
          `/customers/${this.$route.params.id}/source`,
          { token: token.id },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.auth.token}`,
            },
          }
        );

        if (response.status === 201) {
          notifySuccess('Added new bank account.');
          this.$router.push(`/customers/${this.$route.params.id}`, () => {
            this.asyncUpdateCustomer({
              id: this.$route.params.id,
            });
          });
        }
      } catch (error) {
        console.error(error);
        this.message = axiosError(error);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
  created() {
    this.$root.$on('submit', this.addBankAccount);
  },
  beforeDestroy() {
    this.$root.$off('submit', this.addBankAccount);
  },
};
</script>

<style lang="stylus" scoped>
.w-500px
  width 500px
</style>
