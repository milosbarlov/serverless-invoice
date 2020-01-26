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
        <div class="text-h6">Edit card</div>
      </q-card-section>
      <q-separator class="gt-sm" />
      <alert :alert="message ? true : false" :message="message" />
      <q-card-section>
        <div class="q-gutter-y-md">
          <div class="row q-col-gutter-md">
            <div class="col-xs-12 col-md-6">
              <!-- Cardholder's name -->
              <q-input
                autofocus
                dense
                label="Cardholder's name"
                outlined
                v-model.trim="form.name"
              />
            </div>
            <div class="col-xs-12 col-md-6">
              <!-- Exp date -->
              <q-input
                dense
                @change="$v.exp_date.$touch"
                :error="$v.exp_date.$error"
                error-message="Invalid date"
                label="Expiration date"
                mask="##/##"
                outlined
                placeholder="MM/YY"
                v-model="exp_date"
              />
            </div>
          </div>
          <!-- Address line 1 -->
          <q-input
            dense
            label="Address Line 1"
            outlined
            v-model.trim="form.address_line1"
          />
          <!-- Address line 2 -->
          <q-input
            dense
            label="Address Line 2"
            outlined
            v-model.trim="form.address_line2"
          />
          <!-- City -->
          <q-input
            dense
            label="City/District/Suburb/Town/Village"
            outlined
            v-model.trim="form.address_city"
          />
          <!-- State -->
          <q-input
            dense
            label="State/County/Province/Region"
            outlined
            v-model.trim="form.address_state"
          />
          <!-- Zip code -->
          <q-input
            dense
            label="Zip or Postal Code"
            outlined
            v-model.trim="form.address_zip"
          />
          <!-- Country -->
          <q-select
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
            v-model="form.address_country"
          >
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
              </q-item>
            </template>
            <template #append>
              <q-icon
                v-if="form.address_country"
                name="close"
                @click.stop="form.address_country = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
        </div>
      </q-card-section>
      <q-separator class="gt-sm" />
      <!-- Actions -->
      <q-card-actions align="right" class="gt-sm q-pa-md">
        <q-btn
          @click="$router.back()"
          color="primary"
          icon="close"
          label="cancel"
          outline
        />
        <q-btn @click="updateCard" color="primary" icon="save" label="save" />
      </q-card-actions>
    </q-card>

    <!-- Breadcrumbs -->
    <bread-crumbs :breadcrumbs="breadcrumbs" />
  </q-page>
</template>

<script>
import { QSpinner } from 'quasar';
import moment from 'moment';
import { createNamespacedHelpers } from 'vuex';
import { axiosError } from 'utils/error-handler';
import { notifySuccess } from 'utils/success-handler';
import { getCountries, getTwemojiFlag } from 'utils/country';
import Alert from 'components/Alert.vue';
import BreadCrumbs from 'components/BreadCrumbs.vue';

const { mapActions } = createNamespacedHelpers('customers');

export default {
  name: 'CustomerEditCard',
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
          label: 'Edit card',
          link: '',
        },
      ],
      card: '',
      countryOptions: [],
      exp_date: '',
      form: {
        name: '',
        address_line1: '',
        address_line2: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        address_country: '',
        exp_month: '',
        exp_year: '',
      },
      message: '',
      options: [],
    };
  },
  validations: {
    exp_date: {
      isValidDate(value) {
        if (value.length > 0) {
          return moment(value, 'MM/YY', true).isValid();
        }
        return true;
      },
    },
  },
  components: {
    alert: Alert,
    breadCrumbs: BreadCrumbs,
  },
  methods: {
    ...mapActions(['asyncUpdateCustomer']),
    getTwemojiFlag,
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
    getCardData() {
      Object.keys(this.form).forEach(key => {
        this.form[key] = this.$store.state.customers.selectedCardData[key];
      });

      this.card = this.$store.state.customers.selectedCardData.id;

      this.exp_date = moment(
        `${this.$store.state.customers.selectedCardData.exp_month.toString()}/${this.$store.state.customers.selectedCardData.exp_year.toString()}`,
        'MM/YYYY'
      ).format('MM/YY');
    },
    async updateCard() {
      this.$v.exp_date.$touch();

      if (this.$v.exp_date.$error) {
        this.message = 'Please check the errors below.';
        return;
      }

      this.$q.loading.show({
        message: 'Updating card...',
        spinner: QSpinner,
        sanitize: true,
      });

      try {
        const response = await this.$axios.put(
          `/customers/${this.$route.params.id}/cards/${this.card}`,
          this.form,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.auth.token}`,
            },
          }
        );

        if (response.status === 200) {
          notifySuccess('Updated card.');
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
  watch: {
    exp_date(value) {
      const arr = value.split('/');
      if (arr.length === 2) {
        const year = moment(arr[1], 'YY').format('YYYY');
        this.form.exp_month = parseInt(arr[0], 10);
        this.form.exp_year = parseInt(year, 10);
      }
    },
  },
  created() {
    this.$root.$on('submit', this.updateCard);
    this.countryOptions = getCountries();
    this.getCardData();
  },
  beforeDestroy() {
    this.$root.$off('submit', this.updateCard);
  },
};
</script>

<style lang="stylus" scoped>
.w-500px
  width 500px
</style>
