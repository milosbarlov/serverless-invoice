<template>
  <keep-alive include="PageCustomerProfile"> <router-view /> </keep-alive>
</template>

<script>
import { Loading, QSpinner } from 'quasar';
import { axiosInstance } from 'boot/axios';
import { axiosError, notifyError } from 'utils/error-handler';
import store from 'src/store/index';

export default {
  name: 'Customer',
  async beforeRouteEnter(to, from, next) {
    const Store = store();

    Loading.show({
      message: 'Loading customer...',
      spinner: QSpinner,
      spinnerColor: 'purple',
      sanitize: true,
    });

    try {
      const response = await axiosInstance.get(`/customers/${to.params.id}`, {
        headers: {
          Authorization: `Bearer ${Store.state.auth.token}`,
        },
      });

      if (response.status === 200) {
        Store.commit('customers/setCustomer', response.data);
        next();
      }
    } catch (error) {
      console.error(error);
      notifyError(axiosError(error));
      next('*');
    } finally {
      Loading.hide();
    }
  },
};
</script>
