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

        <q-tabs class="gt-xs" inline-label shrink stretch>
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

        <q-btn
          flat
          dense
          round
          class="lt-sm"
          @click="drawer = !drawer"
          aria-label="Menu"
          icon="menu"
        >
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer content-class="bg-grey-3" overlay side="right" v-model="drawer">
      <q-list>
        <q-item
          clickable
          tag="a"
          href="https://github.com/Mirakurun/serverless-invoice"
          target="_blank"
          rel="noopener"
        >
          <q-item-section avatar>
            <q-icon name="fab fa-github fa-fw" style="color: #24292e" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-2b">Github</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon
              name="fas fa-external-link-alt fa-fw"
              color="grey"
              size="16px"
            />
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          href="https://www.linkedin.com/in/kevin-chhay/"
          target="_blank"
          rel="noopener"
        >
          <q-item-section avatar>
            <q-icon name="fab fa-linkedin fa-fw" style="color: #0077b5" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-2b">LinkedIn</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon
              name="fas fa-external-link-alt fa-fw"
              color="grey"
              size="16px"
            />
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable to="/login" v-if="$store.state.auth.token === null">
          <q-item-section avatar>
            <q-icon color="cyan" name="fas fa-sign-in-alt fa-fw" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-2b">Login</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          @click="drawer = !drawer"
          clickable
          to="/dashboard"
          v-if="$store.state.auth.token !== null"
        >
          <q-item-section avatar>
            <q-icon color="cyan" name="fas fa-arrow-right fa-fw" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-2b">Dashboard</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'HomeLayout',
  data() {
    return {
      drawer: false,
    };
  },
};
</script>

<style></style>
