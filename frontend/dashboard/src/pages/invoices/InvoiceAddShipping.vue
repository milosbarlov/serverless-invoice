<template>
  <q-page :padding="!$q.platform.is.mobile">
    <div class="row justify-center">
      <q-card
        :class="[
          'text-2b',
          { 'full-width': $q.platform.is.mobile },
          { 'w-500px': !$q.platform.is.mobile },
        ]"
        :flat="$q.platform.is.mobile"
      >
        <q-card-section>
          <div class="text-h6">Add shipping</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="q-gutter-md">
            <q-input
              color="cyan"
              fill-mask="0"
              input-class="text-right"
              label="Unit price"
              mask="#.##"
              outlined
              prefix="$"
              reverse-fill-mask
              v-model="form.shipping"
              unmasked-value
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
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
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      form: {
        shipping: '0',
      },
    };
  },
  methods: {
    save() {
      this.$store.commit('invoices/setShipping', this.form.shipping);
      this.$router.back();
    },
  },
  created() {
    this.form.shipping = this.$store.state.invoices.shipping;
  },
};
</script>

<style lang="stylus" scoped>
.w-500px
  width 500px
</style>
