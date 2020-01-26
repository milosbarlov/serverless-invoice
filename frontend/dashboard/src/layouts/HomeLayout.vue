<template>
  <q-layout class="bg-grey-1" view="hHh Lpr fFf">
    <q-header elevated class="bg-cyan text-white">
      <q-toolbar class="text-cyan-1">
        <q-btn
          @click="$router.back()"
          dense
          flat
          icon="arrow_back"
          round
          v-if="$route.meta.backBtn && $q.screen.lt.md"
        />

        <q-toolbar-title>
          <span class="lt-md">{{ $route.meta.title }}</span>
          <router-link class="gt-sm text-cyan-1" to="/">
            Serverless Invoice
          </router-link>
        </q-toolbar-title>

        <q-tabs inline-label shrink stretch>
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
          <q-separator v-if="$route.name === 'home'" dark vertical />
          <q-btn
            flat
            stretch
            to="/login"
            v-if="$store.state.auth.token === null && $route.name !== 'login'"
          >
            <q-icon left name="fas fa-sign-in-alt" size="1.33em" />
            <div>login</div>
          </q-btn>
          <q-btn
            flat
            stretch
            to="/dashboard"
            v-if="$store.state.auth.token !== null"
          >
            <q-icon left name="arrow_forward" size="1.33em" />
            <div>dashboard</div>
          </q-btn>
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'HomeLayout',
};
</script>

<style></style>
