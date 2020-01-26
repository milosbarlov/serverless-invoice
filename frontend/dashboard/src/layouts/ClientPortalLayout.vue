<template>
  <q-layout class="bg-grey-1" view="hHh Lpr fFf">
    <q-header elevated class="bg-cyan">
      <q-toolbar>
        <q-toolbar-title>
          <router-link class="text-white" to="/">
            Serverless Invoice
          </router-link>
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
  name: 'ClientPortalLayout',
};
</script>
