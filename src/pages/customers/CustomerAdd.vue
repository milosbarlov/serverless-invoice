<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card style="width: 500px; max-width: 100vw; min-width: 300px">
        <q-card-section>
          <div class="text-h6">Add a Customer</div>
        </q-card-section>
        <q-separator />
        <q-banner inline-actions v-if="alert" class="text-white bg-red">
          <template v-slot:avatar>
            <q-icon name="warning" color="white" />
          </template>
          {{ alertMsg }}
          <template v-slot:action>
            <q-btn flat color="white" label="dismiss" @click="alert = false" />
          </template>
        </q-banner>
        <q-card-section class="row justify-center">
          <div class="q-gutter-md" style="width: 500px; max-width: 90vw;">
            <div class="text-h6 text-grey-14 text-weight-regular">Info</div>
            <q-input
              autofocus
              outlined
              bottom-slots
              hint="(Required)"
              v-model.trim="form.customer_description"
              label="Description"
              placeholder="Name or Company"
              :error="$v.form.customer_description.$error"
              error-message="Cannot be blank"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-id-card fa-fw" />
              </template>
            </q-input>
            <q-input
              outlined
              bottom-slots
              hint="(Required)"
              v-model="form.email"
              label="Email"
              :error="$v.form.email.$error"
              error-message="Invalid email"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-envelope fa-fw" />
              </template>
            </q-input>
            <div class="text-h6 text-grey-14 text-weight-regular">
              Billing / Shipping
            </div>
            <q-select
              filled
              use-input
              bottom-slots
              @filter="filterCountry"
              id="form-country"
              label="Country"
              :options="options"
              v-model="country"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-globe fa-fw" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
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
            <q-input
              outlined
              bottom-slots
              :value="form.shipping.phone"
              @input="mask"
              :prefix="prefix"
              label="Phone"
              :error="$v.form.shipping.phone.$error"
              error-message="Invalid phone number"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-phone fa-fw" />
              </template>
            </q-input>
            <q-input
              outlined
              bottom-slots
              v-model.trim="form.shipping.name"
              label="Name"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-id-card-alt fa-fw" />
              </template>
            </q-input>
            <div class="text-subtitle text-grey-14 text-weight-medium">
              Address
            </div>
            <q-input
              outlined
              bottom-slots
              id="form-address"
              v-model.trim="form.shipping.address.line1"
              label="Address Line 1"
              hint="(Street address/PO Box/Company name)"
              :error="$v.form.shipping.address.line1.$error"
              error-message="Cannot be blank"
            />
            <q-input
              outlined
              bottom-slots
              v-model.trim="form.shipping.address.line2"
              label="Address Line 2"
              hint="(Apartment/Suite/Unit/Building)"
            />
            <q-input
              outlined
              bottom-slots
              v-model.trim="form.shipping.address.city"
              label="City/District/Suburb/Town/Village"
            />
            <q-input
              outlined
              bottom-slots
              v-model.trim="form.shipping.address.state"
              label="State/County/Province/Region"
            />
            <q-input
              outlined
              bottom-slots
              v-model.trim="form.shipping.address.postal_code"
              label="Zip or Postal Code"
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            outline
            label="Cancel"
            color="primary"
            @click="$router.back()"
          />
          <q-btn @click="addCustomer" label="Add Customer" color="primary" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import {
  getCountryCallingCode,
  AsYouType,
  isValidNumber,
} from 'libphonenumber-js';
import places from 'places.js';
import { QSpinner } from 'quasar';
import { required, requiredIf, email } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import customerMixin from 'mixins/customer';
import { formErrorHandler } from 'mixins/form-error-handler';

export default {
  name: 'CustomerAdd',
  mixins: [customerMixin, formErrorHandler],
  data() {
    return {
      alert: false,
      alertMsg: '',
      country: { label: 'United States', value: 'US', callingCode: '+1' },
      options: this.stringOptions,
      omitCountries: ['AQ', 'BV', 'TF', 'HM', 'PN', 'GS', 'UM'],
      form: {
        customer_description: '',
        email: '',
        shipping: {
          address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'US',
          },
          phone: '',
          name: '',
        },
      },
    };
  },
  validations: {
    form: {
      customer_description: {
        required,
      },
      email: {
        required,
        email,
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
  methods: {
    ...mapActions('customers', ['asyncUpdateCustomers']),
    filterCountry(val, update) {
      if (val === '') {
        update(() => {
          this.options = this.stringOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = this.stringOptions.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async addCustomer() {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        this.formError('Please correct the errors below.');
        return;
      }

      this.$q.loading.show({
        message: 'Adding customer...',
        spinner: QSpinner,
      });

      try {
        const response = await this.$axios.post('/customers', this.form);

        if (response.status === 201) {
          this.$notifySuccess('Added customer.');
          this.$router.push('/customers', () => {
            this.asyncUpdateCustomers({
              pagination: this.getServerPagination,
              filter: this.getFilter,
            });
          });
        }
      } catch (error) {
        console.error(error);
        this.$errorHandler(error);
      } finally {
        this.$q.loading.hide();
      }
    },
    mask(event) {
      this.form.shipping.phone = new AsYouType(
        this.form.shipping.address.country
      ).input(event);
    },
    autocompleteForm() {
      const placesAutocomplete = places({
        container: this.$el.querySelector('#form-address'),
        type: 'address',
        templates: {
          value(suggestion) {
            return suggestion.name;
          },
        },
        appId: 'pl1VKUSAYNZY',
        apiKey: '0cf5fc5864b9d6f98475d33d63b99be8',
      });
      placesAutocomplete.on('change', e => {
        this.form.shipping.address.line1 = e.suggestion.name || '';
        this.form.shipping.address.city = e.suggestion.city || '';
        this.form.shipping.address.state = e.suggestion.administrative || '';
        this.form.shipping.address.postal_code = e.suggestion.postcode || '';
        this.form.shipping.address.country =
          e.suggestion.countryCode.toUpperCase() || '';
      });
      this.$el.querySelector('.ap-icon-clear').addEventListener('click', () => {
        this.form.shipping.address.line1 = '';
      });
    },
  },
  computed: {
    prefix() {
      if (this.omitCountries.includes(this.form.shipping.address.country)) {
        return '';
      }
      return `+${getCountryCallingCode(this.form.shipping.address.country)}`;
    },
  },
  watch: {
    country() {
      this.form.shipping.address.country = this.country.value;
    },
  },
  created() {
    this.getCountries();
  },
  mounted() {
    this.autocompleteForm();
  },
};
</script>

<style lang="stylus" scoped>
#flag >>> img.emoji
  height 2em
  width 2em
  margin 0 1em 0 0.1em
  vertical-align -0.1em

.q-input >>> .fas, .q-select >>> .fas
  font-size 1.33rem !important
</style>
