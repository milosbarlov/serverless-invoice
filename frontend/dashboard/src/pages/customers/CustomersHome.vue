<template>
  <q-page
    :class="{ 'bread-crumb-padding': $q.screen.gt.sm, container: true }"
    :padding="!$q.platform.is.mobile"
  >
    <q-table
      :columns="columns"
      :data="$store.state.customers.customersData"
      :filter="$store.state.customers.filter"
      :loading="$store.state.customers.loading"
      :pagination.sync="pagination"
      @request="request"
      row-key="id"
      title="Customers"
    >
      <template #top-right="props">
        <div class="q-gutter-x-sm">
          <q-btn color="white" text-color="black" size="sm">
            <q-icon :left="$q.screen.gt.sm" name="filter_list" />
            <div class="gt-sm">Filter</div>
            <q-menu
              @before-show="menuShown"
              content-class="shadow-10"
              id="menu"
              ref="menu"
              anchor="bottom left"
              self="top left"
              :content-style="{ width: '300px' }"
            >
              <div class="q-pa-md">
                <div class="q-gutter-sm">
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
                      <q-icon color="cyan" name="event" class="cursor-pointer">
                        <q-menu ref="startDateMenu">
                          <q-date
                            color="cyan"
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
                      <q-icon color="cyan" name="event" class="cursor-pointer">
                        <q-menu ref="endDateMenu">
                          <q-date
                            color="cyan"
                            v-model="input.endDate"
                            :options="minDate"
                          />
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
                  text-color="black"
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
            text-color="black"
            @click="toggleFullscreen(props)"
          >
            <q-icon
              :left="$q.screen.gt.sm"
              size="1rem"
              :name="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            />
            <div class="gt-sm">
              {{ props.inFullscreen ? 'Exit Fullscreeen' : 'Fullscreen' }}
            </div>
          </q-btn>
          <q-btn to="/customers/add" color="cyan" size="sm">
            <q-icon :left="$q.screen.gt.sm" name="person_add" />
            <div class="gt-sm">New</div>
          </q-btn>
        </div>
      </template>
      <template #body-cell-id="props">
        <q-td>
          <router-link :to="`/customers/${props.value}`">
            {{ props.value }}
          </router-link>
        </q-td>
      </template>
      <template #body-cell-country="props">
        <q-td>
          <div>
            <q-chip color="blue-grey-1" dense square>
              <q-avatar>
                <img :src="getTwemojiFlag(props.value)" />
              </q-avatar>
              {{ props.value }}
            </q-chip>
          </div>
        </q-td>
      </template>
    </q-table>

    <!-- Breadcrumbs -->
    <bread-crumbs :breadcrumbs="breadcrumbs" v-if="!fullscreen" />
  </q-page>
</template>

<script>
import { date } from 'quasar';
import { mapState, mapMutations, mapActions } from 'vuex';
import BreadCrumbs from 'components/BreadCrumbs.vue';
import { getTwemojiFlag } from 'utils/country';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export default {
  name: 'CustomersHome',
  data() {
    return {
      breadcrumbs: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Customers',
          link: '',
        },
      ],
      columns: [
        {
          name: 'created',
          required: true,
          label: 'Created',
          align: 'left',
          field: 'created',
          sortable: true,
          format: value => date.formatDate(value * 1000, 'MMM D, YYYY h:mm A'),
        },
        {
          name: 'id',
          required: true,
          label: 'Customer ID',
          align: 'left',
          field: 'id',
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
          field: 'email',
          sortable: true,
        },
        {
          name: 'country',
          required: true,
          label: 'Country',
          align: 'left',
          field: row => row.shipping.address.country,
        },
        {
          name: 'phone',
          required: true,
          label: 'Phone',
          align: 'left',
          field: 'phone',
          format: (value, row) => {
            return parsePhoneNumberFromString(
              row.shipping.phone,
              row.shipping.address.country
            ).formatInternational();
          },
        },
      ],
      input: {
        startDate: '',
        endDate: '',
        search: '',
      },
    };
  },
  components: {
    breadCrumbs: BreadCrumbs,
  },
  computed: {
    ...mapState('layout', ['fullscreen']),
    pagination: {
      get() {
        return this.$store.state.customers.pagination;
      },
      set(value) {
        this.$store.commit('customers/setPagination', value);
      },
    },
  },
  methods: {
    ...mapMutations('layout', ['setFullscreen']),
    ...mapActions('customers', ['asyncUpdateCustomers']),
    applyFilter() {
      this.$store.commit('customers/setFilter', this.input);
      this.$store.commit('customers/setPage', 1);
      this.$refs.menu.hide();
    },
    clear() {
      this.input.startDate = '';
      this.input.endDate = '';
      this.input.search = '';
    },
    getTwemojiFlag,
    menuShown() {
      this.input = { ...this.$store.state.customers.filter };
    },
    maxDate(value) {
      if (this.$store.state.customers.filter.endDate) {
        return value <= this.$store.state.customers.filter.endDate;
      }
      return true;
    },
    minDate(value) {
      if (this.$store.state.customers.filter.startDate) {
        return value >= this.$store.state.customers.filter.startDate;
      }
      return true;
    },
    request({ pagination, filter }) {
      this.asyncUpdateCustomers({
        pagination,
        filter,
      });
    },
    toggleFullscreen(props) {
      props.toggleFullscreen();
      this.setFullscreen(!this.fullscreen);
    },
  },
  created() {
    this.request({
      pagination: this.$store.state.customers.pagination,
      filter: this.$store.state.customers.filter,
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
