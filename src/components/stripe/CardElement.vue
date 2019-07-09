<template>
  <div>
    <div ref="card-element" id="card-element" class="q-mb-sm">
      <!-- A Stripe Element will be inserted here. -->
    </div>
    <div ref="card-errors" id="card-errors" role="alert">
      {{ $store.state.stripe.error }}
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapMutations } = createNamespacedHelpers('stripe');
let cardElement;

export default {
  data() {
    return {
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
    };
  },
  methods: {
    ...mapMutations(['updateElement', 'updateError', 'updateValue']),
    destroy() {
      cardElement.destroy();
    },
  },
  mounted() {
    const elements = this.$stripe.elements();

    cardElement = elements.create('card', { style: this.style });
    cardElement.mount('#card-element');
    cardElement.addEventListener('change', event => {
      if (event.error) {
        this.updateError(event.error.message);
      } else {
        this.updateError('');
      }
    });
    this.updateElement(cardElement);
  },
  destroyed() {
    cardElement.destroy();
    this.updateError('');
  },
};
</script>

<style lang="stylus" scoped>
.StripeElement {
  background-color: white;
  height: 40px;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid transparent;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}

#card-element {
  padding: 10px;
}

#card-errors {
  height: 20px;
  color: #fa755a;
}
</style>
