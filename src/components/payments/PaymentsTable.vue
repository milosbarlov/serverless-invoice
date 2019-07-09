<template>
  <div>
    <q-table
      title="Payments"
      :columns="columns"
      :data="data"
      row-key="id"
      :pagination.sync="paginationProp"
      @request="request"
      :loading="loading"
      :filter="clientSideFilter"
      :filter-method="customFilter"
    >
      <template v-slot:top-right="props">
        <q-btn-group class="q-mt-sm">
          <q-btn color="white" text-color="black">
            <q-icon left name="fas fa-filter fa-fw" class="gt-sm" size="1rem" />
            <q-icon name="fas fa-filter fa-fw" class="lt-md" size="1rem" />
            <div class="gt-sm">Filter</div>
            <q-menu
              id="menu"
              :persistent="persistent"
              anchor="bottom left"
              self="top left"
              @click="closeMenu"
              :content-style="{ width: '300px' }"
            >
              <div class="q-pa-md">
                <div class="q-gutter-sm">
                  <div class="text-subtitle1 text-grey-14">Status</div>
                  <q-option-group
                    v-model="filter.status"
                    :options="options"
                    color="green"
                    type="checkbox"
                  />
                  <div class="text-subtitle1 text-grey-14">Created date</div>
                  <q-input
                    filled
                    ref="startDate"
                    v-model="filter.date.startDate"
                    label="From"
                    mask="date"
                    placeholder="YYYY/MM/DD"
                  >
                    <template v-slot:prepend>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                        @click.stop="persistent = true"
                      >
                        <q-menu
                          @before-hide="persistent = false"
                          ref="startDateMenu"
                        >
                          <q-date
                            v-model="filter.date.startDate"
                            :options="maxDate"
                          />
                        </q-menu>
                      </q-icon>
                    </template>
                    <template v-slot:append>
                      <q-icon
                        v-if="filter.date.startDate.length > 0"
                        name="close"
                        @click="filter.date.startDate = ''"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                  <q-input
                    filled
                    ref="endDate"
                    v-model="filter.date.endDate"
                    label="To"
                    mask="date"
                    placeholder="YYYY/MM/DD"
                  >
                    <template v-slot:prepend>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                        @click.stop="persistent = true"
                      >
                        <q-menu
                          @before-hide="persistent = false"
                          ref="endDateMenu"
                        >
                          <q-date
                            v-model="filter.date.endDate"
                            :options="minDate"
                          />
                        </q-menu>
                      </q-icon>
                    </template>
                    <template v-slot:append>
                      <q-icon
                        v-if="filter.date.endDate.length > 0"
                        name="close"
                        @click="filter.date.endDate = ''"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                  <div class="text-subtitle1 text-grey-14 q-mt-md">Search</div>
                  <q-input
                    filled
                    ref="search"
                    v-model="filter.search"
                    label="Search"
                    style="width: auto"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        v-if="filter.search.length > 0"
                        name="close"
                        class="cursor-pointer"
                        @click="filter.search = ''"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
              <q-separator />
              <div class="q-pa-md row justify-between">
                <q-btn
                  color="white"
                  text-color="black"
                  label="Clear"
                  size="sm"
                  @click="clear"
                />
                <q-btn
                  color="primary"
                  label="Apply"
                  size="sm"
                  @click="applyFilter"
                />
              </div>
            </q-menu>
          </q-btn>
          <q-btn
            color="white"
            text-color="black"
            @click="toggleFullscreen(props)"
          >
            <q-icon
              left
              class="gt-sm"
              :name="
                props.inFullscreen
                  ? 'fas fa-compress fa-fw'
                  : 'fas fa-expand fa-fw'
              "
              size="1rem"
            />
            <q-icon
              class="lt-md"
              :name="
                props.inFullscreen
                  ? 'fas fa-compress fa-fw'
                  : 'fas fa-expand fa-fw'
              "
              size="1rem"
            />
            <div class="gt-sm">
              {{ props.inFullscreen ? 'Exit Fullscreeen' : 'Fullscreen' }}
            </div>
          </q-btn>
          <q-btn color="primary" @click="showAddChargeDialog = true">
            <q-icon
              left
              class="gt-sm"
              name="fas fa-user-plus fa-fw"
              size="1rem"
            />
            <q-icon class="lt-md" name="fas fa-user-plus fa-fw" size="1rem" />
            <div class="gt-sm">New</div>
          </q-btn>
        </q-btn-group>
      </template>
      <template v-slot:body-cell-amount="props">
        <q-td>
          <div class="row no-wrap">
            <div class="text-bold q-mr-md">
              {{
                formatCurrency({
                  amount: props.row.amount,
                  currency: props.row.currency,
                })
              }}
            </div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td>
          <div v-if="props.value === 'succeeded'" class="text-positive">
            {{ props.value }} <i class="fas fa-check fa-fw fa-sm"></i>
          </div>
          <div v-else-if="props.value === 'pending'" class="text-light-blue-8">
            {{ props.value }}...
          </div>
          <div v-else-if="props.value === 'failed'" class="text-negative">
            {{ props.row.value }}
            <i class="fas fa-exclamation-triangle fa-fw fa-sm"></i>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-id="props">
        <q-td>
          <router-link :to="`/payments/${props.value}`">
            {{ props.value }}
          </router-link>
        </q-td>
      </template>
      <template v-slot:body-cell-created="props">
        <q-td>
          {{ props.value }}
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td>
          <div class="row justify-center">
            <q-btn flat no-wrap size="sm" class="gt-sm" color="secondary">
              <q-icon left name="fas fa-reply" size="1rem" />
              <div>refund</div>
            </q-btn>
            <q-btn flat round size="sm" class="lt-md" color="secondary">
              <q-icon name="fas fa-reply" size="1rem" />
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>
    <!-- Add new payment -->
    <payments-add-charge-dialog
      :show-dialog.sync="showAddChargeDialog"
      :source-data="getCustomerSourceData"
      :default-source="$store.state.customers.customerData.info.default_source"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import PaymentsAddChargeDialog from 'components/payments/PaymentsAddChargeDialog.vue';

export default {
  name: 'PaymentsTable',
  props: {
    data: { type: Array, required: true },
    loading: { type: Boolean, required: true },
    pagination: {
      type: Object,
      default() {
        return {
          descending: true,
          page: 1,
          rowsPerPage: 10,
          sortBy: null,
        };
      },
    },
  },
  data() {
    return {
      showAddChargeDialog: false,
      persistent: false,
      clientSideFilter: {
        search: '',
        status: [],
        date: { startDate: null, endDate: null },
      },
      options: [
        {
          label: 'Succeeded',
          value: 'succeeded',
        },
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
      columns: [
        {
          name: 'amount',
          required: true,
          label: 'Amount',
          align: 'left',
          field: 'amount',
          sortable: true,
        },
        {
          name: 'currency',
          required: true,
          label: 'Currency',
          align: 'left',
          field: 'currency',
          sortable: true,
          format: value => value.toUpperCase(),
        },
        {
          name: 'status',
          required: true,
          label: 'Status',
          align: 'left',
          field: 'status',
          sortable: true,
        },
        {
          name: 'description',
          required: true,
          label: 'Description',
          align: 'left',
          field: 'description',
          sortable: true,
        },
        {
          name: 'id',
          required: true,
          label: 'ID',
          align: 'left',
          field: 'id',
          sortable: true,
        },
        {
          name: 'email',
          required: true,
          label: 'Email',
          align: 'left',
          field: 'receipt_email',
          sortable: true,
        },
        {
          name: 'created',
          required: true,
          label: 'Created',
          align: 'left',
          field: 'created',
          sortable: true,
          format: value => this.$moment.unix(value).format('YYYY/MM/DD h:mm A'),
        },
        {
          name: 'actions',
          label: 'Actions',
          align: 'center',
        },
      ],
    };
  },
  components: {
    paymentsAddChargeDialog: PaymentsAddChargeDialog,
  },
  computed: {
    ...mapGetters('customers', ['getCustomerSourceData']),
    filter: {
      get() {
        return this.$store.state.payments.filter;
      },
      set(value) {
        this.updateFilter(value);
      },
    },
    paginationProp: {
      get() {
        return this.pagination;
      },
      set(value) {
        this.$emit('update:pagination', value);
      },
    },
  },
  methods: {
    ...mapMutations('payments', ['updateFilter']),
    ...mapMutations('layout', ['updateFullscreen']),
    ...mapActions('payments', ['asyncUpdatePayments']),
    applyFilter() {
      this.$emit('update:pagination.page', 1);
      this.clientSideFilter = { ...this.$store.state.payments.filter };
    },
    closeMenu() {
      this.$refs.startDateMenu.hide();
      this.$refs.endDateMenu.hide();
    },
    customFilter(rows, terms) {
      const lowerCaseTerms = terms.search ? terms.search.toLowerCase() : '';

      if (terms.status.length > 0) {
        rows = rows.filter(row =>
          terms.status.some(statusItem => row.status === statusItem)
        );
      }

      if (terms.date.startDate) {
        rows = rows.filter(row => {
          const date = this.$moment.unix(row.created).format();

          return this.$moment(date).isSameOrAfter(
            this.$moment(terms.date.startDate)
          );
        });
      }

      if (terms.date.endDate) {
        rows = rows.filter(row => {
          const date = this.$moment.unix(row.created).format();

          return this.$moment(date).isSameOrBefore(
            this.$moment(terms.date.endDate)
          );
        });
      }

      return rows.filter(row => {
        const columns = ['description', 'id', 'receipt_email'];

        return columns.some(column =>
          row[column].toLowerCase().includes(lowerCaseTerms)
        );
      });
    },
    clear() {
      this.filter.status = [];
      this.filter.date.startDate = '';
      this.filter.date.endDate = '';
      this.filter.search = '';
    },
    formatCurrency(payload) {
      if (
        this.$store.state.stripe.zeroDecimalCurrencies.includes(
          payload.currency
        )
      ) {
        return `${this.$currencyFormatter.format(payload.amount, {
          code: payload.currency.toUpperCase(),
        })}`;
      }
      return `${this.$currencyFormatter.format(payload.amount / 100, {
        code: payload.currency.toUpperCase(),
      })}`;
    },
    maxDate(date) {
      if (this.filter.date.endDate) {
        return date <= this.filter.date.endDate;
      }
      return true;
    },
    minDate(date) {
      if (this.filter.date.startDate) {
        return date >= this.filter.date.startDate;
      }
      return true;
    },
    request({ pagination, filter }) {
      this.asyncUpdatePayments({ pagination, filter });
    },
    toggleFullscreen(props) {
      props.toggleFullscreen();
      this.updateFullscreen(!this.$store.state.layout.fullscreen);
    },
  },
};
</script>
