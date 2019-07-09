<template>
  <q-dialog v-model="toggleDialog">
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

export default {
  name: 'CustomerDeleteBankAccountDialog',
  props: {
    bankId: {
      type: String,
      required: true,
    },
    showDialog: { type: Boolean, required: true },
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
      });

      try {
        const response = await this.$axios.delete(
          `/customers/${this.$route.params.id}/bankaccount/${bankId}`
        );

        if (response.status === 200) {
          this.$notifySuccess('Customer deleted.');
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
