<template>
  <q-page
    :class="[
      {
        'bread-crumb-padding': $q.screen.gt.sm,
      },
      'flex',
      'flex-center',
    ]"
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
        <div class="text-h6">New card</div>
      </q-card-section>
      <q-separator class="gt-sm" />
      <alert :alert="message ? true : false" :message="message" />
      <q-card-section>
        <div class="q-gutter-y-md">
          <!-- Note -->
          <q-banner class="text-light-blue-8 bg-light-blue-1">
            <div class="text-subtitle1">Test card numbers</div>
            Genuine card information cannot be used in test mode. Instead, use
            any of the following test card numbers, a valid expiration date in
            the future, and any random CVC number, to create a successful
            payment.
            <ul>
              <li>4242 4242 4242 4242 Visa</li>
              <li>4000 0566 5566 5556 Visa (debit)</li>
              <li>5555 5555 5555 4444 Mastercard</li>
              <li>2223 0031 2200 3222 Mastercard (2-series)</li>
              <li>5200 8282 8282 8210 Mastercard (debit)</li>
              <li>5105 1051 0510 5100 Mastercard (prepaid)</li>
              <li>3782 822463 10005 American Express</li>
              <li>3714 496353 98431 American Express</li>
              <li>6011 1111 1111 1117 Discover</li>
              <li>6011 0009 9013 9424 Discover</li>
              <li>3056 9300 0902 0004 Diners Club</li>
              <li>3622 7206 2716 67 Diners Club (14 digit card)</li>
              <li>3566 0020 2036 0505 JCB</li>
              <li>6200 0000 0000 0005 UnionPay</li>
            </ul>
          </q-banner>
          <!-- Stripe card element -->
          <card-element />
          <!-- Cardholder name -->
          <q-input
            color="cyan"
            dense
            label="Cardholder's name"
            outlined
            v-model.trim="form.name"
          />
          <!-- Address line 1 -->
          <q-input
            color="cyan"
            dense
            label="Address Line 1"
            outlined
            v-model.trim="form.address_line1"
          />
          <!-- Address line 2 -->
          <q-input
            color="cyan"
            dense
            label="Address Line 2"
            outlined
            v-model.trim="form.address_line2"
          />
          <!-- City -->
          <q-input
            color="cyan"
            dense
            outlined
            label="City/District/Suburb/Town/Village"
            v-model.trim="form.address_city"
          />
          <!-- State -->
          <q-input
            color="cyan"
            dense
            outlined
            label="State/County/Province/Region"
            v-model.trim="form.address_state"
          />
          <!-- Zip code -->
          <q-input
            color="cyan"
            dense
            outlined
            label="Zip or Postal Code"
            v-model.trim="form.address_zip"
          />
          <!-- Country -->
          <q-select
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
      <q-separator />
      <!-- Actions -->
      <q-card-actions align="right" class="gt-sm q-pa-md">
        <q-btn outline @click="$router.back()" color="cyan" label="cancel" />
        <q-btn @click="addCard" color="cyan" label="add card" />
      </q-card-actions>
    </q-card>

    <!-- Breadcrumbs -->
    <bread-crumbs :breadcrumbs="breadcrumbs" />
  </q-page>
</template>

<script>
import { QSpinner } from 'quasar';
import { mapMutations, mapActions } from 'vuex';
import CardElement from 'components/stripe/CardElement.vue';
import { axiosError } from 'utils/error-handler';
import { notifySuccess } from 'utils/success-handler';
import Alert from 'components/Alert.vue';
import BreadCrumbs from 'components/BreadCrumbs.vue';
import { getCountries, getTwemojiFlag } from 'utils/country';

export default {
  name: 'CustomerAddCard',
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
          label: 'New card',
          link: '',
        },
      ],
      countryOptions: [],
      options: [],
      form: {
        name: '',
        address_line1: '',
        address_line2: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        address_country: '',
      },
      message: '',
    };
  },
  components: {
    cardElement: CardElement,
    alert: Alert,
    breadCrumbs: BreadCrumbs,
  },
  methods: {
    ...mapMutations('stripe', ['updateError']),
    ...mapActions('customers', ['asyncUpdateCustomer']),
    async addCard() {
      this.$q.loading.show({
        message: 'Adding card...',
        spinner: QSpinner,
        sanitize: true,
      });

      this.createToken();
    },
    async createToken() {
      const { error, token } = await this.$stripe.createToken(
        this.$store.state.stripe.element,
        this.form
      );

      if (error) {
        this.message = 'Please check the errors below.';
        this.updateError(error.message);
        this.$q.loading.hide();
      } else {
        this.stripeTokenHandler(token);
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
    async stripeTokenHandler(token) {
      try {
        const response = await this.$axios.post(
          `/customers/${this.$route.params.id}/source`,
          { token: token.id },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.auth.token}`,
            },
          }
        );

        if (response.status === 201) {
          notifySuccess('Added new card.');
          this.$router.push(`/customers/${this.$route.params.id}`, () => {
            this.asyncUpdateCustomer({
              id: this.$route.params.id,
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
  created() {
    this.$root.$on('submit', this.addCard);
    this.countryOptions = getCountries();
  },
  beforeDestroy() {
    this.$root.$off('submit', this.addCard);
  },
};
</script>

<style lang="stylus" scoped>
.w-500px
  width 500px
</style>
