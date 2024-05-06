<script setup>
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";

const $q = useQuasar();

const route = useRoute();
const router = useRouter();

const props = defineProps({
  propsData: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(["edit"]);
</script>
<template>
  <div>
    <q-btn
      :to="{ name: 'menu-detail', params: { id: propsData.row.id } }"
      class="mr-1"
      color="green-6"
      icon="edit"
      flat
      dense
      outline
    />
  </div>
</template>

<style></style>
