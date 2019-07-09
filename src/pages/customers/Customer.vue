<template>
  <keep-alive include="PageCustomerProfile"> <router-view /> </keep-alive>
</template>

<script>
import { Loading, QSpinner } from 'quasar';
import { axiosInstance } from 'boot/axios';
import { errorHandler } from 'boot/error-handler';
import store from 'store/index';

export default {
  name: 'Customer',
  async beforeRouteEnter(to, from, next) {
    const Store = store();

    Loading.show({
      message: 'Loading customer...',
      spinner: QSpinner,
      spinnerColor: 'light-blue',
    });

    try {
      const response = await axiosInstance.get(`/customers/${to.params.id}`);

      if (response.status === 200) {
        Store.commit('customers/updateCustomer', response.data);
        next();
      }
    } catch (error) {
      console.error(error);
      errorHandler(error);
      next('*');
    } finally {
      Loading.hide();
    }
  },
};
</script>
