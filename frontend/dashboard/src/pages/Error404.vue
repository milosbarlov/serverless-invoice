<template>
  <q-layout style="background-color: black">
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="block">
          <p class="text-white text-center">
            Sorry, nothing here... <strong>(404)</strong>
          </p>
          <q-btn
            color="secondary"
            style="width:200px;"
            @click="$router.push('/')"
            >Go Home</q-btn
          >
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
