<template>
  <q-banner rounded class="bg-grey-4">
    <q-breadcrumbs style="font-size: 16px">
      <template v-slot:separator>
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
  </q-banner>
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
