<template>
  <q-page
    :class="[{ 'bread-crumb-padding': $q.screen.gt.sm }, 'container']"
    :padding="!$q.platform.is.mobile"
  >
    <div class="q-gutter-y-md">
      <q-card class="text-2b">
        <q-card-section>
          <div class="row items-center">
            <div class="text-h6">#{{ invoice.number }}</div>
            <q-chip
              v-if="
                invoice.status === 'open' && pastDueStatus(invoice.due_date)
              "
              color="red-1"
              dense
              icon-right="warning"
              text-color="red"
              >Past due</q-chip
            >
            <q-chip
              v-else-if="invoice.status === 'open'"
              dense
              color="blue-1"
              icon-right="email"
              text-color="blue"
              >Open
            </q-chip>
            <q-chip
              v-else-if="invoice.status === 'paid'"
              dense
              color="green-1"
              icon-right="check"
              text-color="green"
            >
              Paid
            </q-chip>
            <q-chip
              v-else-if="invoice.status === 'uncollectible'"
              dense
              color="amber-1"
              icon="mood_bad"
              text-color="amber"
            >
              Uncollectible
            </q-chip>
            <q-chip
              v-else-if="invoice.status === 'void'"
              dense
              color="blue-grey-1"
              icon-right="block"
              text-color="blue-grey"
            >
              Void
            </q-chip>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="text-2b">
        <q-card-section>
          <div class="q-gutter-y-md">
            <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
              <div class="col-12 col-sm-4">
                <div class="text-subtitle2">Bill to</div>
                <div class="text-h6">
                  {{ invoice.customer.name }}
                </div>
                <div class="text-69">
                  <div>{{ invoice.customer.address.line1 }}</div>
                  <div>{{ invoice.customer.address.line2 }}</div>
                  <div>
                    {{ invoice.customer.address.city }},
                    {{ invoice.customer.address.state }}
                    {{ invoice.customer.address.postal_code }}
                  </div>
                  <br />
                  <div>{{ invoice.customer.email }}</div>
                  <div>
                    {{
                      invoice.customer.phone
                        | formatInternational(invoice.customer.address.country)
                    }}
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-4">
                <div class="text-subtitle2">Ship to</div>
                <div class="text-h6">
                  {{ invoice.customer.shipping.name }}
                </div>
                <div class="text-69">
                  <div>{{ invoice.customer.shipping.address.line1 }}</div>
                  <div>{{ invoice.customer.shipping.address.line2 }}</div>
                  <div>
                    {{ invoice.customer.shipping.address.city }},
                    {{ invoice.customer.shipping.address.state }}
                    {{ invoice.customer.shipping.address.postal_code }}
                  </div>
                  <br />
                  <div>
                    {{
                      invoice.customer.shipping.phone
                        | formatInternational(
                          invoice.customer.shipping.address.country
                        )
                    }}
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-4">
                <table>
                  <tr>
                    <td class="text-right text-subtitle2">
                      Invoice number:
                    </td>
                    <td class="text-69">{{ invoice.number }}</td>
                  </tr>
                  <tr>
                    <td class="text-right text-subtitle2">
                      Date issued:
                    </td>
                    <td class="text-69">
                      {{ invoice.createdAt | formatDate }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-right text-subtitle2">
                      Due date:
                    </td>
                    <td class="text-69">{{ invoice.due_date | formatDate }}</td>
                  </tr>
                  <tr>
                    <td class="text-right text-subtitle2">
                      Amount due:
                    </td>
                    <td class="text-69">
                      {{
                        (invoice.total / 100)
                          | formatCurrency(invoice.customer.currency)
                      }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <q-banner v-if="invoice.description" class="bg-grey-1" rounded>
              {{ invoice.description }}
            </q-banner>
          </div>
        </q-card-section>
        <q-table
          :data="invoice.lines"
          :columns="columns"
          :card-class="'text-2b'"
          row-key="description"
          table-class="text-69"
          title="Invoice items"
        >
          <template #header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-2b text-subtitle2"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template #body-cell="props">
            <q-td :props="props">
              <div class="text-subtitle1">{{ props.value }}</div>
            </q-td>
          </template>
          <template #bottom>
            <q-space />
            <table cellspacing="0" class="text-69 text-subtitle1 text-right">
              <tr>
                <td>Subtotal:</td>
                <td>
                  {{
                    (invoice.subtotal / 100)
                      | formatCurrency(invoice.customer.currency)
                  }}
                </td>
              </tr>
              <tr class="bg-green-1 text-positive">
                <td>Total discounts:</td>
                <td>
                  {{
                    (invoice.discount / 100)
                      | formatCurrency(invoice.customer.currency)
                  }}
                </td>
              </tr>
              <tr>
                <td>Shipping:</td>
                <td>
                  {{
                    (invoice.shipping / 100)
                      | formatCurrency(invoice.customer.currency)
                  }}
                </td>
              </tr>
              <tr
                class="bg-blue-grey-1 text-2b text-weight-medium amount-due-border"
              >
                <td class="amount-due-border">Amount due:</td>
                <td class="amount-due-border">
                  {{
                    (invoice.total / 100)
                      | formatCurrency(invoice.customer.currency)
                  }}
                </td>
              </tr>
            </table>
          </template>
        </q-table>
        <q-card-section>
          <div class="text-69" v-if="invoice.footer">{{ invoice.footer }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Breadcrumbs -->
    <bread-crumbs :breadcrumbs="breadcrumbs" />
  </q-page>
</template>

<script>
import { date, Loading, QSpinner } from 'quasar';
import { axiosInstance } from 'boot/axios';
import { axiosError, notifyError } from 'utils/error-handler';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { formatCurrency } from 'utils/currency';
import BreadCrumbs from 'components/BreadCrumbs.vue';
import store from 'src/store/index';

export default {
  name: 'InvoiceHome',
  async beforeRouteEnter(to, from, next) {
    const Store = store();

    Loading.show({
      message: 'Loading invoice...',
      spinner: QSpinner,
      spinnerColor: 'purple',
      sanitize: true,
    });

    try {
      const { status, data } = await axiosInstance.get(
        `/invoices/${to.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${Store.state.auth.token}`,
          },
        }
      );

      if (status === 200) {
        if (data.status === 'draft') {
          next({ path: `/invoices/${to.params.id}/edit` });
        } else {
          next(vm => {
            vm.invoice = data;
          });
        }
      }
    } catch (error) {
      console.error(error);
      notifyError(axiosError(error));
      next('*');
    } finally {
      Loading.hide();
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Invoices',
          link: '/invoices',
        },
        {
          label: this.$route.params.id,
          link: '',
        },
      ],
      columns: [
        {
          name: 'description',
          required: true,
          label: 'Description',
          align: 'left',
          field: 'description',
          sortable: false,
        },
        {
          name: 'quantity',
          required: true,
          label: 'Quantity',
          align: 'right',
          field: 'quantity',
          sortable: false,
        },
        {
          name: 'unit_amount',
          required: true,
          label: 'Unit price',
          align: 'right',
          field: 'unit_amount',
          sortable: false,
          format: value => formatCurrency(value / 100, 'usd'),
        },
        {
          name: 'item_discount',
          required: true,
          label: 'Discount',
          align: 'right',
          field: 'item_discount',
          sortable: false,
          format: value => formatCurrency(value / 100, 'usd'),
        },
        {
          name: 'amount',
          required: true,
          label: 'Amount',
          align: 'right',
          field: 'amount',
          sortable: false,
          format: value => formatCurrency(value / 100, 'usd'),
        },
      ],
      invoice: {
        _id: null,
        customer: {
          address: {
            line1: null,
            line2: null,
            city: null,
            state: null,
            postal_code: null,
            country: null,
          },
          currency: null,
          email: null,
          name: null,
          phone: null,
          shipping: {
            address: {
              line1: null,
              line2: null,
              city: null,
              state: null,
              postal_code: null,
              country: null,
            },
            name: null,
            phone: null,
          },
        },
        description: null,
        number: null,
      },
    };
  },
  components: {
    breadCrumbs: BreadCrumbs,
  },
  filters: {
    formatDate(value) {
      return date.formatDate(value, 'YYYY-MM-DD');
    },
    formatInternational(phone, country) {
      if (phone && country) {
        return parsePhoneNumberFromString(phone, country).formatInternational();
      }
      return null;
    },
    formatCurrency,
  },
  methods: {
    pastDueStatus(dueDate) {
      return date.getDateDiff(new Date(), dueDate, 'days') > 0;
    },
  },
};
</script>

<style lang="stylus" scoped>
.amount-due-border
  border-top 1px solid black
  border-bottom 2px solid black

.container
  max-width 1200px
  margin-left auto
  margin-right auto

.q-table thead th
  font-size 14px !important
</style>
