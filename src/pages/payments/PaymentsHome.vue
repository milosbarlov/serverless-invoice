<template>
  <q-page padding>
    <bread-crumbs
      :breadcrumbs="breadcrumbs"
      v-if="!fullscreen"
      class="q-mb-md"
    />
    <payments-table
      :data="$store.state.payments.paymentsData"
      :loading="$store.state.payments.loading"
      :pagination.sync="getServerPagination"
    />
  </q-page>
</template>

<script>
import PaymentsTable from 'components/payments/PaymentsTable.vue';
import BreadCrumbs from 'components/BreadCrumbs.vue';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'PaymentsHome',
  data() {
    return {
      breadcrumbs: [
        {
          icon: 'fas fa-home fa-fw',
          label: 'Home',
          link: '/',
        },
        {
          icon: 'fas fa-credit-card fa-fw',
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
    ...mapState('layout', ['fullscreen']),
    ...mapGetters('payments', ['getServerPagination', 'getFilter']),
  },
  methods: {
    ...mapActions('payments', ['asyncUpdatePayments']),
  },
  created() {
    this.asyncUpdatePayments({
      pagination: this.getServerPagination,
      filter: this.getFilter,
    });
  },
};
</script>
