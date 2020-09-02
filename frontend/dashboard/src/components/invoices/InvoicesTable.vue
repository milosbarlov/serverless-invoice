<template>
  <div>
    <q-table
      card-class="text-2b"
      :columns="columns"
      :data="$store.state.invoices.invoicesData"
      :filter="serverSideFilter"
      :loading="loading"
      :pagination.sync="paginationProp"
      @request="request"
      row-key="id"
      title="Invoices"
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
                  <div class="text-subtitle1 text-69">Status</div>
                  <q-select
                    color="cyan"
                    dense
                    emit-value
                    filled
                    map-options
                    :options="options"
                    v-model="model.status"
                  />
                  <div class="text-subtitle1 text-69 q-mt-md">
                    Created date
                  </div>
                  <q-input
                    color="cyan"
                    dense
                    filled
                    ref="startDate"
                    v-model="model.startDate"
                    label="From"
                    mask="date"
                    placeholder="YYYY/MM/DD"
                  >
                    <template #prepend>
                      <q-icon name="event" class="cursor-pointer" color="cyan">
                        <q-menu ref="startDateMenu">
                          <q-date
                            color="cyan"
                            v-model="model.startDate"
                            :options="maxDate"
                          />
                        </q-menu>
                      </q-icon>
                    </template>
                    <template #append>
                      <q-icon
                        v-if="model.startDate"
                        name="close"
                        @click.stop="model.startDate = ''"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                  <q-input
                    color="cyan"
                    dense
                    filled
                    ref="endDate"
                    v-model="model.endDate"
                    label="To"
                    mask="date"
                    placeholder="YYYY/MM/DD"
                  >
                    <template #prepend>
                      <q-icon name="event" class="cursor-pointer" color="cyan">
                        <q-menu ref="endDateMenu">
                          <q-date
                            color="cyan"
                            v-model="model.endDate"
                            :options="minDate"
                          />
                        </q-menu>
                      </q-icon>
                    </template>
                    <template #append>
                      <q-icon
                        v-if="model.endDate"
                        name="close"
                        @click.stop="model.endDate = ''"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                  <div class="text-subtitle1 text-69 q-mt-md">Search</div>
                  <q-input
                    color="cyan"
                    dense
                    filled
                    ref="search"
                    v-model="model.search"
                    label="Search"
                    style="width: auto"
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                    <template #append>
                      <q-icon
                        v-if="model.search"
                        name="close"
                        class="cursor-pointer"
                        @click.stop="model.search = ''"
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
          <q-btn color="cyan" size="sm" to="/invoices/create">
            <q-icon :left="$q.screen.gt.sm" name="person_add" />
            <div class="gt-sm">New</div>
          </q-btn>
        </div>
      </template>
      <template #body-cell-status="props">
        <q-td>
          <div v-if="props.value === 'open'">
            <q-chip
              color="red-1"
              dense
              icon-right="warning"
              text-color="red"
              v-if="isPastDue(props.row.due_date)"
            >
              Past due
            </q-chip>
            <q-chip
              v-else
              dense
              color="blue-1"
              icon-right="email"
              text-color="blue"
            >
              Open
            </q-chip>
          </div>
          <div v-else-if="props.value === 'paid'">
            <q-chip dense color="green-1" icon-right="check" text-color="green">
              Paid
            </q-chip>
          </div>
          <div v-else-if="props.value === 'uncollectible'">
            <q-chip dense color="amber-1" icon="mood_bad" text-color="amber">
              Uncollectible
            </q-chip>
          </div>
          <div v-else-if="props.value === 'void'">
            <q-chip
              dense
              color="blue-grey-1"
              icon-right="block"
              text-color="blue-grey"
            >
              Void
            </q-chip>
          </div>
          <div v-else-if="props.value === 'draft'">
            <q-chip
              dense
              color="purple-1"
              icon-right="create"
              text-color="purple"
            >
              Draft
            </q-chip>
          </div>
        </q-td>
      </template>
      <template #body-cell-_id="props">
        <q-td>
          <router-link
            v-if="props.row.status !== 'draft'"
            :to="`/invoices/${props.value}`"
          >
            {{ props.value }}
          </router-link>
          <router-link v-else :to="`/invoices/${props.value}/edit`">
            {{ props.value }}
          </router-link>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { date } from 'quasar';
import { formatCurrency } from 'utils/currency';

export default {
  name: 'InvoicesTable',
  props: {
    filter: { type: Object, required: true },
    loading: { type: Boolean, required: true },
    pagination: { type: Object, required: true },
    pastDue: { type: Boolean, required: true },
    tab: { type: String, required: true },
  },
  data() {
    return {
      model: {
        status: 'all',
        startDate: null,
        endDate: null,
        search: null,
      },
      options: [
        { label: 'All', value: 'all' },
        { label: 'Draft', value: 'draft' },
        { label: 'Open', value: 'open' },
        { label: 'Paid', value: 'paid' },
        { label: 'Uncollectible', value: 'uncollectible' },
        { label: 'Void', value: 'void' },
      ],
      columns: [
        {
          name: 'total',
          required: true,
          label: 'Amount',
          field: 'total',
          sortable: true,
          format: (value, row) =>
            formatCurrency(value / 100, row.customer.currency),
        },
        {
          name: 'currency',
          required: true,
          label: 'Currency',
          align: 'left',
          field: 'currency',
          sortable: true,
          format: (value, row) => {
            if (row.customer) {
              return row.customer.currency.toUpperCase();
            }
            return 'N/A';
          },
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
          name: 'number',
          required: true,
          label: 'Invoice Number',
          align: 'left',
          field: 'number',
          sortable: true,
        },
        {
          name: '_id',
          required: true,
          label: 'ID',
          align: 'left',
          field: '_id',
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
          name: 'email',
          required: true,
          label: 'Email',
          align: 'left',
          field: row => row.customer.email,
          sortable: true,
        },
        {
          name: 'due_date',
          required: true,
          label: 'Due',
          align: 'left',
          field: 'due_date',
          sortable: true,
          format: value => date.formatDate(value, 'MMM D, YYYY') || 'N/A',
        },
        {
          name: 'createdAt',
          required: true,
          label: 'Created',
          align: 'left',
          field: 'createdAt',
          sortable: true,
          format: value => date.formatDate(value, 'MMM D, YYYY h:mm A'),
        },
      ],
    };
  },
  computed: {
    serverSideFilter: {
      get() {
        return this.filter;
      },
      set(value) {
        this.$emit('update:filter', value);
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
    applyFilter() {
      this.serverSideFilter = { ...this.model };
      this.$emit('update:tab', this.model.status);
      this.$emit('requestInvoices');
      this.$refs.menu.hide();
    },
    clear() {
      this.model.status = 'all';
      this.model.startDate = '';
      this.model.endDate = '';
      this.model.search = '';
    },
    maxDate(value) {
      if (this.model.endDate) {
        return value <= this.model.endDate;
      }
      return true;
    },
    minDate(value) {
      if (this.model.startDate) {
        return value >= this.model.startDate;
      }
      return true;
    },
    menuShown() {
      this.model = { ...this.filter };
    },
    isPastDue(dueDate) {
      return date.getDateDiff(new Date(), dueDate, 'days') > 0;
    },
    request({ filter, pagination }) {
      this.$emit('update:pagination', pagination);
      this.$emit('update:filter', filter);
      this.$emit('requestInvoices');
    },
    toggleFullscreen(props) {
      props.toggleFullscreen();
      this.$store.commit(
        'layout/setFullscreen',
        !this.$store.state.layout.fullscreen
      );
    },
  },
};
</script>
