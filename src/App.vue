<script setup>
import { onMounted } from "vue-demi";
import { useAuthStore } from "src/stores/auth";
const authStore = useAuthStore();
onMounted(() => {
  authStore.me();
  const appDiv = document.getElementById("q-app");
  setTimeout(() => {
    appDiv.classList.remove("hide");
  }, 500);
});
</script>

<template>
  <router-view />
</template>
