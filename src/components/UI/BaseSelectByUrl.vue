<template>
  <q-select
    class="base_select_by_url"
    dropdown-icon="keyboard_arrow_down"
    v-bind="attrs"
    hide-bottom-space
    options-dense
    :options="list"
    :model-value="modelValue"
    lazy-rules="ondemand"
    transition-show="jump-up"
    transition-hide="jump-down"
    :transition-duration="50"
    @filter="filterFn"
    @update:model-value="onInput"
  >
    <template v-if="selected && modelValue" #selected>
      {{ selectedLabel || "" }}
    </template>
    <template v-else-if="placeholder && !modelValue" #selected>
      <div class="placeholder">
        <span>{{ placeholder }}</span>
        <!-- <span v-if="required" class="required-text-red">*</span> -->
      </div>
    </template>
    <template v-if="!placeholder" #label>
      <span>{{ attrs.label }}</span>
    </template>
    <template #no-option>
      <q-item class="items-center"> Ma'lumot yo'q </q-item>
    </template>
    <template v-if="option" #option="item">
      <slot name="option" v-bind="item" />
    </template>
  </q-select>
</template>

<script setup>
import { translate } from "src/utils/helpers";
import { ref, useAttrs, computed } from "vue-demi";

const attrs = useAttrs();
const props = defineProps({
  modelValue: [Number, String],
  cbFunc: {
    type: Function,
    default: () => null,
  },
  placeholder: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: "label",
  },
  required: {
    type: Boolean,
    default: false,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  option: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  translates: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["select", "loaded"]);

let initialized = false;
const list = ref([]);

const onInput = function (items) {
  emit("select", { ...items });
};

const selectedLabel = computed(() => {
  const value = props.modelValue;
  const optionValue = attrs["option-value"];
  const optionLabel = attrs["option-label"];

  if (typeof value === "number") {
    return list.value.find((el) => el[optionValue] === value)?.[optionLabel];
  }
  return value[optionLabel];
});

const filterFn = async function (val, update) {
  await init();
  update();
};

const init = async function () {
  if (!initialized) {
    let items = await props.cbFunc(props.params);
    if (props.translates) {
      items = items.map((item) => {
        return {
          ...item,
          [attrs["option-label"]]: translate(item, attrs["option-label"]),
        };
      });
    }
    emit("loaded", items);

    initialized = !!items?.length;
    list.value = items;
  }
};
function reset() {
  initialized = false;
}
defineExpose({
  reset,
});
</script>

<style lang="scss" scoped>
.base_select_by_url {
  .placeholder {
    color: $text-grey;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
