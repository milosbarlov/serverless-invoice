<template>
  <q-dialog v-model="toggleDialog" @hide="message = ''">
    <q-card>
      <q-card-section>
        <div class="row items-center">
          <q-icon left name="warning" color="negative" size="2em" />
          <div class="text-h6 text-negative">Delete this bank account?</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="toggleDialog = false">
            <q-tooltip :content-style="{ 'font-size': '14px' }">
              close
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
      <alert :alert="message ? true : false" :message="message" />
      <q-card-section>
        <div>
          Permanently delete this bank account. It cannot be undone.
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          outline
          label="cancel"
          color="blue-grey"
          @click="toggleDialog = false"
        />
        <q-btn
          label="delete"
          color="negative"
          @click="deleteBankAccount(bankId)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { QSpinner } from 'quasar';
import { mapActions } from 'vuex';
import Alert from 'components/Alert.vue';
import { axiosError } from 'utils/error-handler';
import { notifySuccess } from 'utils/success-handler';

export default {
  name: 'CustomerDeleteBankAccountDialog',
  props: {
    bankId: {
      type: String,
      required: true,
    },
    showDialog: { type: Boolean, required: true },
  },
  data() {
    return {
      message: '',
    };
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
    async deleteBankAccount(bankId) {
      this.$q.loading.show({
        message: 'Deleting bank account...',
        spinner: QSpinner,
        sanitize: true,
      });

      try {
        const response = await this.$axios.delete(
          `/customers/${this.$route.params.id}/bankaccount/${bankId}`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.auth.token}`,
            },
          }
        );

        if (response.status === 200) {
          notifySuccess('Customer deleted.');
          this.asyncUpdateCustomer({
            id: this.$route.params.id,
          });
          this.toggleDialog = false;
        }
      } catch (error) {
        this.message = axiosError(error);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
};
</script>
