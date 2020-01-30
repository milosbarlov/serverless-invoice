<template>
  <q-page
    :class="[{ 'bread-crumb-padding': $q.screen.gt.sm }, 'container']"
    :padding="!$q.platform.is.mobile"
  >
    <q-tabs
      class="bg-white q-mb-md rounded-borders shadow-2 text-grey"
      active-color="cyan"
      indicator-color="cyan"
      v-model="tab"
      inline-label
      no-caps
      rounded
    >
      <q-tab name="all" label="All Invoices" />
      <q-tab name="draft" label="Draft" />
      <q-tab name="open" label="Outstanding" />
      <q-tab name="past due" label="Past Due" />
      <q-tab name="paid" label="Paid" />
      <q-tab name="uncollectible" label="Uncollectible" />
      <q-tab name="void" label="Void" />
    </q-tabs>
    <invoices-table
      :filter.sync="filter"
      :past-due="tab === 'past due'"
      :loading="loading"
      :pagination.sync="pagination"
      :tab.sync="tab"
      @requestInvoices="fetchInvoices"
    />

    <!-- Breadcrumbs -->
    <bread-crumbs
      :breadcrumbs="breadcrumbs"
      v-if="!$store.state.layout.fullscreen"
    />
  </q-page>
</template>

<script>
import BreadCrumbs from 'components/BreadCrumbs.vue';
import InvoicesTable from 'components/invoices/InvoicesTable.vue';
import qs from 'qs';
import { axiosError, notifyError } from 'utils/error-handler';

export default {
  name: 'InvoicesHome',
  data() {
    return {
      breadcrumbs: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Invoices',
          link: '',
        },
      ],
      filter: {
        startDate: '',
        endDate: '',
        search: '',
        status: 'all',
      },
      invoices: [],
      loading: false,
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: 'createdAt',
      },
      tab: 'all',
    };
  },
  components: {
    breadCrumbs: BreadCrumbs,
    invoicesTable: InvoicesTable,
  },
  methods: {
    async fetchInvoices() {
      const obj = {};
      try {
        this.loading = true;

        const response = await this.$axios.get('/invoices', {
          headers: {
            Authorization: `Bearer ${this.$store.state.auth.token}`,
          },
          params: Object.assign(obj, this.filter, this.pagination, {
            pastDue: this.tab === 'past due',
          }),
          paramsSerializer: query =>
            qs.stringify(query, { skipNulls: true, arrayFormat: 'repeat' }),
        });

        if (response.status === 200) {
          // this.invoices = response.data.invoices;
          this.$store.commit('invoices/setInvoices', response.data.invoices);
          this.pagination.rowsNumber = response.data.rowsNumber;
        }
      } catch (error) {
        console.error(error);
        notifyError(axiosError(error));
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    tab(value) {
      const status = ['all', 'draft', 'open', 'paid', 'uncollectible', 'void'];

      if (status.includes(value)) {
        this.filter.status = value;
      } else {
        this.filter.status = 'open';
      }

      this.fetchInvoices();
    },
  },
  created() {
    this.fetchInvoices();
  },
};
</script>

<style lang="stylus" scoped>
.container
  max-width 1600px
  margin-left auto
  margin-right auto
</style>
