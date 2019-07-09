<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card style="width: 500px; max-width: 100vw; min-width: 300px">
        <q-card-section>
          <div class="text-h6">Edit card</div>
        </q-card-section>
        <q-separator />
        <alert :alert.sync="alert" :message="alertMsg" />
        <q-card-section>
          <div class="q-gutter-y-md">
            <div class="row q-col-gutter-md">
              <div class="col-xs-12 col-md-6">
                <q-input
                  outlined
                  autofocus
                  v-model.trim="form.name"
                  label="Cardholder's name"
                />
              </div>
              <div class="col-xs-12 col-md-6">
                <q-input
                  outlined
                  v-model="exp_date"
                  @blur="$v.exp_date.$touch"
                  mask="##/##"
                  label="Expiration date"
                  placeholder="MM/YY"
                  :error="$v.exp_date.$error"
                  error-message="Invalid date"
                />
              </div>
            </div>
            <q-input
              outlined
              v-model.trim="form.address_line1"
              label="Address Line 1"
            />
            <q-input
              outlined
              v-model.trim="form.address_line2"
              label="Address Line 2"
            />
            <q-input
              outlined
              v-model.trim="form.address_city"
              label="City/District/Suburb/Town/Village"
            />
            <q-input
              outlined
              v-model.trim="form.address_state"
              label="State/County/Province/Region"
            />
            <q-input
              outlined
              v-model.trim="form.address_zip"
              label="Zip or Postal Code"
            />
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
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            outline
            @click="$router.back()"
            color="primary"
            label="cancel"
          />
          <q-btn @click="updateCard" color="primary" label="edit card" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { QSpinner } from 'quasar';
import { createNamespacedHelpers } from 'vuex';
import customerMixin from 'mixins/customer';
import { formErrorHandler } from 'mixins/form-error-handler';
import Alert from 'components/Alert.vue';

const { mapActions } = createNamespacedHelpers('customers');

export default {
  name: 'CustomerEditCard',
  mixins: [customerMixin, formErrorHandler],
  data() {
    return {
      alert: false,
      alertMsg: '',
      country: { label: '', value: '' },
      card: '',
      exp_date: '',
      form: {
        name: '',
        address_line1: '',
        address_line2: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        address_country: '',
      },
      options: [],
    };
  },
  validations: {
    exp_date: {
      isValidDate: (date, vm) => {
        if (date.length > 0) {
          return vm.$moment(date, 'MM/YY', true).isValid();
        }
        return true;
      },
    },
  },
  components: {
    alert: Alert,
  },
  methods: {
    ...mapActions(['asyncUpdateCustomer']),
    async updateCard() {
      this.$v.exp_date.$touch();

      if (this.$v.exp_date.$error) {
        this.formError('Please correct the error below.');
        return;
      }

      this.$q.loading.show({
        message: 'Updating card...',
        spinner: QSpinner,
      });

      const data = { ...this.form };
      const date = this.exp_date.split('/');
      date[1] = this.$moment(date[1], 'YY').format('YYYY');
      data.exp_month = parseInt(date[0], 10);
      data.exp_year = parseInt(date[1], 10);

      try {
        const response = await this.$axios.put(
          `/customers/${this.$route.params.id}/cards/${this.card}`,
          data
        );

        if (response.status === 200) {
          this.$notifySuccess('Updated card.');
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

    Object.keys(this.form).forEach(key => {
      this.form[key] = this.$store.state.customers.selectedCardData[key];
    });

    this.card = this.$store.state.customers.selectedCardData.id;

    this.exp_date = this.$moment(
      `${this.$store.state.customers.selectedCardData.exp_month.toString()}/${this.$store.state.customers.selectedCardData.exp_year.toString()}`,
      'MM/YYYY'
    ).format('MM/YY');
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
