<template>
  <q-page
    :class="[{ 'bread-crumb-padding': $q.screen.gt.sm }, 'container']"
    :padding="!$q.platform.is.mobile"
  >
    <div class="q-gutter-y-md">
      <q-card class="text-2b">
        <q-card-section>
          <div class="row items-center">
            <div class="text-h6">
              {{ $store.state.customers.customerData.info.name }}
              <span class="text-subtitle1">
                &lt;{{ $store.state.customers.customerData.info.email }}&gt;
              </span>
            </div>
            <q-space></q-space>
            <q-btn
              :flat="$q.screen.lt.md"
              :round="$q.screen.lt.md"
              color="negative"
              @click="showDeleteDialog = true"
              size="sm"
            >
              <q-icon :left="$q.screen.gt.sm" name="delete" />
              <div class="gt-sm">delete</div>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>

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
        :filter.sync="filter"
        :loading="$store.state.customers.loading"
        :pagination.sync="pagination"
      />
    </div>

    <!-- Breadcrumbs -->
    <bread-crumbs
      :breadcrumbs="breadcrumbs"
      v-if="!$store.state.layout.fullscreen"
    />
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
          label: 'Home',
          link: '/',
        },
        {
          label: 'Customers',
          link: '/customers',
        },
        {
          label: this.$route.params.id,
          link: '',
        },
      ],
      filter: {
        startDate: '',
        endDate: '',
        search: '',
        status: [],
      },
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: 'created',
      },
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
  created() {
    this.pagination.rowsNumber = this.$store.state.customers.customerData.charges.data.length;
  },
};
</script>

<style lang="stylus" scoped>
.container
  max-width 1200px
  margin-left auto
  margin-right auto
</style>
