<template>
  <q-dialog v-model="toggleDialog" @hide="reset">
    <q-card class="text-2b" style="width: 500px">
      <q-card-section class="row items-center">
        <div class="text-h6">
          Microdeposit amounts in cents
        </div>
        <q-space />
        <q-btn flat round dense icon="close" @click="toggleDialog = false" />
      </q-card-section>
      <q-separator />
      <alert :alert="message ? true : false" :message="message" />
      <q-card-section>
        <div class="q-gutter-md">
          <q-banner class="text-light-blue-8 bg-light-blue-1">
            To mimic successful and failed bank account verifications, use these
            meaningful amounts:
            <ul>
              <li>[32, 45] (success)</li>
              <li>[any other number combinations] (failure)</li>
            </ul>
          </q-banner>
          <q-input
            dense
            outlined
            v-model="form.deposits.first"
            @change="$v.form.deposits.first.$touch"
            label="First deposit"
            prefix="$0."
            mask="##"
            :error="$v.form.deposits.first.$error"
            error-message="Requires 2 digits"
            autofocus
          />
          <q-input
            dense
            outlined
            v-model="form.deposits.second"
            @change="$v.form.deposits.second.$touch"
            label="Second deposit"
            prefix="$0."
            mask="##"
            :error="$v.form.deposits.second.$error"
            error-message="Requires 2 digits"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          @click="toggleDialog = false"
          color="positive"
          icon="close"
          label="Cancel"
          outline
        />
        <q-btn @click="verify" color="positive" icon="check" label="Verify" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';
import { QSpinner } from 'quasar';
import { axiosError } from 'utils/error-handler';
import { notifySuccess } from 'utils/success-handler';
import Alert from 'components/Alert.vue';
import { mapActions } from 'vuex';
import _ from 'lodash';

export default {
  name: 'CustomerVerifyBankAccountDialog',
  props: {
    showDialog: { type: Boolean, required: true },
    bankId: { type: String, required: true },
  },
  data() {
    return {
      form: {
        deposits: {
          first: '',
          second: '',
        },
      },
      message: '',
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
      this.message = '';
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
        sanitize: true,
      });

      const data = _.cloneDeep(this.form);

      data.deposits.first = parseInt(this.form.deposits.first, 10);
      data.deposits.second = parseInt(this.form.deposits.second, 10);

      try {
        const response = await this.$axios.post(
          `/customers/${this.$route.params.id}/bankaccount/${this.bankId}/verify`,
          data,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.auth.token}`,
            },
          }
        );

        if (response.data.status === 'verified') {
          notifySuccess('Verified bank account.');
          this.asyncUpdateCustomer({
            id: this.$route.params.id,
          });
          this.toggleDialog = false;
        }
      } catch (error) {
        console.error(error);
        this.message = axiosError(error);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
};
</script>
