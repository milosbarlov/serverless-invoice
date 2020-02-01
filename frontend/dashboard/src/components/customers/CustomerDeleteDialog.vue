<template>
  <q-dialog v-model="toggleDialog">
    <q-card>
      <q-card-section>
        <div class="row items-center">
          <q-icon left name="warning" color="negative" size="2em" />
          <div class="text-h6 text-negative">Delete this customer?</div>
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
          Permanently delete this customer. It cannot be undone. Also
          immediately cancels any active subscriptions on the customer.
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          outline
          label="cancel"
          color="negative"
          @click="toggleDialog = false"
        />
        <q-btn label="delete" color="negative" @click="deleteCustomer" />
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
  name: 'CustomerDeleteDialog',
  props: { showDialog: { type: Boolean, required: true } },
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
    ...mapActions('customers', ['asyncUpdateCustomers']),
    async deleteCustomer() {
      this.$q.loading.show({
        message: 'Deleting customer...',
        spinner: QSpinner,
        sanitize: true,
      });

      try {
        const response = await this.$axios.delete(
          `/customers/${this.$route.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.auth.token}`,
            },
          }
        );

        if (response.status === 200) {
          notifySuccess('Deleted customer.');
          this.$router.push('/customers', () => {
            this.asyncUpdateCustomers({
              pagination: this.$store.state.customers.pagination,
              filter: this.$store.state.customers.filter,
            });
          });
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
