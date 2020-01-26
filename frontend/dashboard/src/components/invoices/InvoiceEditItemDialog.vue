<template>
  <q-dialog
    v-model="toggleDialog"
    @before-show="populate"
    :maximized="$q.platform.is.mobile"
  >
    <q-card :class="[{ 'card-width': $q.platform.is.desktop }, 'text-2b']">
      <q-card-section>
        <div class="text-h6">Edit item</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-gutter-md q-mb-md">
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
        <div class="q-gutter-md q-my-md">
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
            color="positive"
            fill-mask="0"
            :hidden="form.discount_type === '%'"
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
            color="positive"
            fill-mask="0"
            :hidden="form.discount_type === '$'"
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
        <div class="q-mt-md">
          <q-input
            fill-mask="0"
            input-class="text-right"
            label="total"
            mask="#.##"
            outlined
            prefix="$"
            readonly
            reverse-fill-mask
            :value="total"
            unmasked-value
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          @click="toggleDialog = false"
          color="primary"
          icon="close"
          outline
          label="cancel"
        />
        <q-btn @click="save" color="primary" icon="save" label="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'InvoiceEditItemDialog',
  props: {
    item: {
      type: Object,
      required: true,
    },
    showDialog: {
      type: Boolean,
      required: true,
    },
  },
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
      typeOptions: [{ label: '$', value: '$' }, { label: '%', value: '%' }],
    };
  },
  computed: {
    toggleDialog: {
      get() {
        return this.showDialog;
      },
      set(value) {
        this.$emit('update:showDialog', value);
      },
    },
    total() {
      return (this.form.amount - this.form.item_discount).toString();
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
    populate() {
      this.form = this.item;
    },
    save() {
      this.$emit('update:item', this.form);
      this.toggleDialog = false;
    },
  },
  // created() {
  //   this.form = { ...this.$store.state.invoices.item };
  // },
};
</script>

<style lang="stylus" scoped>
.card-width
  width 500px
</style>
