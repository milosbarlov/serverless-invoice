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
        <div class="text-h6">Settings</div>
      </q-card-section>
      <q-separator class="gt-sm" />
      <alert :alert="message ? true : false" :message="message" />
      <q-card-section>
        <div class="q-gutter-md">
          <!-- Business name -->
          <q-input
            color="cyan"
            dense
            label="Business name"
            v-model.trim="form.name"
          >
            <template #prepend>
              <q-icon name="fas fa-building fa-fw fa-sm" />
            </template>
          </q-input>
          <div class="text-bold">Address</div>
          <q-input
            color="cyan"
            dense
            label="Line 1"
            v-model.trim="form.address.line1"
          />
          <q-input
            color="cyan"
            dense
            label="Line 2"
            v-model.trim="form.address.line2"
          />
          <q-input
            color="cyan"
            dense
            label="City"
            v-model.trim="form.address.city"
          />
          <q-input
            color="cyan"
            dense
            label="State"
            v-model.trim="form.address.state"
          />
          <q-input
            color="cyan"
            dense
            label="Postal code"
            v-model.trim="form.address.postal_code"
          />
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
          <!-- Email -->
          <q-input
            bottom-slots
            @change="$v.form.email.$touch"
            color="cyan"
            dense
            :error="$v.form.email.$error"
            error-message="Invalid email"
            label="Email"
            v-model="form.email"
          >
            <template #prepend>
              <q-icon name="fas fa-envelope fa-fw fa-sm" />
            </template>
          </q-input>
          <!-- Phone number -->
          <q-input
            bottom-slots
            @change="$v.form.phone.$touch"
            color="cyan"
            dense
            :error="$v.form.phone.$error"
            error-message="Invalid phone number"
            label="Phone"
            :prefix="phoneNumberPrefix"
            v-model="phoneNumber"
          >
            <template #prepend>
              <q-icon name="fas fa-phone fa-fw fa-sm" />
            </template>
          </q-input>
          <!-- Website -->
          <q-input
            bottom-slots
            @change="$v.form.website.$touch"
            color="cyan"
            dense
            :error="$v.form.website.$error"
            error-message="Invalid URL"
            label="Website"
            v-model="form.website"
          >
            <template #prepend>
              <q-icon name="fas fa-globe fa-fw fa-sm" />
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-separator class="gt-sm" />
      <q-card-actions align="right" class="gt-sm q-pa-md">
        <q-btn
          @click="$router.back()"
          color="cyan"
          icon="close"
          outline
          label="cancel"
        />
        <q-btn @click="save" color="cyan" icon="save" label="save" />
      </q-card-actions>
    </q-card>

    <!-- Breadcrumbs -->
    <bread-crumbs :breadcrumbs="breadcrumbs" />
  </q-page>
</template>

<script>
import {
  AsYouType,
  getCountryCallingCode,
  isValidNumber,
} from 'libphonenumber-js';
import { email } from 'vuelidate/lib/validators';
import validator from 'validator';
import {
  getCountriesAndCallingCodes,
  getTwemojiFlag,
  noCountryCallingCode,
} from 'utils/country';
import { QSpinner } from 'quasar';
import { axiosError } from 'utils/error-handler';
import { notifySuccess } from 'utils/success-handler';
import Alert from 'components/Alert.vue';
import BreadCrumbs from 'components/BreadCrumbs.vue';

export default {
  name: 'Settings',
  data() {
    return {
      breadcrumbs: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Settings',
          link: '',
        },
      ],
      countryOptions: [],
      form: {
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          postal_code: '',
          country: '',
        },
        email: '',
        name: '',
        phone: '',
        website: '',
      },
      message: '',
      options: [],
    };
  },
  validations: {
    form: {
      email: {
        email,
      },
      phone: {
        isValidPhone(value) {
          if (value.length > 0) {
            return isValidNumber(value, this.form.address.country);
          }
          return true;
        },
      },
      website: {
        isURL(value) {
          if (value.length > 0) {
            return validator.isURL(value);
          }
          return true;
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
  },
  methods: {
    async fetchSettings() {
      try {
        const response = await this.$axios.get('/settings', {
          headers: {
            Authorization: `Bearer ${this.$store.state.auth.token}`,
          },
        });

        if (response.status === 200) {
          this.form = response.data;
        }
      } catch (error) {
        console.error(error);
        this.message = axiosError(error);
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
    async save() {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        this.message = 'Please check the errors below.';
        return;
      }

      this.$q.loading.show({
        message: 'Updating settings...',
        spinner: QSpinner,
        sanitize: true,
      });

      try {
        const response = await this.$axios.put('/settings', this.form, {
          headers: {
            Authorization: `Bearer ${this.$store.state.auth.token}`,
          },
        });

        if (response.status === 200) {
          notifySuccess('Updated settings.');
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
    this.countryOptions = getCountriesAndCallingCodes();
    this.fetchSettings();
  },
};
</script>

<style lang="stylus" scoped>
.w-500px
  width 500px
</style>
