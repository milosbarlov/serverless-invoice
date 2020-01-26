<template>
  <q-banner inline-actions v-if="alert" class="text-white bg-red">
    <template #avatar>
      <q-icon name="warning" color="white" />
    </template>
    {{ message }}
  </q-banner>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    alert: { type: Boolean, required: true },
    message: { type: String, required: true },
  },
};
</script>
