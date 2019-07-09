const stripe = Stripe('pk_test_GfqdcTRY5WTeKzKhV3X3RztR');

// leave the export, even if you don't use it
export default async ({ Vue }) => {
  Vue.prototype.$stripe = stripe;
};
