<template>
  <q-banner inline-actions v-if="toggleAlert" class="text-white bg-red">
    <template v-slot:avatar>
      <q-icon name="warning" color="white" />
    </template>
    {{ message }}
    <template v-slot:action>
      <q-btn flat color="white" label="dismiss" @click="toggleAlert = false" />
    </template>
  </q-banner>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    alert: { type: Boolean, required: true },
    message: { type: String, required: true },
  },
  computed: {
    toggleAlert: {
      get() {
        return this.alert;
      },
      set(value) {
        this.$emit('update:alert', value);
      },
    },
  },
};
</script>
