<template>
  <q-page class="flex flex-center">
    <transition appear enter-active-class="animated fadeIn">
      <div class="text-center block q-gutter-y-lg" style="width: 600px">
        <q-icon color="positive" name="far fa-check-circle" size="200px" />
        <div class="text-h4 text-2b">Payment Successful</div>
        <div class="text-subtitle1 text-69">
          Thank you for your payment. A confirmation email has been sent to
          <span class="text-bold">{{ $store.state.receipt.email }}</span
          >. Your receipt number is
          <span class="text-bold">{{ $store.state.receipt.number }}</span
          >.
        </div>
      </div>
    </transition>
  </q-page>
</template>

<script>
export default {
  name: 'Confirmation',
};
</script>
