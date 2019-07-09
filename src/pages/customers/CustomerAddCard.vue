<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card style="width: 500px; max-width: 100vw; min-width: 300px">
        <q-card-section>
          <div class="text-h6">Add card</div>
        </q-card-section>
        <q-separator />
        <alert :alert.sync="alert" :message="alertMsg" />
        <q-card-section class="q-gutter-y-md">
          <!-- Stripe card element -->
          <card-element />
          <!-- Cardholder name -->
          <q-input
            outlined
            v-model.trim="form.name"
            label="Cardholder's name"
          />
          <!-- Address line 1 -->
          <q-input
            outlined
            v-model.trim="form.address_line1"
            label="Address Line 1"
          />
          <!-- Address line 2 -->
          <q-input
            outlined
            v-model.trim="form.address_line2"
            label="Address Line 2"
          />
          <!-- City -->
          <q-input
            outlined
            v-model.trim="form.address_city"
            label="City/District/Suburb/Town/Village"
          />
          <!-- State -->
          <q-input
            outlined
            v-model.trim="form.address_state"
            label="State/County/Province/Region"
          />
          <!-- Zip code -->
          <q-input
            outlined
            v-model.trim="form.address_zip"
            label="Zip or Postal Code"
          />
          <!-- Country -->
          <q-select
            filled
            use-input
            id="form-country"
            label="Country"
            :options="options"
            v-model="country"
            @filter="filterCountry"
          >
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
              </q-item>
            </template>
            <template v-slot:append>
              <q-icon
                v-if="country.value.length > 0"
                name="close"
                @click.stop="country = { label: '', value: '' }"
                class="cursor-pointer"
              />
            </template>
          </q-select>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            outline
            @click="$router.back()"
            color="primary"
            label="cancel"
          />
          <q-btn @click="addCard" color="primary" label="add card" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { QSpinner } from 'quasar';
import { mapMutations, mapActions } from 'vuex';
import customerMixin from 'mixins/customer';
import CardElement from 'components/stripe/CardElement.vue';
import { formErrorHandler } from 'mixins/form-error-handler';
import Alert from 'components/Alert.vue';

export default {
  name: 'CustomerAddCard',
  mixins: [customerMixin, formErrorHandler],
  data() {
    return {
      alert: false,
      alertMsg: '',
      country: { label: '', value: '' },
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
    };
  },
  components: {
    cardElement: CardElement,
    alert: Alert,
  },
  methods: {
    ...mapMutations('stripe', ['updateError']),
    ...mapActions('customers', ['asyncUpdateCustomer']),
    async addCard() {
      this.$q.loading.show({
        message: 'Adding card...',
        spinner: QSpinner,
      });

      await this.createToken();
    },
    async createToken() {
      const { error, token } = await this.$stripe.createToken(
        this.$store.state.stripe.element,
        this.form
      );

      if (error) {
        this.formError('Please correct the error below.');
        this.updateError(error.message);
        this.$q.loading.hide();
      } else {
        this.stripeTokenHandler(token);
      }
    },
    async stripeTokenHandler(token) {
      try {
        const response = await this.$axios.post(
          `/customers/${this.$route.params.id}/source`,
          { token: token.id }
        );

        if (response.status === 201) {
          this.$notifySuccess('Added new card.');
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
      this.form.address_country = this.country.value;
    },
  },
  created() {
    this.getCountries();
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
