<template>
  <q-page padding>
    <div>
      <bread-crumbs
        :breadcrumbs="breadcrumbs"
        v-if="!$store.state.layout.fullscreen"
        class="q-mb-md"
      />
      <div
        class="row justify-between items-center q-mb-md"
        v-if="!$store.state.layout.fullscreen"
      >
        <div class="text-h5 text-grey-14">
          {{ $store.state.customers.customerData.info.email }}
        </div>
        <q-btn class="gt-sm" color="negative" @click="showDeleteDialog = true">
          <q-icon left name="fas fa-trash" size="1rem" />
          <div>delete</div>
        </q-btn>
        <q-btn
          round
          class="lt-md"
          color="negative"
          @click="showDeleteDialog = true"
        >
          <q-icon name="fas fa-trash" size="1rem" />
          <q-tooltip anchor="bottom middle" self="top middle">
            Delete
          </q-tooltip>
        </q-btn>
      </div>
      <!-- Customer delete dialog -->
      <customer-delete-dialog :show-dialog.sync="showDeleteDialog" />

      <!-- Details -->
      <customer-details :customer-data="$store.state.customers.customerData" />

      <!-- Bank accounts -->
      <customer-bank-accounts :bank-data="getCustomerBankData" />

      <!-- Cards -->
      <customer-cards :card-data="getCustomerCardData" />

      <!-- Payments -->
      <payments-table
        :data="$store.state.customers.customerData.charges.data"
        :loading="$store.state.customers.loading"
      />
    </div>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import CustomerDeleteDialog from 'components/customers/CustomerDeleteDialog.vue';
import CustomerDetails from 'components/customers/CustomerDetails.vue';
import CustomerBankAccounts from 'components/customers/CustomerBankAccounts.vue';
import CustomerCards from 'components/customers/CustomerCards.vue';
import BreadCrumbs from 'components/BreadCrumbs.vue';
import PaymentsTable from 'components/payments/PaymentsTable.vue';

const { mapGetters, mapActions } = createNamespacedHelpers('customers');

export default {
  name: 'CustomerProfile',
  data() {
    return {
      breadcrumbs: [
        {
          icon: 'fas fa-home fa-fw',
          label: 'Home',
          link: '/',
        },
        {
          icon: 'fas fa-users fa-fw',
          label: 'Customers',
          link: '/customers',
        },
        {
          icon: 'fas fa-user fa-fw',
          label: this.$route.params.id,
          link: '',
        },
      ],
      showDeleteDialog: false,
    };
  },
  components: {
    breadCrumbs: BreadCrumbs,
    paymentsTable: PaymentsTable,
    customerDeleteDialog: CustomerDeleteDialog,
    customerDetails: CustomerDetails,
    customerBankAccounts: CustomerBankAccounts,
    customerCards: CustomerCards,
  },
  computed: {
    ...mapGetters(['getCustomerBankData', 'getCustomerCardData']),
  },
  methods: {
    ...mapActions(['asyncUpdateCustomer', 'asyncUpdateCustomers']),
  },
};
</script>
