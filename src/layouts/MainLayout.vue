<script setup>
import TheHeader from "components/common/TheHeader.vue";
import LeftDrawer from "components/common/LeftDrawer.vue";
import { ref } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const leftDrawer = ref(null);
$q.loading.hide();
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <TheHeader @toggle-left-drawer="() => leftDrawer.toggleDrawer()" />
    <LeftDrawer ref="leftDrawer" />
    <q-page-container>
      <router-view class="main-page" />
    </q-page-container>
  </q-layout>
</template>
