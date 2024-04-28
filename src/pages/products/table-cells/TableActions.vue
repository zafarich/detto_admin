<script setup>
import { ref } from "vue-demi";
import { useQuasar } from "quasar";

const $q = useQuasar();

const props = defineProps({
  propsData: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(["delete", "edit"]);
</script>
<template>
  <div>
    <q-btn
      @click="emit('edit', propsData.row)"
      class="mr-1"
      color="green-6"
      icon="edit"
      flat
      dense
      outline
    />
    <q-btn
      class="mr-1"
      color="red-5"
      icon="delete"
      flat
      dense
      @click="emit('delete', propsData.row.id)"
    />
  </div>
</template>

<style></style>
