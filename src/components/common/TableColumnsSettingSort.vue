<script setup>
import draggable from "vuedraggable";
import { computed, ref } from "vue-demi";
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["change"]);

const dragOptions = computed(() => {
  return {
    animation: 200,
  };
});

const activeColumns = ref(getColumns(props.columns));
const notActiveColumns = ref(getColumns(props.columns, false));

function getColumns(columns, active = true) {
  return columns.filter((v) => v.active === active && v.label);
}
function checkMove(evt) {
  const { draggedContext } = evt;
  return !!draggedContext?.element?.label;
}

function deleteItem(item, i) {
  if (!item.label || activeColumns.value?.length === 1) return;
  activeColumns.value.splice(i, 1);
  item.active = false;
  notActiveColumns.value.unshift(item);
  change();
}
function addItem(item, i) {
  notActiveColumns.value.splice(i, 1);
  activeColumns.value.push(item);
  item.active = true;
  change();
}
function onChangeDraggedActive(item) {
  const { added } = item;
  if (added) {
    added.element.active = true;
  }
  change();
}
function onChangeDraggedNotActive(item) {
  const { added } = item;
  if (added) {
    added.element.active = false;
  }
}
function change() {
  emit("change", activeColumns.value);
}
</script>

<template>
  <div class="resource-columns-setting-sort">
    <draggable
      class="list-group"
      v-model="activeColumns"
      v-bind="dragOptions"
      item-key="id"
      :move="checkMove"
      @change="(v) => onChangeDraggedActive(v)"
    >
      <template #item="{ element, index }">
        <div class="list-group-item">
          <q-checkbox
            dense
            :model-value="element.active"
            @click="deleteItem(element, index)"
          />
          <span class="label">{{ element.label || element.name }}</span>
        </div>
      </template>
    </draggable>
    <q-separator />
    <draggable
      class="list-group"
      v-model="notActiveColumns"
      v-bind="dragOptions"
      item-key="id"
      @change="(v) => onChangeDraggedNotActive(v)"
    >
      <template #item="{ element, index }">
        <div class="list-group-item">
          <q-checkbox
            dense
            :model-value="element.active"
            @click="addItem(element, index)"
          />
          <span cl ass="label">{{ element.label || element.name }}</span>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style lang="scss">
.resource-columns-setting-sort {
  .list-group {
    margin: 0;
    &-item {
      padding: 5px 10px;
      cursor: move;
      .label {
        padding-left: 7px;
      }
    }
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
