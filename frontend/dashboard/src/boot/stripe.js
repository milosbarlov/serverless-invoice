const stripe = Stripe(process.env.STRIPE_KEY);

// leave the export, even if you don't use it
export default async ({ Vue }) => {
  Vue.prototype.$stripe = stripe;
};
