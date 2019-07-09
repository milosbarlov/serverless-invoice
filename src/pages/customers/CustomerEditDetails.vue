<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card style="width: 800px; max-width: 100vw;">
        <q-card-section>
          <div class="text-h6">Edit customer details</div>
        </q-card-section>
        <q-separator />
        <alert :alert.sync="alert" :message="alertMsg" />
        <q-card-section>
          <div class="row q-col-gutter-lg">
            <div class="col-xs-12 col-md-6 q-gutter-y-md">
              <div class="text-subtitle1 text-primary">
                Account information
              </div>
              <!-- Description -->
              <q-input
                autofocus
                outlined
                v-model.trim="form.description"
                label="Description"
                placeholder="Name or company"
                :error="$v.form.description.$error"
                error-message="Cannot be blank"
                bottom-slots
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-id-card" />
                </template>
              </q-input>
              <!-- Email -->
              <q-input
                outlined
                :value="form.email"
                @input="form.email = $event"
                @blur="$v.form.email.$touch"
                label="Email"
                :error="$v.form.email.$error"
                error-message="Invalid email"
                bottom-slots
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-envelope" />
                </template>
              </q-input>
              <div class="text-subtitle1 text-primary">
                Billing / Shipping information
              </div>
              <!-- Shipping name -->
              <q-input
                outlined
                v-model.trim="form.shipping.name"
                label="Name"
                bottom-slots
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-id-card-alt fa-fw" />
                </template>
              </q-input>
              <!-- Invoice prefix -->
              <q-input
                outlined
                :value="form.invoice_prefix"
                @input="form.invoice_prefix = $event"
                @blur="$v.form.invoice_prefix.$touch"
                label="Invoice prefix"
                mask="XXXXXXXXXXXX"
                placeholder="Must be 3–12 letters or numbers"
                :error="$v.form.invoice_prefix.$error"
                error-message="Minimum 3 characters long"
                bottom-slots
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-file-invoice fa-fw" />
                </template>
              </q-input>
              <!-- Country -->
              <q-select
                filled
                use-input
                label="Country"
                :options="options"
                v-model="country"
                @filter="filterCountry"
                bottom-slots
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
              <!-- Shipping phone number -->
              <q-input
                outlined
                :value="form.shipping.phone"
                @input="mask"
                label="Phone"
                :prefix="prefix"
                :error="$v.form.shipping.phone.$error"
                error-message="Invalid phone number"
                bottom-slots
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-phone" />
                </template>
              </q-input>
            </div>
            <div class="col-xs-12 col-md-6 q-gutter-y-md">
              <div class="text-subtitle1 text-primary">Address</div>
              <!-- Address line 1 -->
              <q-input
                outlined
                id="form-address"
                v-model="form.shipping.address.line1"
                label="Address Line 1"
                placeholder="(Street address/PO Box/Company name)"
                :error="$v.form.shipping.address.line1.$error"
                error-message="Cannot be blank"
                bottom-slots
              />
              <!-- Address line 2 -->
              <q-input
                outlined
                v-model.trim="form.shipping.address.line2"
                label="Address Line 2"
                placeholder="(Apartment/Suite/Unit/Building)"
                bottom-slots
              />
              <!-- City -->
              <q-input
                outlined
                v-model.trim="form.shipping.address.city"
                label="City/District/Suburb/Town/Village"
                bottom-slots
              />
              <!-- State -->
              <q-input
                outlined
                v-model.trim="form.shipping.address.state"
                label="State/County/Province/Region"
                bottom-slots
              />
              <!-- Zip code -->
              <q-input
                outlined
                v-model.trim="form.shipping.address.postal_code"
                label="Zip or Postal Code"
                bottom-slots
              />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <div class="q-gutter-sm">
            <q-btn
              outline
              label="Cancel"
              color="primary"
              @click="$router.back()"
            />
            <q-btn label="Submit" color="primary" @click="updateCustomer" />
          </div>
        </q-card-actions>
      </q-card>
    </div>
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
import customerMixin from 'mixins/customer';
import { formErrorHandler } from 'mixins/form-error-handler';
import Alert from 'components/Alert.vue';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('customers');

export default {
  name: 'CustomerEditDetails',
  mixins: [customerMixin, formErrorHandler],
  data() {
    return {
      alert: false,
      alertMsg: '',
      country: { label: 'United States', value: 'US', callingCode: '+1' },
      options: [],
      form: {
        description: '',
        email: '',
        invoice_prefix: '',
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
      omitCountries: ['AQ', 'BV', 'TF', 'HM', 'PN', 'GS', 'UM'],
    };
  },
  validations: {
    form: {
      description: {
        required,
      },
      email: {
        required,
        email,
      },
      invoice_prefix: {
        minLength: minLength(3),
        maxLength: maxLength(12),
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
          isValidPhone: (number, vm) => {
            if (number.length > 0) {
              const phoneNumber = parsePhoneNumberFromString(
                number,
                vm.address.country
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
  },
  computed: {
    prefix() {
      if (this.omitCountries.includes(this.form.shipping.address.country)) {
        return '';
      }
      return `+${getCountryCallingCode(this.form.shipping.address.country)}`;
    },
  },
  methods: {
    ...mapActions(['asyncUpdateCustomer']),
    mask(event) {
      this.form.shipping.phone = new AsYouType(
        this.form.shipping.address.country
      ).input(event);
    },
    getCustomerDataInfo() {
      const data = _.cloneDeep(this.$store.state.customers.customerData.info);

      this.form = _.pick(data, [
        'description',
        'email',
        'invoice_prefix',
        'shipping',
      ]);

      const phoneNumber = parsePhoneNumberFromString(
        this.form.shipping.phone,
        this.form.shipping.address.country
      );

      this.form.shipping.phone = phoneNumber.formatNational();
    },
    async updateCustomer() {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        this.formError('Please correct the errors below.');
        return;
      }

      this.$q.loading.show({
        message: 'Updating customer...',
        spinner: QSpinner,
      });

      try {
        const response = await this.$axios.put(
          `/customers/${this.$route.params.id}`,
          this.form
        );

        if (response.status === 200) {
          this.$notifySuccess('Updated customer.');
          this.$router.push(`/customers/${this.$route.params.id}`, () => {
            this.asyncUpdateCustomer({
              id: this.$route.params.id,
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
  },
  watch: {
    country() {
      this.form.shipping.address.country = this.country.value;
    },
  },
  created() {
    this.getCustomerDataInfo();
    this.getCountriesAndCallingCodes();
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
