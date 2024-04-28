<script setup>
import { ref } from "vue-demi";
import ResourceColumnsSettingSort from "./TableColumnsSettingSort.vue";

defineProps({
  availableColumns: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  "click:save",
  "click:cancel",
  "change:active-columns",
]);

const drawer = ref(false);

function open() {
  drawer.value = true;
}

defineExpose({
  open,
});
</script>

<template>
  <q-drawer
    v-model="drawer"
    side="right"
    class="resource-columns-setting"
    behavior="mobile"
    no-swipe-open
    no-swipe-close
  >
    <header class="header">
      <div class="title">Ustun sozlamalari</div>
      <BaseCloseBtn class="ml-auto" @click="cancel" />
    </header>
    <ResourceColumnsSettingSort
      v-if="availableColumns.length"
      :columns="availableColumns"
      @change="(v) => emit('change:active-columns', v)"
    />
    <!-- <footer class="footer">
      <q-btn
        dense
        color="primary"
        class="w-100p"
        :label="t('save')"
        @click="save"
      />
    </footer> -->
  </q-drawer>
</template>

<style lang="scss">
.resource-columns-setting {
  .header {
    padding-top: 20px;
    padding-bottom: 5px;
    background-color: #fff;
    text-align: center;
    .title {
      font-size: 16px;
      color: $dark;
    }
  }
}
</style>
