<template>
  <q-layout style="background-color:black;">
    <div class="fixed-center text-center">
      <p>
        <img
          src="statics/img/smug-anime-face.png"
          xstyle="width:30vw;max-width:150px;"
          class="fit"
        />
      </p>
      <p class="text-faded">Sorry, nothing here... <strong>(404)</strong></p>
      <q-btn color="secondary" style="width:200px;" @click="$router.push('/')"
        >Go Home</q-btn
      >
    </div>
  </q-layout>
</template>
