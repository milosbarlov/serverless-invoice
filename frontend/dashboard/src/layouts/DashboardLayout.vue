<template>
  <q-layout class="bg-grey-1" view="hHh Lpr fFf">
    <q-header elevated class="bg-cyan" v-if="!$store.state.layout.fullscreen">
      <q-toolbar class="text-cyan-1">
        <q-btn
          @click="$router.back()"
          dense
          flat
          icon="arrow_back"
          round
          v-if="$route.meta.backBtn && $q.screen.lt.md"
        />
        <q-btn
          @click="leftDrawerOpen = !leftDrawerOpen"
          dense
          flat
          icon="menu"
          round
          v-else
        />

        <q-toolbar-title>
          {{ $q.screen.lt.md ? $route.meta.title : 'Serverless Invoice' }}
        </q-toolbar-title>

        <q-tabs class="gt-sm" inline-label shrink stretch>
          <q-btn
            flat
            stretch
            type="a"
            href="https://github.com/Mirakurun/serverless-invoice"
            target="_blank"
            rel="noopener"
          >
            <q-icon name="fab fa-github" size="1.33em" />
          </q-btn>
          <q-btn
            flat
            stretch
            type="a"
            href="https://www.linkedin.com/in/kevin-chhay/"
            target="_blank"
            rel="noopener"
          >
            <q-icon name="fab fa-linkedin" size="1.33em" />
          </q-btn>
          <q-separator dark vertical />
          <q-btn @click="logout" flat stretch>
            <q-icon left name="fas fa-sign-out-alt" size="1.33em" />
            <div>logout</div>
          </q-btn>
        </q-tabs>

        <q-btn
          @click="submit"
          outline
          :label="$route.meta.submitText"
          v-if="$route.meta.submitBtn && $q.screen.lt.md"
        />
        <q-btn
          @click="showBottomSheet"
          dense
          flat
          icon="more_vert"
          round
          v-if="$route.meta.kebabMenu && $q.screen.lt.md"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      content-class="bg-grey-10"
      v-if="!$store.state.layout.fullscreen"
    >
      <q-list class="text-grey-5" dark>
        <q-item to="/dashboard" clickable exact active-class="active-menu-link">
          <q-item-section avatar>
            <q-icon name="fas fa-home fa-fw" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/customers" clickable active-class="active-menu-link">
          <q-item-section avatar>
            <q-icon name="fas fa-users fa-fw" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Customers</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/invoices" clickable active-class="active-menu-link">
          <q-item-section avatar>
            <q-icon name="fas fa-file-invoice fa-fw" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Invoices</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/payments" clickable active-class="active-menu-link">
          <q-item-section avatar>
            <q-icon name="fas fa-credit-card fa-fw" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Payments</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/settings" clickable active-class="active-menu-link">
          <q-item-section avatar>
            <q-icon name="fas fa-cog fa-fw" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator class="lt-md" dark />
        <q-item
          class="lt-md"
          clickable
          tag="a"
          href="https://github.com/Mirakurun/serverless-invoice"
          target="_blank"
        >
          <q-item-section avatar>
            <q-icon name="fab fa-github fa-fw" color="grey-5" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon
              name="fas fa-external-link-alt fa-fw"
              color="grey"
              size="16px"
            />
          </q-item-section>
        </q-item>
        <q-item class="lt-md" clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="fas fa-sign-out-alt fa-fw" color="grey-5" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <keep-alive :include="['InvoicesHome', 'CustomersHome', 'PaymentsHome']">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'DashboardLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
    },
    showBottomSheet() {
      this.$root.$emit('showBottomSheet');
    },
    submit() {
      this.$root.$emit('submit');
    },
  },
};
</script>

<style lang="stylus" scoped>
.active-menu-link
  color $cyan
  background $grey-8
</style>
