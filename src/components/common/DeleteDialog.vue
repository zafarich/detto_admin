<script setup>
import { useQuasar } from "quasar";
const $q = useQuasar();
const props = defineProps({
  confirmFn: {
    type: Function,
    default: () => ({}),
  },
  dataId: {
    type: Number || String,
    default: () => null,
  },
});
const emit = defineEmits(["update:modelValue", "confirm"]);
function open() {
  emit("update:modelValue", true);
}
function close() {
  emit("update:modelValue", false);
}

async function confirmDelete() {
  $q.loading.show();
  const data = await props.confirmFn(props.dataId);
  if (data) {
    close();
    emit("confirm", data);
  }
  $q.notify({
    progress: true,
    position: "top",
    message: "O'chirildi",
    type: "positive",
    color: "primary",
    timeout: 2000,
  });
  $q.loading.hide();
}
</script>
<template>
  <q-dialog
    :model-value="modelValue"
    @hide="close"
    class="delete_confirm_dialog"
  >
    <q-card style="width: 360px">
      <q-card-section class="items-center">
        <div class="modal_title mb-2">O'chirishni tasdiqlash</div>
        <div class="flex justify-center">
          <q-icon class="mb-1" name="warning" size="3rem" color="warning" />
        </div>
        <div class="modal_description">
          Ma'lumot o'chirilgandan keyin uni qayta tiklash imkoni majvud emas!!!
        </div>
      </q-card-section>

      <div class="footer" align="right">
        <q-btn
          no-caps
          flat
          label="Bekor qilish"
          class="mr-1"
          color="primary"
          @click="close"
        />
        <q-btn
          no-caps
          label="O'chirish"
          color="negative"
          @click="confirmDelete"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.delete_confirm_dialog {
  .modal_title {
    font-weight: 600;
    font-size: 20px;
    line-height: 29px;
    letter-spacing: -0.02em;
  }
  .modal_description {
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
    margin: 0px 15px;
    color: $grey-8;
    text-align: center;
  }
  .footer {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
