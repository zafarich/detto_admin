<script setup>
import { ref, watch } from "vue-demi";
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
const dialog = ref(false);

defineExpose({
  close() {
    dialog.value = false;
  },
  open() {
    dialog.value = true;
  },
});
</script>
<template>
  <q-dialog v-model="dialog" class="the-modal">
    <q-card>
      <q-btn
        icon="close"
        flat
        dense
        round
        class="close-btn"
        color="grey-5"
        v-close-popup
      />
      <div class="card_wrap">
        <div class="title mb-3">{{ props.title }}</div>

        <div class="modal-body">
          <slot name="content"></slot>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
.the-modal {
  .title {
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
  }
  .q-card {
    width: 100%;
    position: relative;
    min-height: 300px;
    .close-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
    }
  }
  .card_wrap {
    overflow-y: auto;
    padding: 28px 34px;
    height: 100%;
  }
}
</style>
