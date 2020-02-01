<template>
  <q-page
    :class="{ 'bread-crumb-padding': $q.screen.gt.sm }"
    :padding="!$q.platform.is.mobile"
  >
    <div class="flex flex-center">
      <q-card
        :class="{
          'text-2b': true,
          'full-width': $q.platform.is.mobile,
          'w-500px': !$q.platform.is.mobile,
        }"
        :flat="$q.platform.is.mobile"
      >
        <q-card-section class="gt-sm">
          <div class="text-h6">New customer</div>
        </q-card-section>
        <q-separator class="gt-sm" />
        <alert :alert="message ? true : false" :message="message" />
        <q-card-section>
          <div class="q-gutter-md">
            <!-- Name -->
            <q-input
              autofocus
              bottom-slots
              @change="$v.form.name.$touch"
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
              bottom-slots
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
              @change="$v.form.email.$touch"
              color="cyan"
              dense
              :error="$v.form.email.$error"
              error-message="Invalid email"
              hint="Required"
              label="Email"
              outlined
              v-model="form.email"
            >
              <template #prepend>
                <q-icon name="fas fa-envelope fa-fw fa-sm" />
              </template>
            </q-input>
            <!-- Billing details -->
            <div class="text-bold">
              Billing details
            </div>
            <!-- Country -->
            <q-select
              bottom-slots
              color="cyan"
              dense
              emit-value
              fill-input
              @filter="filterByCountry"
              hide-selected
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
                    <q-icon :name="`img:${getTwemojiFlag(scope.opt.value)}`" />
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
            <!-- Shipping details -->
            <div class="text-bold">
              Shipping details
            </div>
            <!-- Same as billing details-->
            <q-checkbox
              color="cyan"
              @input="copyBillingDetails"
              label="Same as billing details"
              v-model="sameAsBilling"
            />
            <!-- Shipping name -->
            <q-input
              bottom-slots
              color="cyan"
              dense
              label="Name"
              outlined
              :readonly="sameAsBilling"
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
              label="Country"
              map-options
              :options="options"
              outlined
              :readonly="sameAsBilling"
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
                    <q-icon :name="`img:${getTwemojiFlag(scope.opt.value)}`" />
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
              :readonly="sameAsBilling"
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
              :readonly="sameAsBilling"
              v-model.trim="form.shipping.address.line2"
            />
            <!-- City -->
            <q-input
              bottom-slots
              color="cyan"
              dense
              label="City/District/Suburb/Town/Village"
              outlined
              :readonly="sameAsBilling"
              v-model.trim="form.shipping.address.city"
            />
            <!-- State -->
            <q-input
              bottom-slots
              color="cyan"
              dense
              label="State/County/Province/Region"
              outlined
              :readonly="sameAsBilling"
              v-model.trim="form.shipping.address.state"
            />
            <!-- Postal code -->
            <q-input
              bottom-slots
              color="cyan"
              dense
              label="Zip or Postal Code"
              outlined
              :readonly="sameAsBilling"
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
              :readonly="sameAsBilling"
              v-model="shippingPhoneNumber"
            >
              <template #prepend>
                <q-icon name="fas fa-phone fa-fw fa-sm" />
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-separator class="gt-sm" />
        <q-card-actions align="right" class="gt-sm q-pa-md">
          <q-btn outline label="Cancel" color="cyan" @click="$router.back()" />
          <q-btn @click="createCustomer" color="cyan" label="Create Customer" />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Breadcrumbs -->
    <bread-crumbs :breadcrumbs="breadcrumbs" />
  </q-page>
</template>

<script>
import {
  getCountryCallingCode,
  AsYouType,
  isValidNumber,
} from 'libphonenumber-js';
import { QSpinner } from 'quasar';
import { required, requiredIf, email } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import { axiosError } from 'utils/error-handler';
import { notifySuccess } from 'utils/success-handler';
import {
  getCountriesAndCallingCodes,
  getTwemojiFlag,
  noCountryCallingCode,
} from 'utils/country';
import Alert from 'components/Alert.vue';
import BreadCrumbs from 'components/BreadCrumbs.vue';

export default {
  name: 'CustomerAdd',
  data() {
    return {
      breadcrumbs: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Customers',
          link: '/customerss',
        },
        {
          label: 'New customer',
          link: '',
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
          name: '',
          phone: '',
        },
      },
      message: '',
      sameAsBilling: false,
    };
  },
  validations: {
    form: {
      address: {
        line1: {
          required: requiredIf(address => {
            const fields = [
              address.line2,
              address.city,
              address.state,
              address.postal_code,
            ];
            return fields.some(val => val.length > 0);
          }),
        },
      },
      email: {
        required,
        email,
      },
      name: {
        required,
      },
      phone: {
        isValidPhone(value) {
          if (value.length > 0) {
            return isValidNumber(value, this.form.address.country);
          }
          return true;
        },
      },
      shipping: {
        address: {
          line1: {
            required: requiredIf(address => {
              const fields = [
                address.line2,
                address.city,
                address.state,
                address.postal_code,
              ];
              return fields.some(val => val.length > 0);
            }),
          },
        },
        phone: {
          isValidPhone(value) {
            if (value.length > 0) {
              return isValidNumber(value, this.form.shipping.address.country);
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
        if (this.sameAsBilling) {
          this.form.shipping.phone = new AsYouType(
            this.form.shipping.address.country
          ).input(value);
        }
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
        this.form.phone = new AsYouType(
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
    ...mapActions('customers', ['asyncUpdateCustomers']),
    copyBillingDetails(value) {
      if (value) {
        this.form.shipping.address = { ...this.form.address };
        this.form.shipping.name = this.form.name;
        this.form.shipping.phone = this.form.phone;
      }
    },
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
    getTwemojiFlag,
    async createCustomer() {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        this.message = 'Please check the errors below.';
        return;
      }

      this.$q.loading.show({
        message: 'Creating customer...',
        spinner: QSpinner,
        sanitize: true,
      });

      try {
        const response = await this.$axios.post('/customers', this.form, {
          headers: {
            Authorization: `Bearer ${this.$store.state.auth.token}`,
          },
        });

        if (response.status === 201) {
          notifySuccess('Created customer.');
          this.$router.push('/customers', () => {
            this.asyncUpdateCustomers({
              pagination: this.$store.state.customers.pagination,
              filter: this.$store.state.customers.filter,
            });
          });
        }
      } catch (error) {
        this.message = axiosError(error);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
  watch: {
    'form.address': {
      handler(val) {
        if (this.sameAsBilling) {
          this.form.shipping.address = { ...val };
        }
      },
      deep: true,
    },
    'form.name': {
      handler(val) {
        if (this.sameAsBilling) {
          this.form.shipping.name = val;
        }
      },
    },
  },
  created() {
    this.$root.$on('submit', this.createCustomer);
    this.countryOptions = getCountriesAndCallingCodes();
  },
  beforeDestroy() {
    this.$root.$off('submit', this.createCustomer);
  },
};
</script>

<style lang="stylus" scoped>
.w-500px
  width 500px
</style>
