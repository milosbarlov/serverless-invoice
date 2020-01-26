<template>
  <q-page
    :class="{
      'bread-crumb-padding': $q.screen.gt.sm,
      flex: true,
      'flex-center': true,
    }"
    :padding="!$q.platform.is.mobile"
  >
    <q-card
      :class="{
        'text-2b': true,
        'full-width': $q.platform.is.mobile || $q.screen.lt.sm,
        'window-height': $q.platform.is.mobile || $q.screen.lt.sm,
        'w-500px': !$q.platform.is.mobile,
      }"
      :flat="$q.platform.is.mobile"
    >
      <q-card-section class="gt-sm">
        <div class="text-h6">Edit details</div>
      </q-card-section>
      <q-separator class="gt-sm" />
      <alert :alert="message ? true : false" :message="message" />
      <q-card-section>
        <div class="q-gutter-y-md">
          <!-- Name -->
          <q-input
            bottom-slots
            color="cyan"
            dense
            :error="$v.form.name.$error"
            error-message="Cannot be blank"
            hint="Required"
            label="Name or company"
            outlined
            v-model.trim="form.name"
          >
            <template #prepend>
              <q-icon name="fas fa-user fa-fw fa-sm" />
            </template>
          </q-input>
          <!-- Description -->
          <q-input
            color="cyan"
            dense
            label="Description"
            outlined
            v-model.trim="form.description"
          >
            <template #prepend>
              <q-icon name="fas fa-id-card fa-fw fa-sm" />
            </template>
          </q-input>
          <!-- Email -->
          <q-input
            bottom-slots
            color="cyan"
            @change="$v.form.email.$touch"
            dense
            :error="$v.form.email.$error"
            error-message="Invalid email"
            hint="Required"
            label="Email"
            outlined
            v-model.trim="form.email"
          >
            <template #prepend>
              <q-icon name="fas fa-envelope fa-fw fa-sm" />
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-gutter-y-md">
          <!-- Billing and shipping details -->
          <q-tabs
            active-color="cyan"
            class="q-pa-none"
            dense
            indicator-color="cyan"
            style="max-width: 250px"
            v-model="tab"
          >
            <q-tab name="billing" label="Billing" />
            <q-tab name="shipping" label="Shipping" />
          </q-tabs>
          <q-tab-panels animated v-model="tab">
            <!-- Billing details -->
            <q-tab-panel class="q-pa-none" name="billing">
              <!-- Country -->
              <q-select
                bottom-slots
                color="cyan"
                dense
                emit-value
                fill-input
                @filter="filterByCountry"
                hide-selected
                id="form-country"
                label="Country"
                map-options
                :options="options"
                outlined
                use-input
                v-model="form.address.country"
              >
                <template #prepend>
                  <q-icon name="fas fa-flag fa-fw fa-sm" />
                </template>
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section avatar>
                      <q-icon
                        :name="`img:${getTwemojiFlag(scope.opt.value)}`"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        {{ scope.opt.label }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>
                        {{ scope.opt.callingCode }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <!-- Billing address -->
              <!-- line 1 -->
              <q-input
                bottom-slots
                color="cyan"
                dense
                :error="$v.form.address.line1.$error"
                error-message="Cannot be blank"
                label="Address Line 1"
                outlined
                placeholder="(Street address/PO Box/Company name)"
                ref="address"
                v-model.trim="form.address.line1"
              />
              <!-- line 2 -->
              <q-input
                bottom-slots
                color="cyan"
                dense
                label="Address Line 2"
                outlined
                placeholder="(Apartment/Suite/Unit/Building)"
                v-model.trim="form.address.line2"
              />
              <!-- City -->
              <q-input
                bottom-slots
                color="cyan"
                dense
                label="City/District/Suburb/Town/Village"
                outlined
                v-model.trim="form.address.city"
              />
              <!-- State -->
              <q-input
                bottom-slots
                color="cyan"
                dense
                label="State/County/Province/Region"
                outlined
                v-model.trim="form.address.state"
              />
              <!-- Postal code -->
              <q-input
                bottom-slots
                color="cyan"
                dense
                label="Zip or Postal Code"
                outlined
                v-model.trim="form.address.postal_code"
              />
              <!-- Phone number -->
              <q-input
                bottom-slots
                @change="$v.form.phone.$touch"
                color="cyan"
                dense
                :error="$v.form.phone.$error"
                error-message="Invalid phone number"
                label="Phone number"
                outlined
                :prefix="phoneNumberPrefix"
                v-model="phoneNumber"
              >
                <template #prepend>
                  <q-icon name="fas fa-phone fa-fw fa-sm" />
                </template>
              </q-input>
            </q-tab-panel>
            <!-- Shipping details -->
            <q-tab-panel class="q-pa-none" name="shipping">
              <!-- Shipping name -->
              <q-input
                bottom-slots
                color="cyan"
                dense
                label="Name"
                outlined
                v-model.trim="form.shipping.name"
              >
                <template #prepend>
                  <q-icon name="fas fa-user fa-fw fa-sm" />
                </template>
              </q-input>
              <!-- Country -->
              <q-select
                bottom-slots
                color="cyan"
                dense
                emit-value
                fill-input
                hide-selected
                @filter="filterByCountry"
                id="form-country"
                label="Country"
                map-options
                :options="options"
                outlined
                use-input
                v-model="form.shipping.address.country"
              >
                <template #prepend>
                  <q-icon name="fas fa-flag fa-fw fa-sm" />
                </template>
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section avatar>
                      <div id="flag" v-html="flag(scope.opt.value)"></div>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        {{ scope.opt.label }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>
                        {{ scope.opt.callingCode }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <!-- Shipping adress -->
              <!-- line 1 -->
              <q-input
                bottom-slots
                color="cyan"
                dense
                :error="$v.form.shipping.address.line1.$error"
                error-message="Cannot be blank"
                label="Address Line 1"
                outlined
                placeholder="(Street address/PO Box/Company name)"
                v-model.trim="form.shipping.address.line1"
              />
              <!-- line 2 -->
              <q-input
                bottom-slots
                color="cyan"
                dense
                label="Address Line 2"
                outlined
                placeholder="(Apartment/Suite/Unit/Building)"
                v-model.trim="form.shipping.address.line2"
              />
              <!-- City -->
              <q-input
                bottom-slots
                color="cyan"
                dense
                label="City/District/Suburb/Town/Village"
                outlined
                v-model.trim="form.shipping.address.city"
              />
              <!-- State -->
              <q-input
                bottom-slots
                color="cyan"
                dense
                label="State/County/Province/Region"
                outlined
                v-model.trim="form.shipping.address.state"
              />
              <!-- Postal code -->
              <q-input
                bottom-slots
                color="cyan"
                dense
                label="Zip or Postal Code"
                outlined
                v-model.trim="form.shipping.address.postal_code"
              />
              <!-- Shipping phone number -->
              <q-input
                bottom-slots
                @change="$v.form.shipping.phone.$touch"
                color="cyan"
                dense
                :error="$v.form.shipping.phone.$error"
                error-message="Invalid phone number"
                label="Phone number"
                outlined
                :prefix="shippingPhoneNumberPrefix"
                v-model="shippingPhoneNumber"
              >
                <template #prepend>
                  <q-icon name="fas fa-phone fa-fw fa-sm" />
                </template>
              </q-input>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-gutter-y-md">
          <!-- Invoice prefix -->
          <q-input
            color="cyan"
            dense
            outlined
            v-model="form.invoice_prefix"
            @change="$v.form.invoice_prefix.$touch"
            label="Invoice prefix"
            mask="XXXXXXXXXXXX"
            placeholder="Must be 3–12 letters or numbers"
            :error="$v.form.invoice_prefix.$error"
            error-message="Minimum 3 characters long"
            bottom-slots
          >
            <template #prepend>
              <q-icon name="fas fa-file-invoice fa-fw fa-sm" />
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="gt-sm q-pa-md">
        <div class="q-gutter-sm">
          <q-btn
            outline
            label="Cancel"
            color="cyan"
            icon="close"
            @click="$router.back()"
          />
          <q-btn
            label="save"
            color="cyan"
            icon="save"
            @click="updateCustomer"
          />
        </div>
      </q-card-actions>
    </q-card>

    <!-- Breadcrumbs -->
    <bread-crumbs :breadcrumbs="breadcrumbs" />
  </q-page>
</template>

<script>
import _ from 'lodash';
import { QSpinner } from 'quasar';
import {
  required,
  requiredIf,
  email,
  minLength,
  maxLength,
} from 'vuelidate/lib/validators';
import {
  AsYouType,
  parsePhoneNumberFromString,
  getCountryCallingCode,
} from 'libphonenumber-js';
import { axiosError } from 'utils/error-handler';
import { notifySuccess } from 'utils/success-handler';
import {
  getCountriesAndCallingCodes,
  getTwemojiFlag,
  noCountryCallingCode,
} from 'utils/country';
import Alert from 'components/Alert.vue';
import BreadCrumbs from 'components/BreadCrumbs.vue';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('customers');

export default {
  name: 'CustomerEditDetails',
  data() {
    return {
      breadcrumbs: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Customers',
          link: '/customers',
        },
        {
          label: 'Edit details',
          linkl: '',
        },
      ],
      countryOptions: [],
      options: [],
      form: {
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          postal_code: '',
          country: '',
        },
        description: '',
        email: '',
        invoice_prefix: '',
        name: '',
        phone: '',
        shipping: {
          address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
          },
          phone: '',
          name: '',
        },
      },
      message: '',
      tab: 'billing',
    };
  },
  validations: {
    form: {
      address: {
        line1: {
          required: requiredIf(value => {
            const fields = [
              value.line2,
              value.city,
              value.state,
              value.postal_code,
            ];
            return fields.some(val => val.length > 0);
          }),
        },
      },
      email: {
        required,
        email,
      },
      invoice_prefix: {
        minLength: minLength(3),
        maxLength: maxLength(12),
      },
      name: {
        required,
      },
      phone: {
        isValidPhone(number) {
          if (number.length > 0) {
            const phoneNumber = parsePhoneNumberFromString(
              number,
              this.form.shipping.address.country
            );
            if (phoneNumber) {
              return phoneNumber.isValid();
            }
          }
          return true;
        },
      },
      shipping: {
        address: {
          line1: {
            required: requiredIf(value => {
              const fields = [
                value.line2,
                value.city,
                value.state,
                value.postal_code,
              ];
              return fields.some(val => val.length > 0);
            }),
          },
        },
        phone: {
          isValidPhone(number) {
            if (number.length > 0) {
              const phoneNumber = parsePhoneNumberFromString(
                number,
                this.form.shipping.address.country
              );
              if (phoneNumber) {
                return phoneNumber.isValid();
              }
            }
            return true;
          },
        },
      },
    },
  },
  components: {
    alert: Alert,
    breadCrumbs: BreadCrumbs,
  },
  computed: {
    phoneNumber: {
      get() {
        return this.form.phone;
      },
      set(value) {
        this.form.phone = new AsYouType(this.form.address.country).input(value);
      },
    },
    phoneNumberPrefix() {
      if (this.form.address.country) {
        if (noCountryCallingCode.includes(this.form.address.country)) {
          return '';
        }
        return `+${getCountryCallingCode(this.form.address.country)}`;
      }
      return undefined;
    },
    shippingPhoneNumber: {
      get() {
        return this.form.shipping.phone;
      },
      set(value) {
        this.form.shipping.phone = new AsYouType(
          this.form.shipping.address.country
        ).input(value);
      },
    },
    shippingPhoneNumberPrefix() {
      if (this.form.shipping.address.country) {
        if (noCountryCallingCode.includes(this.form.shipping.address.country)) {
          return '';
        }
        return `+${getCountryCallingCode(this.form.shipping.address.country)}`;
      }
      return undefined;
    },
  },
  methods: {
    ...mapActions(['asyncUpdateCustomer']),
    filterByCountry(value, update) {
      if (value === '') {
        update(() => {
          this.options = [...this.countryOptions];
        });
        return;
      }

      update(() => {
        const needle = value.toLowerCase();
        this.options = [...this.countryOptions].filter(
          country => country.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    getCustomerDataInfo() {
      const data = _.cloneDeep(this.$store.state.customers.customerData.info);

      Object.keys(this.form).forEach(key => {
        this.form[key] = data[key];
      });

      this.form.phone = parsePhoneNumberFromString(
        this.form.phone,
        this.form.address.country
      ).formatNational();

      this.form.shipping.phone = parsePhoneNumberFromString(
        this.form.shipping.phone,
        this.form.shipping.address.country
      ).formatNational();
    },
    getTwemojiFlag,
    async updateCustomer() {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        this.message = 'Please check the errors below.';
        return;
      }

      this.$q.loading.show({
        message: 'Updating customer...',
        spinner: QSpinner,
        sanitize: true,
      });

      try {
        const response = await this.$axios.put(
          `/customers/${this.$route.params.id}`,
          this.form,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.auth.token}`,
            },
          }
        );

        if (response.status === 200) {
          notifySuccess('Updated customer.');
          this.$router.push(`/customers/${this.$route.params.id}`, () => {
            this.asyncUpdateCustomer({
              id: this.$route.params.id,
            });
          });
        }
      } catch (error) {
        console.error(error);
        this.message = axiosError(error);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
  created() {
    this.$root.$on('submit', this.updateCustomer);
    this.getCustomerDataInfo();
    this.countryOptions = getCountriesAndCallingCodes();
  },
  beforeDestroy() {
    this.$root.$off('submit', this.updateCustomer);
  },
};
</script>

<style lang="stylus" scoped>
.w-500px
  width 500px
</style>
