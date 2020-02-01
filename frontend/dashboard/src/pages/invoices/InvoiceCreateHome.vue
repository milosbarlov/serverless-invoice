<template>
  <q-page
    :class="[{ 'bread-crumb-padding': $q.screen.gt.sm }, 'container']"
    :padding="!$q.platform.is.mobile"
  >
    <q-card class="text-2b">
      <q-banner
        v-if="form.status === 'draft' && $route.name === 'edit-invoice'"
        class="bg-light-blue text-white text-center text-uppercase"
      >
        Draft
      </q-banner>
      <alert :alert="message ? true : false" :message="message" />
      <q-card-section>
        <div class="row q-col-gutter-x-md q-col-gutter-y-lg q-mb-lg">
          <!-- Billing -->
          <div class="col-12 col-md-4 q-gutter-y-md">
            <div class="text-h6 text-69 text-uppercase">
              Billing
            </div>
            <q-select
              color="cyan"
              dense
              :disable="$route.name === 'edit-invoice'"
              filled
              @filter="filterByEmail"
              fill-input
              hide-selected
              label="Bill to:"
              :options="options"
              option-label="email"
              option-value="email"
              use-input
              v-model="form.customer"
            >
              <template #append>
                <q-icon
                  class="cursor-pointer"
                  @click.stop="form.customer = ''"
                  name="close"
                  v-if="form.customer.email && $route.name !== 'edit-invoice'"
                />
              </template>
            </q-select>
            <q-list dense separator>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">Name</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label v-if="form.customer.email">
                    {{ form.customer.name }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section :top="form.customer.address !== undefined">
                  <q-item-label class="text-subtitle2">Address</q-item-label>
                </q-item-section>
                <q-item-section :top="form.customer.address !== undefined">
                  <q-item-label
                    v-if="form.customer.email && !form.customer.address"
                    class="text-grey"
                  >
                    No address provided
                  </q-item-label>
                  <q-item-label v-if="form.customer.email">
                    {{ form.customer.address.line1 }}<br />
                    {{ form.customer.address.line2 }}<br />
                    {{ form.customer.address.city }},
                    {{ form.customer.address.state }}
                    {{ form.customer.address.postal_code }}<br />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2"
                    >Phone number</q-item-label
                  >
                </q-item-section>
                <q-item-section>
                  <q-item-label v-if="form.customer.email">
                    {{
                      formatInternational(
                        form.customer.phone,
                        form.customer.address.country
                      )
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">Currency</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label v-if="form.customer.email">
                    {{ form.customer.currency.toUpperCase() }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2">
                    Invoice prefix
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label v-if="form.customer.email">
                    {{ form.customer.invoice_prefix }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Shipping -->
          <div class="col-12 col-md-4 q-gutter-y-sm">
            <div class="justify-between row">
              <div class="text-h6 text-69 text-uppercase">
                Shipping
              </div>
              <q-toggle
                class="gt-xs"
                color="cyan"
                icon="local_shipping"
                label="Shippable"
                left-label
                v-model="form.shippable"
              />
            </div>
            <q-list class="lt-sm">
              <q-item dense tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Shippable</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-toggle
                    class="lt-sm"
                    color="cyan"
                    icon="local_shipping"
                    left-label
                    v-model="form.shippable"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <q-field
              class="q-mb-md"
              dense
              :disable="!form.shippable"
              label="Ship to:"
              outlined
              :readonly="form.shippable"
              :stack-label="form.customer !== '' && form.shippable"
            >
              <template #control v-if="form.customer.shipping">
                <div v-if="form.shippable">
                  {{ form.customer.shipping.name }}
                </div>
              </template>
            </q-field>
            <q-list dense separator v-if="form.shippable">
              <q-item>
                <q-item-section :top="form.customer.address !== undefined">
                  <q-item-label class="text-subtitle2">Address</q-item-label>
                </q-item-section>
                <q-item-section :top="form.customer.address !== undefined">
                  <q-item-label
                    v-if="form.customer.email && !form.customer.address"
                    class="text-grey"
                  >
                    No address provided
                  </q-item-label>
                  <q-item-label v-if="form.customer.email">
                    {{ form.customer.shipping.address.line1 }}<br />
                    {{ form.customer.shipping.address.line2 }}<br />
                    {{ form.customer.shipping.address.city }},
                    {{ form.customer.shipping.address.state }}
                    {{ form.customer.shipping.address.postal_code }}<br />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2"
                    >Phone number</q-item-label
                  >
                </q-item-section>
                <q-item-section>
                  <q-item-label v-if="form.customer.email">
                    {{
                      formatInternational(
                        form.customer.shipping.phone,
                        form.customer.shipping.address.country
                      )
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Invoice details -->
          <div class="col-12 col-md-4 q-gutter-y-md">
            <div class="text-h6 text-69 text-uppercase">
              Invoice details
            </div>
            <!-- Date issued -->
            <q-input
              dense
              filled
              label="Date of issue"
              mask="date"
              readonly
              v-model="date"
            />
            <!-- Due date -->
            <q-input
              class="gt-xs"
              color="cyan"
              dense
              filled
              label="Due date"
              mask="date"
              placeholder="YYYY/MM/DD"
              v-model="form.due_date"
            >
              <template #prepend>
                <q-icon color="cyan" name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="dueDatePopup"
                    :breakpoint="600"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      @input="() => $refs.dueDatePopup.hide()"
                      v-model="form.due_date"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template #append>
                <q-icon
                  v-if="form.due_date"
                  name="close"
                  @click.stop="form.due_date = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>

            <q-field
              color="cyan"
              class="cursor-pointer lt-sm"
              dense
              filled
              label="Due date"
              :stack-label="form.due_date !== ''"
            >
              <template #prepend>
                <q-icon color="cyan" name="event" />
              </template>
              <template #append>
                <q-icon
                  v-if="form.due_date"
                  name="close"
                  @click.stop="form.due_date = ''"
                  class="cursor-pointer"
                />
              </template>
              <template #control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ form.due_date }}
                </div>
              </template>

              <q-popup-proxy ref="dueDatePopup" :breakpoint="600">
                <q-date
                  color="cyan"
                  @input="() => $refs.dueDatePopup.hide()"
                  v-model="form.due_date"
                />
              </q-popup-proxy>
            </q-field>

            <!-- Description -->
            <q-input
              autogrow
              color="cyan"
              dense
              label="Description"
              outlined
              v-model="form.description"
            />
            <!-- Footer -->
            <q-input
              autogrow
              color="cyan"
              dense
              label="Footer"
              v-model="form.footer"
              outlined
            />
          </div>
        </div>
        <!-- Invoice items -->
        <div class="gt-xs q-mb-lg text-uppercase text-h6 text-69">
          <div>Invoice items</div>
        </div>
        <!-- Table -->
        <div class="gt-xs q-gutter-y-md">
          <q-markup-table dense flat separator="none">
            <thead>
              <tr>
                <th class="text-left">
                  <div class="text-subtitle2">#</div>
                </th>
                <th class="text-left" style="width:40%; min-width:100px">
                  <div class="text-subtitle2">Description</div>
                </th>
                <th class="text-left" style="min-width:100px">
                  <div class="text-subtitle2">Quantity</div>
                </th>
                <th class="text-right" style="min-width:100px">
                  <div class="text-subtitle2">Unit price</div>
                </th>
                <th class="text-right" style="min-width:100px">
                  <div class="text-subtitle2">Discount</div>
                </th>
                <th></th>
                <th class="text-right" style="min-width:100px">
                  <div class="text-subtitle2">Amount</div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(line, index) in $store.state.invoices.lines">
                <tr :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <!-- Description -->
                    <q-input
                      autogrow
                      color="cyan"
                      dense
                      outlined
                      :value="line.description"
                      @input="
                        $store.commit('invoices/setDescription', {
                          value: $event,
                          index,
                        })
                      "
                    />
                  </td>
                  <td>
                    <!-- Quantity -->
                    <q-input
                      color="cyan"
                      dense
                      min="0"
                      outlined
                      type="number"
                      :value="line.quantity"
                      @input="
                        $store.commit('invoices/setQuantity', {
                          value: $event,
                          index,
                        })
                      "
                    />
                  </td>
                  <td>
                    <!-- Unit amount -->
                    <q-input
                      color="cyan"
                      dense
                      fill-mask="0"
                      input-class="text-right"
                      mask="#.##"
                      outlined
                      prefix="$"
                      reverse-fill-mask
                      :value="line.unit_amount"
                      @input="
                        $store.commit('invoices/setUnitAmount', {
                          value: $event,
                          index,
                        })
                      "
                      unmasked-value
                    />
                  </td>
                  <td>
                    <!-- Discount -->
                    <q-input
                      color="cyan"
                      dense
                      fill-mask="0"
                      input-class="text-right"
                      :mask="line.discount_type === '$' ? '#.##' : '#'"
                      outlined
                      :prefix="line.discount_type === '$' ? '$' : null"
                      reverse-fill-mask
                      :suffix="line.discount_type === '%' ? '%' : null"
                      unmasked-value
                      :value="line.item_discount"
                      @input="
                        $store.commit('invoices/setItemDiscount', {
                          value: $event,
                          index,
                        })
                      "
                    />
                  </td>
                  <!-- Discount type -->
                  <td>
                    <q-btn-dropdown
                      dense
                      flat
                      :label="line.discount_type"
                      text-color="cyan"
                    >
                      <q-list>
                        <q-item
                          :active="line.discount_type === '$'"
                          active-class="text-cyan"
                          clickable
                          v-close-popup
                          @click="discountType(index, '$')"
                        >
                          <q-item-section>
                            <q-item-label>$</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item
                          :active="line.discount_type === '%'"
                          active-class="text-cyan"
                          clickable
                          v-close-popup
                          @click="discountType(index, '%')"
                        >
                          <q-item-section>
                            <q-item-label>%</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                  </td>
                  <td>
                    <!-- Amount -->
                    <q-input
                      borderless
                      dense
                      input-class="text-right text-subtitle1"
                      readonly
                      :value="amount(index)[index]"
                    >
                      <template #prepend>
                        <div class="text-2b text-subtitle1">$</div>
                      </template>
                    </q-input>
                  </td>
                  <td>
                    <!-- Delete item -->
                    <q-btn
                      @click="deleteItem(index, $event)"
                      dense
                      :disable="$store.state.invoices.lines.length === 1"
                      flat
                      icon="delete"
                      text-color="negative"
                    />
                  </td>
                </tr>
                <tr v-if="line.item_discount" :key="`-${index}`">
                  <td colspan="6">
                    <div class="text-2b text-subtitle1 text-right">
                      Item discount
                    </div>
                  </td>
                  <td>
                    <!-- Discount amount -->
                    <q-input
                      borderless
                      dense
                      input-class="text-2b text-subtitle1 text-right"
                      readonly
                      :value="discountAmount(index)"
                    >
                      <template #prepend>
                        <div class="text-2b text-subtitle1">$</div>
                      </template>
                    </q-input>
                  </td>
                  <td></td>
                </tr>
              </template>
              <tr>
                <!-- Add item button -->
                <td colspan="4">
                  <q-btn
                    @click="addItem"
                    color="cyan"
                    dense
                    flat
                    icon="add_circle"
                    label="add item"
                  />
                </td>
                <td colspan="2">
                  <div class="text-2b text-subtitle1 text-right">
                    Subtotal
                  </div>
                </td>
                <td>
                  <!-- Subtotal -->
                  <q-input
                    borderless
                    dense
                    input-class="text-right text-subtitle1"
                    readonly
                    :value="subtotal('decimal')"
                  >
                    <template #prepend>
                      <div class="text-2b text-subtitle1">$</div>
                    </template>
                  </q-input>
                </td>
                <td></td>
              </tr>
              <tr>
                <td colspan="6">
                  <div class="text-subtitle1 text-positive text-right">
                    Total discounts
                  </div>
                </td>
                <td>
                  <!-- Discounts -->
                  <q-input
                    borderless
                    dense
                    input-class="text-positive text-right text-subtitle1"
                    readonly
                    :value="discountTotal('decimal')"
                  >
                    <template #prepend>
                      <div class="text-2b text-positive text-subtitle1">
                        $
                      </div>
                    </template>
                  </q-input>
                </td>
                <td></td>
              </tr>
              <tr>
                <td colspan="6">
                  <div class="text-subtitle1 text-right">Shipping</div>
                </td>
                <td>
                  <!-- Shipping -->
                  <q-input
                    color="cyan"
                    dense
                    fill-mask="0"
                    input-class="text-right text-subtitle1"
                    mask="#.##"
                    reverse-fill-mask
                    unmasked-value
                    v-model="shipping"
                  >
                    <template #prepend>
                      <div class="text-2b text-subtitle1">$</div>
                    </template>
                  </q-input>
                </td>
                <td></td>
              </tr>
              <tr>
                <td colspan="6">
                  <div class="text-2b text-h6 text-right">Total</div>
                </td>
                <td>
                  <!-- Total -->
                  <q-input
                    borderless
                    dense
                    input-class="text-2b text-h6 text-right"
                    readonly
                    :value="total('decimal')"
                  >
                    <template #prepend>
                      <div class="text-2b text-h6">$</div>
                    </template>
                  </q-input>
                </td>
                <td></td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </q-card-section>

      <!-- Items list -->

      <div class="lt-sm">
        <q-list separator>
          <q-item-label header>
            <div class="text-69 text-h6 text-uppercase">
              Invoice items
            </div>
          </q-item-label>
          <q-item-label header>
            <div class="row justify-between">
              <div>{{ this.$store.state.invoices.lines.length }} items</div>
              <div>Amount</div>
            </div>
          </q-item-label>
          <q-separator />
          <q-slide-item
            v-for="(line, index) in $store.state.invoices.lines"
            :key="index"
            left-color="positive"
            right-color="negative"
            @left="editItem(index, $event)"
            @right="deleteItem(index, $event)"
          >
            <template #left>
              <q-icon name="edit" />
            </template>
            <template #right>
              <q-icon name="delete" />
            </template>
            <q-item>
              <q-item-section>
                <q-item-label>
                  {{ line.description || 'No description' }}
                </q-item-label>
                <q-item-label>
                  {{ line.quantity }} &times;
                  {{ formatCurrency(line.unit_amount / 100, 'USD') }}
                  <span v-if="line.item_discount">
                    -
                    {{ formatCurrency(line.item_discount / 100, 'USD') }}
                    Discount
                  </span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-subtitle1">
                  {{ formatCurrency(line.amount / 100, 'USD') }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-slide-item>
          <q-separator />
        </q-list>
        <q-btn
          @click="$router.push({ name: 'add-item' })"
          color="grey-2"
          class="full-width"
          icon="add_circle"
          label="add item"
          text-color="cyan"
          unelevated
        />
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle1">Subtotal</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-subtitle1">
                {{ subtotal('currency') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator inset />
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle1 text-positive">
                Item discounts
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-subtitle1 text-positive">
                {{ discountTotal('currency') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item :to="{ name: 'add-shipping' }" clickable v-ripple>
            <q-item-section>
              <q-item-label class="text-subtitle1 text-cyan">
                Add shipping <q-icon name="add" />
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-subtitle1">
                {{ $store.getters['invoices/getCurrencyFormattedShipping'] }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator inset />
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6">
                Total
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-h6">
                {{ total('currency') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <q-separator />

      <!-- Actions -->
      <q-card-actions align="right" class="gt-sm q-pa-md">
        <q-btn
          @click="$router.back()"
          color="blue-grey"
          icon="close"
          outline
          label="cancel"
        />
        <q-btn @click="save" color="purple" icon="save" label="save draft" />
        <q-btn @click="send" color="cyan" icon="email" label="send" />
      </q-card-actions>
    </q-card>

    <!-- Breadcrumbs -->
    <bread-crumbs :breadcrumbs="breadcrumbs" />
  </q-page>
</template>

<script>
import { date, QSpinner } from 'quasar';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import Alert from 'components/Alert.vue';
import { axiosError } from 'utils/error-handler';
import { formatCurrency } from 'utils/currency';
import { notifySuccess } from 'utils/success-handler';
import BreadCrumbs from 'components/BreadCrumbs.vue';

export default {
  name: 'InvoiceCreateHome',
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
          label: 'Edit',
          link: '',
        },
      ],
      business_info: null,
      date: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      form: {
        customer: '',
        description: '',
        discount: '0',
        due_date: '',
        footer: '',
        shippable: false,
        status: 'draft',
        subtotal: '0',
        total: '0',
      },
      message: '',
      options: [],
      showEditItemDialog: false,
    };
  },
  components: {
    alert: Alert,
    breadCrumbs: BreadCrumbs,
  },
  computed: {
    shipping: {
      get() {
        return this.$store.state.invoices.shipping;
      },
      set(value) {
        this.$store.commit('invoices/setShipping', value);
      },
    },
  },
  methods: {
    amount(index) {
      this.$store.commit('invoices/setAmount', {
        value: (
          this.$store.state.invoices.lines[index].quantity *
          this.$store.state.invoices.lines[index].unit_amount
        ).toString(),
        index,
      });

      return this.$store.state.invoices.lines.map(item => {
        const amount = (item.quantity * item.unit_amount) / 100;

        return new Intl.NumberFormat('en-US', {
          style: 'decimal',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(amount);
      });
    },
    addItem() {
      this.$store.commit('invoices/addItem', {
        amount: '0',
        description: '',
        discount_type: '$',
        item_discount: '',
        quantity: '0',
        unit_amount: '0',
      });
    },
    deleteItem(index, { reset }) {
      if (reset) {
        reset();
      }
      this.$store.commit('invoices/deleteItem', index);
    },
    editItem(index, { reset }) {
      reset();
      this.$store.commit('invoices/setIndex', index);
      this.$router.push({ name: 'edit-item' });
    },
    discountAmount(index) {
      if (
        this.$store.state.invoices.lines[index].item_discount &&
        this.$store.state.invoices.lines[index].discount_type === '$'
      ) {
        return new Intl.NumberFormat('en-US', {
          style: 'decimal',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(
          `-${this.$store.state.invoices.lines[index].item_discount / 100}`
        );
      }

      const percentage =
        (this.$store.state.invoices.lines[index].item_discount / 100) *
        this.$store.state.invoices.lines[index].amount;

      if (this.$store.state.invoices.lines[index].item_discount) {
        return new Intl.NumberFormat('en-US', {
          style: 'decimal',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(`-${percentage / 100}`);
      }

      return null;
    },
    discountTotal(style) {
      let discountTotal = this.$store.state.invoices.lines.reduce(
        (total, item) => {
          let discount;

          if (item.discount_type === '$') {
            discount = item.item_discount;
          } else {
            discount = (item.item_discount / 100) * item.amount;
          }
          return Number(total) + Number(discount);
        },
        0
      );

      this.form.discount = discountTotal.toString();

      discountTotal /= 100;

      const formattedDiscountTotal = new Intl.NumberFormat('en-US', {
        style,
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(discountTotal);

      if (discountTotal === 0) {
        return '―';
      }

      return `-${formattedDiscountTotal}`;
    },
    discountType(index, type) {
      this.$store.commit('invoices/setDiscountType', { value: type, index });
    },
    async fetchBusinessInfo() {
      try {
        const response = await this.$axios.get('/settings', {
          headers: {
            Authorization: `Bearer ${this.$store.state.auth.token}`,
          },
        });

        if (response.status === 200) {
          this.business_info = response.data;
        }
      } catch (error) {
        this.message = axiosError(error);
      }
    },
    fetchCustomers() {
      this.$store.dispatch('customers/asyncUpdateCustomers', {
        pagination: {
          descending: false,
          page: 1,
          rowsPerPage: 0,
          sortBy: 'email',
        },
      });
    },
    async fetchInvoice() {
      try {
        const { status, data } = await this.$axios.get(
          `/invoices/${this.$route.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.auth.token}`,
            },
          }
        );

        if (status === 200) {
          this.form = data;
          this.$store.commit('invoices/setLines', data.lines);
        }
      } catch (error) {
        this.message = axiosError(error);
      }
    },
    filterByEmail(val, update) {
      if (val === '') {
        update(() => {
          this.options = [...this.$store.getters['customers/getBilling']];
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.options = this.$store.getters['customers/getBilling'].filter(
          customer => customer.email.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    formatCurrency,
    formatInternational(phone, country) {
      if (phone && country) {
        return parsePhoneNumberFromString(phone, country).formatInternational();
      }
      return null;
    },
    getBilling() {
      this.options = [...this.$store.getters['customers/getBilling']];
    },
    resetForm() {
      this.$store.commit('invoices/resetLines');
      this.$store.commit('invoices/setShipping', '0');
    },
    async save() {
      this.form.lines = [...this.$store.state.invoices.lines];
      this.form.shipping = this.$store.state.invoices.shipping;

      this.$q.loading.show({
        message: 'Saving draft...',
        spinner: QSpinner,
        sanitize: true,
      });

      try {
        const { data, status } = await this.$axios.post(
          '/invoices',
          this.form,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.auth.token}`,
            },
          }
        );

        if (status === 201) {
          notifySuccess(data.message);
        }

        this.$router.back();
      } catch (error) {
        this.message = axiosError(error);
      } finally {
        this.$q.loading.hide();
      }
    },
    async send() {
      this.form.lines = [...this.$store.state.invoices.lines];
      this.form.shipping = this.$store.state.invoices.shipping;
      this.form.status = 'open';

      this.$q.loading.show({
        message: 'Sending invoice...',
        spinner: QSpinner,
        sanitize: true,
      });

      try {
        const { status } = await this.$axios.post('/invoices', this.form, {
          headers: {
            Authorization: `Bearer ${this.$store.state.auth.token}`,
          },
        });

        if (status === 201) {
          notifySuccess('Sent invoice.');
        }

        this.$router.back();
      } catch (error) {
        this.message = axiosError(error);
      } finally {
        this.$q.loading.hide();
      }
    },
    showBottomSheet() {
      this.$q
        .bottomSheet({
          actions: [
            {
              color: 'secondary',
              label: 'Save Draft',
              icon: 'save',
              id: 'save',
            },
            {
              color: 'primary',
              label: 'Send',
              icon: 'email',
              id: 'send',
            },
          ],
        })
        .onOk(action => {
          switch (action.id) {
            case 'send':
              this.send();
              break;
            default:
              this.save();
          }
        });
    },
    subtotal(style) {
      let subtotal = this.$store.state.invoices.lines.reduce((total, item) => {
        return Number(total) + Number(item.amount);
      }, 0);

      this.form.subtotal = subtotal.toString();

      subtotal /= 100;

      return new Intl.NumberFormat('en-US', {
        style,
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(subtotal);
    },
    total(style) {
      let total =
        Number(this.form.subtotal) -
        Number(this.form.discount) +
        Number(this.$store.state.invoices.shipping);

      this.form.total = total.toString();

      total /= 100;

      return new Intl.NumberFormat('en-US', {
        style,
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(total);
    },
  },
  created() {
    this.$root.$on('showBottomSheet', this.showBottomSheet);
    if (this.$route.name === 'edit-invoice') {
      this.fetchInvoice();
    }
    this.fetchBusinessInfo();
    this.fetchCustomers();
    this.getBilling();
  },
  beforeDestroy() {
    this.$root.$off('showBottomSheet', this.showBottomSheet);
  },
  destroyed() {
    this.resetForm();
  },
};
</script>

<style lang="stylus" scoped>
.container
  max-width 1200px
  margin-left auto
  margin-right auto

.q-table td::before
  background none

.q-table th:first-child, .q-table td:first-child
  padding-left 0px

.q-table th:last-child, .q-table td:last-child
  padding-right 0px
</style>
