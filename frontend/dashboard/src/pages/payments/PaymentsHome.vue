<template>
  <q-page
    :class="[{ 'bread-crumb-padding': $q.screen.gt.sm }, 'container']"
    :padding="!$q.platform.is.mobile"
  >
    <payments-table
      :data="$store.state.payments.paymentsData"
      :filter.sync="filter"
      :loading="$store.state.payments.loading"
      :pagination.sync="pagination"
    />

    <!-- Breadcrumbs -->
    <bread-crumbs
      :breadcrumbs="breadcrumbs"
      v-if="!$store.state.layout.fullscreen"
    />
  </q-page>
</template>

<script>
import PaymentsTable from 'components/payments/PaymentsTable.vue';
import BreadCrumbs from 'components/BreadCrumbs.vue';
import { mapActions } from 'vuex';

export default {
  name: 'PaymentsHome',
  data() {
    return {
      breadcrumbs: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Payments',
          link: '',
        },
      ],
    };
  },
  components: {
    paymentsTable: PaymentsTable,
    breadCrumbs: BreadCrumbs,
  },
  computed: {
    filter: {
      get() {
        return this.$store.state.payments.filter;
      },
      set(value) {
        this.$store.commit('payments/setFilter', value);
      },
    },
    pagination: {
      get() {
        return this.$store.state.payments.pagination;
      },
      set(value) {
        this.$store.commit('payments/setPagination', value);
      },
    },
  },
  methods: {
    ...mapActions('payments', ['asyncUpdatePayments']),
  },
  created() {
    this.asyncUpdatePayments({
      pagination: this.$store.state.payments.pagination,
      filter: this.$store.state.payments.filter,
    });
  },
};
</script>

<style lang="stylus" scoped>
.container
  max-width 1600px
  margin-left auto
  margin-right auto
</style>
