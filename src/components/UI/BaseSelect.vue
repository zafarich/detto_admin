<template>
  <q-select
    class="base-select"
    hide-bottom-space
    dropdown-icon="keyboard_arrow_down"
    transition-show="jump-up"
    transition-hide="jump-down"
    :transition-duration="50"
    lazy-rules="ondemand"
    v-bind="attrs"
    options-dense
    @update:model-value="change"
    :model-value="modelValue"
  >
    <template v-if="selected && modelValue" #selected>
      {{ modelValue?.label || "" }}
    </template>
    <template v-else-if="placeholder && !modelValue" #selected>
      <div class="placeholder">
        <span>{{ placeholder }}</span>
        <span v-if="required" class="text-red">*</span>
      </div>
    </template>
    <template v-if="!placeholder" #label>
      <span>{{ label }}</span>
    </template>
    <template v-if="append" #append>
      <slot name="append" />
    </template>
    <template v-if="prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="option" #option="item">
      <slot name="option" v-bind="item" />
    </template>
  </q-select>
</template>

<script setup>
import { useAttrs } from "vue-demi";

const attrs = useAttrs();

// const props =
defineProps({
  modelValue: [Number, String, Object],
  placeholder: String,
  required: {
    type: Boolean,
    default: false,
  },
  append: {
    type: Boolean,
    default: false,
  },
  prepend: {
    type: Boolean,
    default: false,
  },
  option: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

function change(v) {
  emit("update:modelValue", v);
}
</script>

<style lang="scss">
.base-select {
  .q-icon {
    color: $primary;
  }
  &.q-field--standout.q-field--highlighted {
    .q-field__append {
      color: $grey-7 !important;
    }
    .q-field__native {
      color: $dark;
    }
  }
  .placeholder {
    color: $text-grey;
    font-size: 16px;
    font-weight: 500;
  }
  .itemsCount {
    background-color: #0f0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 14px;
    color: #000;
    text-align: center;
  }
}
</style>
