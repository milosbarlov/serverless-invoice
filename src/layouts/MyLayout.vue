<template>
  <q-layout
    view="hHh Lpr lFf"
    :class="$store.state.layout.fullscreen || 'bg-grey-3'"
  >
    <q-header elevated class="bg-indigo" v-if="!$store.state.layout.fullscreen">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Serverless Invoice
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      content-class="bg-grey-10"
      v-if="!$store.state.layout.fullscreen"
    >
      <q-list dark>
        <q-item to="/" clickable exact active-class="active-menu-link">
          <q-item-section avatar>
            <q-icon name="fas fa-home fa-fw" color="cyan" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/customers" clickable active-class="active-menu-link">
          <q-item-section avatar>
            <q-icon name="fas fa-users fa-fw" color="pink" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Customers</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/invoices" clickable active-class="active-menu-link">
          <q-item-section avatar>
            <q-icon name="fas fa-file-invoice fa-fw" color="amber" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Invoices</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/payments" clickable active-class="active-menu-link">
          <q-item-section avatar>
            <q-icon name="fas fa-credit-card fa-fw" color="blue-grey" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Payments</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/products" clickable active-class="active-menu-link">
          <q-item-section avatar>
            <q-icon name="fas fa-box fa-fw" color="red" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Products</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/settings" clickable active-class="active-menu-link">
          <q-item-section avatar>
            <q-icon name="fas fa-cog fa-fw" color="green" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container> <router-view /> </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar';

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
    };
  },
  methods: {
    openURL,
  },
};
</script>

<style lang="stylus" scoped>
.active-menu-link
  color white
  background $grey-14
</style>
