<template>
  <q-page padding>
    <bread-crumbs
      :breadcrumbs="breadcrumbs"
      v-if="!fullscreen"
      class="q-mb-md"
    />
    <q-table
      title="Customers"
      :data="$store.state.customers.customersData"
      :columns="columns"
      row-key="id"
      :loading="$store.state.customers.loading"
      :pagination.sync="pagination"
      @request="request"
    >
      <template v-slot:top-right="props">
        <q-btn-group class="q-mt-sm">
          <q-btn color="white" text-color="black">
            <q-icon
              :left="$q.screen.gt.sm"
              name="fas fa-filter fa-fw"
              size="1rem"
            />
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
              :left="$q.screen.gt.sm"
              size="1rem"
              :name="
                props.inFullscreen
                  ? 'fas fa-compress fa-fw'
                  : 'fas fa-expand fa-fw'
              "
            />
            <div class="gt-sm">
              {{ props.inFullscreen ? 'Exit Fullscreeen' : 'Fullscreen' }}
            </div>
          </q-btn>
          <q-btn to="/customers/add" color="primary">
            <q-icon
              :left="$q.screen.gt.sm"
              name="fas fa-user-plus fa-fw"
              size="1rem"
            />
            <div class="gt-sm">New</div>
          </q-btn>
        </q-btn-group>
      </template>
      <template v-slot:body-cell-id="props">
        <q-td>
          <router-link :to="`/customers/${props.value}`">
            {{ props.value }}
          </router-link>
        </q-td>
      </template>
      <template v-slot:body-cell-country="props">
        <q-td>
          <div
            id="flag"
            class="row items-center"
            v-html="`${flag(props.value)} ${props.value}`"
          ></div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import BreadCrumbs from 'components/BreadCrumbs.vue';
import customerMixin from 'mixins/customer.js';

export default {
  name: 'CustomersHome',
  mixins: [customerMixin],
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
          link: '',
        },
      ],
      persistent: false,
      columns: [
        {
          name: 'date',
          required: true,
          label: 'Created Date',
          align: 'left',
          field: 'date',
          sortable: true,
          format: value => this.$moment.unix(value).format('YYYY/MM/DD h:mm A'),
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
          field: 'country',
          sortable: true,
        },
        {
          name: 'phone',
          required: true,
          label: 'Phone',
          align: 'left',
          field: 'phone',
          sortable: true,
        },
      ],
    };
  },
  components: {
    breadCrumbs: BreadCrumbs,
  },
  computed: {
    ...mapState('layout', ['fullscreen']),
  },
  methods: {
    ...mapMutations('customers', ['updatePage']),
    ...mapMutations('layout', ['updateFullscreen']),
    ...mapActions('customers', ['asyncUpdateCustomers']),
    applyFilter() {
      this.updatePage(1);
      this.request({
        pagination: this.pagination,
        filter: this.filter,
      });
    },
    clear() {
      this.filter.date.startDate = '';
      this.filter.date.endDate = '';
      this.filter.search = '';
    },
    closeMenu() {
      this.$refs.startDateMenu.hide();
      this.$refs.endDateMenu.hide();
    },
    toggleFullscreen(props) {
      props.toggleFullscreen();
      this.updateFullscreen(!this.fullscreen);
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
      this.asyncUpdateCustomers({
        pagination,
        filter: filter || this.filter,
      });
    },
  },
  created() {
    this.request({
      pagination: this.pagination,
      filter: this.filter,
    });
  },
};
</script>

<style lang="stylus" scoped>
#flag >>> img.emoji
  height 2em
  width 2em
  margin 0 1em 0 0.1em
  vertical-align -0.1em
</style>
