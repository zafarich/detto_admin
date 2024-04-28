<script setup>
import { ref } from "vue-demi";
import BaseInput from "../UI/BaseInput.vue";
import TableFiltersDialog from "./TableFiltersDialog.vue";
const emit = defineEmits(["change", "reset"]);
const props = defineProps({
  searchFieldName: {
    type: String,
    default: "search",
  },
});
const search = ref(null);
const dialog = ref(false);

function onHandleFilterChange(v) {
  emit("change", v);
}
</script>
<template>
  <div class="table_filters">
    <BaseInput
      v-model="search"
      placeholder="Telefon nomer"
      dense
      outlined
      type="search"
      prepend
      class="bg-blue-grey-1 rd-6"
      :debounce="300"
      @update:model-value="
        (v) => onHandleFilterChange({ [searchFieldName]: v || null })
      "
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </BaseInput>
    <q-btn
      label="Filtr"
      class="ml-2"
      text-color="dark"
      no-caps
      color="blue-grey-1"
      rounded
      icon="tune"
      @click="dialog = true"
    />
    <TableFiltersDialog
      v-model="dialog"
      @change="emit('change', $event)"
      @reset="
        () => {
          search = null;
          emit('reset');
        }
      "
    >
      <template #cols>
        <slot name="filter-dialog-cols" />
      </template>
    </TableFiltersDialog>
  </div>
</template>

<style scoped lang="scss">
.table_filters {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.q-field.q-input {
  border-radius: 6px;
}
</style>
