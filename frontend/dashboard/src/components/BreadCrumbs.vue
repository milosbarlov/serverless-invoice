<template>
  <q-page-sticky class="gt-sm" expand position="top">
    <q-toolbar class="bg-grey-3 shadow-4">
      <q-breadcrumbs active-color="cyan" class="text-grey">
        <template #separator>
          <q-icon size="1.5em" name="chevron_right" color="blue-grey" />
        </template>
        <q-breadcrumbs-el
          v-for="breadcrumb in breadcrumbs"
          :icon="breadcrumb.icon"
          :label="breadcrumb.label"
          :key="breadcrumb.label"
          :to="breadcrumb.link"
        />
      </q-breadcrumbs>
    </q-toolbar>
  </q-page-sticky>
</template>

<script>
export default {
  name: 'BreadCrumbs',
  props: {
    breadcrumbs: {
      type: Array,
      required: true,
    },
  },
};
</script>
