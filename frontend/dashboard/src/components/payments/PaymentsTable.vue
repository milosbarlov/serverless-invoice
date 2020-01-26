<template>
  <div>
    <q-table
      card-class="text-2b"
      :columns="columns"
      :data="data"
      :filter="filter"
      :loading="loading"
      :pagination.sync="serverSidePagination"
      @request="request"
      row-key="id"
      title="Payments"
    >
      <template #top-right="props">
        <div class="q-gutter-x-sm">
          <q-btn color="white" size="sm" text-color="2b">
            <q-icon :left="$q.screen.gt.sm" name="filter_list" />
            <div class="gt-sm">Filter</div>
            <q-menu
              content-class="shadow-10"
              id="menu"
              ref="menu"
              anchor="bottom left"
              self="top left"
              @before-show="menuShown"
              :content-style="{ width: '300px' }"
            >
              <div class="q-pa-md">
                <div class="q-gutter-sm">
                  <div class="text-subtitle1 text-grey-14">Status</div>
                  <q-option-group
                    v-model="input.status"
                    :options="options"
                    color="green"
                    type="checkbox"
                  />
                  <div class="text-subtitle1 text-grey-14">Created date</div>
                  <q-input
                    color="cyan"
                    dense
                    filled
                    ref="startDate"
                    v-model="input.startDate"
                    label="From"
                    mask="date"
                    placeholder="YYYY/MM/DD"
                  >
                    <template #prepend>
                      <q-icon name="event" class="cursor-pointer" color="cyan">
                        <q-menu ref="startDateMenu">
                          <q-date
                            v-model="input.startDate"
                            :options="maxDate"
                          />
                        </q-menu>
                      </q-icon>
                    </template>
                    <template #append>
                      <q-icon
                        v-if="input.startDate"
                        name="close"
                        @click.stop="input.startDate = ''"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                  <q-input
                    color="cyan"
                    dense
                    filled
                    ref="endDate"
                    v-model="input.endDate"
                    label="To"
                    mask="date"
                    placeholder="YYYY/MM/DD"
                  >
                    <template #prepend>
                      <q-icon name="event" class="cursor-pointer" color="cyan">
                        <q-menu ref="endDateMenu">
                          <q-date v-model="input.endDate" :options="minDate" />
                        </q-menu>
                      </q-icon>
                    </template>
                    <template #append>
                      <q-icon
                        v-if="input.endDate"
                        name="close"
                        @click.stop="input.endDate = ''"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                  <div class="text-subtitle1 text-grey-14 q-mt-md">Search</div>
                  <q-input
                    color="cyan"
                    dense
                    filled
                    ref="search"
                    v-model="input.search"
                    label="Search"
                    style="width: auto"
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                    <template #append>
                      <q-icon
                        v-if="input.search"
                        name="close"
                        class="cursor-pointer"
                        @click.stop="input.search = ''"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
              <q-separator />
              <div class="q-pa-md row justify-between">
                <q-btn
                  color="white"
                  text-color="2b"
                  label="Clear"
                  size="sm"
                  @click="clear"
                />
                <q-btn
                  color="cyan"
                  label="Apply"
                  size="sm"
                  @click.stop="applyFilter"
                />
              </div>
            </q-menu>
          </q-btn>
          <q-btn
            color="white"
            size="sm"
            text-color="2b"
            @click="toggleFullscreen(props)"
          >
            <q-icon
              :left="$q.screen.gt.sm"
              :name="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            />
            <div class="gt-sm">
              {{ props.inFullscreen ? 'Exit Fullscreeen' : 'Fullscreen' }}
            </div>
          </q-btn>
          <q-btn color="cyan" @click="showAddChargeDialog = true" size="sm">
            <q-icon :left="$q.screen.gt.sm" name="person_add" />
            <div class="gt-sm">New</div>
          </q-btn>
        </div>
      </template>
      <template #body-cell-amount="props">
        <q-td>
          <div class="text-bold text-right">
            {{ props.value }}
          </div>
        </q-td>
      </template>
      <template #body-cell-status="props">
        <q-td>
          <div v-if="props.value === 'succeeded'">
            <q-chip
              v-if="props.row.refunded"
              color="blue-grey-1"
              dense
              icon-right="reply"
              text-color="blue-grey"
              >Refunded</q-chip
            >
            <q-chip
              v-else
              color="green-1"
              dense
              icon-right="check"
              text-color="green"
              >Succeeded</q-chip
            >
          </div>
          <div v-else-if="props.value === 'pending'">
            <q-chip
              color="blue-1"
              dense
              icon-right="access_time"
              text-color="blue"
              >Pending</q-chip
            >
          </div>
          <div v-else-if="props.value === 'failed'">
            <q-chip color="red-1" dense icon-right="warning" text-color="red"
              >Failed</q-chip
            >
          </div>
        </q-td>
      </template>
      <template #body-cell-id="props">
        <q-td>
          <router-link :to="`/payments/${props.value}`">
            {{ props.value }}
          </router-link>
        </q-td>
      </template>
      <template #body-cell-created="props">
        <q-td>
          {{ props.value }}
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td>
          <div class="row justify-center">
            <q-btn flat round icon="more_vert" size="sm" color="grey">
              <q-menu fit anchor="bottom left" self="top left">
                <q-list class="scroll">
                  <q-item
                    v-if="!props.row.refunded"
                    clickable
                    v-close-popup
                    @click="refund(props.row)"
                  >
                    <q-item-section avatar>
                      <q-icon name="reply" />
                    </q-item-section>
                    <q-item-section>
                      <div>Refund...</div>
                    </q-item-section>
                  </q-item>
                  <q-item
                    :to="`/payments/${props.row.id}`"
                    clickable
                    v-close-popup
                  >
                    <q-item-section avatar>
                      <q-icon name="arrow_forward" />
                    </q-item-section>
                    <q-item-section>
                      <div>Payment details</div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
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
    <!-- Refund payment -->
    <payment-refund-dialog
      v-bind="refundData"
      :show-dialog.sync="showRefundDialog"
    />
  </div>
</template>

<script>
import { date } from 'quasar';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import PaymentsAddChargeDialog from 'components/payments/PaymentsAddChargeDialog.vue';
import PaymentRefundDialog from 'components/payments/PaymentRefundDialog.vue';
import { formatCurrency, zeroDecimalCurrencies } from 'utils/currency';

export default {
  name: 'PaymentsTable',
  props: {
    data: { type: Array, required: true },
    filter: { type: Object, required: true },
    loading: { type: Boolean, required: true },
    pagination: { type: Object, required: true },
  },
  data() {
    return {
      showAddChargeDialog: false,
      showRefundDialog: false,
      input: {
        status: [],
        startDate: '',
        endDate: '',
        search: '',
      },
      refundData: {
        amount: 0,
        amountRefunded: 0,
        currency: '',
        id: '',
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
          label: 'Refunded',
          value: 'refunded',
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
          field: 'amount',
          sortable: true,
          format: (value, row) => {
            if (zeroDecimalCurrencies.includes(row.currency)) {
              return formatCurrency(value, row.currency);
            }
            return formatCurrency(value / 100, row.currency);
          },
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
          format: value => value || 'N/A',
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
          format: value => value || 'N/A',
        },
        {
          name: 'created',
          required: true,
          label: 'Date',
          align: 'left',
          field: 'created',
          sortable: true,
          format: value => date.formatDate(value * 1000, 'MMM D, YYYY h:mm A'),
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
    paymentRefundDialog: PaymentRefundDialog,
  },
  computed: {
    ...mapGetters('customers', ['getCustomerSourceData']),
    serverSideFilter: {
      get() {
        return this.filter;
      },
      set(value) {
        this.$emit('update:filter', value);
      },
    },
    serverSidePagination: {
      get() {
        return this.pagination;
      },
      set(value) {
        this.$emit('update:pagination', value);
      },
    },
  },
  methods: {
    ...mapMutations('payments', ['setFilter']),
    ...mapMutations('layout', ['setFullscreen']),
    ...mapActions('payments', ['asyncUpdatePayments']),
    applyFilter() {
      // this.$emit('update:pagination.page', 1);
      this.serverSideFilter = { ...this.input };
      this.$refs.menu.hide();
    },
    // customFilter(rows, terms) {
    //   const lowerCaseTerms = terms.search ? terms.search.toLowerCase() : '';

    //   if (terms.status.length > 0) {
    //     rows = rows.filter(row =>
    //       terms.status.some(statusItem => row.status === statusItem)
    //     );
    //   }

    //   if (terms.date.startDate) {
    //     rows = rows.filter(row => {
    //       const timestamp = date.formatDate(row.created * 1000);

    //       return date.getDateDiff(timestamp, terms.date.startDate, 'days') >= 0;
    //     });
    //   }

    //   if (terms.date.endDate) {
    //     rows = rows.filter(row => {
    //       const timestamp = date.formatDate(row.created * 1000);

    //       return date.getDateDiff(timestamp, terms.date.startDate, 'days') <= 0;
    //     });
    //   }

    //   return rows.filter(row => {
    //     const columns = ['description', 'id', 'receipt_email'];

    //     return columns.some(column =>
    //       row[column].toLowerCase().includes(lowerCaseTerms)
    //     );
    //   });
    // },
    clear() {
      this.input.status = [];
      this.input.startDate = '';
      this.input.endDate = '';
      this.input.search = '';
    },
    maxDate(value) {
      if (this.input.endDate) {
        return value <= this.input.endDate;
      }
      return true;
    },
    minDate(value) {
      if (this.input.startDate) {
        return value >= this.input.startDate;
      }
      return true;
    },
    menuShown() {
      this.input = { ...this.filter };
    },
    refund(data) {
      Object.keys(this.refundData).forEach(key => {
        this.refundData[key] = data[key];
      });
      this.showRefundDialog = true;
    },
    request({ pagination, filter }) {
      this.asyncUpdatePayments({ pagination, filter });
    },
    toggleFullscreen(props) {
      props.toggleFullscreen();
      this.setFullscreen(!this.$store.state.layout.fullscreen);
    },
  },
};
</script>
