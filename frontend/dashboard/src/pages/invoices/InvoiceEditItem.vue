<template>
  <q-page :padding="!$q.platform.is.mobile">
    <div class="row justify-center">
      <q-card
        :class="{
          'text-2b': true,
          'full-width': $q.platform.is.mobile,
          'w-500px': !$q.platform.is.mobile,
        }"
        :flat="$q.platform.is.mobile"
      >
        <q-card-section>
          <div class="text-h6">Edit item</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="q-gutter-md">
            <q-input label="Description" outlined v-model="form.description" />
            <q-input
              label="Quantity"
              outlined
              type="number"
              v-model="form.quantity"
            />
            <q-input
              fill-mask="0"
              input-class="text-right"
              label="Unit price"
              mask="#.##"
              outlined
              prefix="$"
              reverse-fill-mask
              v-model="form.unit_amount"
              unmasked-value
            />
            <q-input
              input-class="text-right"
              label="Subtotal"
              outlined
              prefix="$"
              readonly
              :value="amount()"
            />
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div class="q-gutter-md">
            <q-btn-toggle
              color="grey-3"
              :options="typeOptions"
              spread
              text-color="primary"
              toggle-color="primary"
              unelevated
              v-model="form.discount_type"
            />
            <q-input
              :class="{ hidden: form.discount_type === '%' }"
              color="positive"
              fill-mask="0"
              input-class="text-right"
              mask="#.##"
              label="Item discount"
              outlined
              prefix="$"
              reverse-fill-mask
              v-model="form.item_discount"
              unmasked-value
            />
            <q-input
              :class="{ hidden: form.discount_type === '$' }"
              color="positive"
              fill-mask="0"
              input-class="text-right"
              mask="#"
              label="Item discount"
              outlined
              reverse-fill-mask
              suffix="%"
              v-model="form.item_discount"
              unmasked-value
            />
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <q-input
            input-class="text-right"
            label="total"
            outlined
            prefix="$"
            readonly
            :value="total"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            @click="$router.back()"
            color="primary"
            icon="close"
            outline
            label="cancel"
          />
          <q-btn @click="save" color="primary" icon="save" label="save" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'InvoiceEditItem',
  data() {
    return {
      form: {
        amount: '',
        description: '',
        discount_type: '',
        item_discount: '',
        quantity: '',
        unit_amount: '',
      },
      options: ['$', '%'],
      typeOptions: [
        { label: '$', value: '$' },
        { label: '%', value: '%' },
      ],
    };
  },
  computed: {
    total() {
      const total = (this.form.amount - this.form.item_discount).toString();

      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(total / 100);
    },
  },
  methods: {
    amount() {
      this.form.amount = (
        this.form.quantity * this.form.unit_amount
      ).toString();

      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(this.form.amount / 100);
    },
    save() {
      // this.$store.commit('invoices/setItemByVal', this.form);
      this.$store.commit('invoices/setItem', {
        value: this.form,
        index: this.$store.state.invoices.index,
      });
      this.$router.back();
    },
  },
  created() {
    this.form = {
      ...this.$store.state.invoices.lines[this.$store.state.invoices.index],
    };
  },
};
</script>

<style lang="stylus" scoped>
.w-500px
  width 500px
</style>
