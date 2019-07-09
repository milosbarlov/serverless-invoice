<template>
  <q-dialog v-model="toggleDialog">
    <q-card>
      <q-card-section>
        <div class="row items-center">
          <q-icon left name="warning" color="negative" size="2em" />
          <div class="text-h6 text-negative">Delete this customer?</div>
        </div>
      </q-card-section>
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
          color="blue-grey"
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

export default {
  name: 'CustomerDeleteDialog',
  props: { showDialog: { type: Boolean, required: true } },
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
      });

      try {
        const response = await this.$axios.delete(
          `/customers/${this.$route.params.id}`
        );

        if (response.status === 200) {
          this.$notifySuccess('Deleted customer.');
          this.$router.push('/customers', () => {
            this.asyncUpdateCustomers({
              pagination: this.$store.state.customers.serverPagination,
              filter: this.$store.state.customers.filter,
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
