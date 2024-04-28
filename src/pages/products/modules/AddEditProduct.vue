<script setup>
import { computed, ref } from "vue-demi";

import { useQuasar } from "quasar";
import BaseImageUpload from "src/components/UI/BaseImageUpload.vue";
import BaseInput from "src/components/UI/BaseInput.vue";
import TheModal from "src/components/common/TheModal.vue";
import { onValidationError, translate } from "src/utils/helpers";
import validate from "src/utils/validate";
import { useProductStore } from "src/stores/product";
const props = defineProps({
  category: {
    type: Object,
    default: () => {},
  },
});
const $q = useQuasar();
const emit = defineEmits(["added"]);
const productCategory = useProductStore();

const formRef = ref(null);
const modalRef = ref(null);
const categoryId = ref(props.category?.id || null);
const form = ref({
  image: props.category?.image || null,
  name: {
    uz: translate(props?.category, "name") || "",
    ru: translate(props?.category, "name") || "",
  },
  slug: props.category?.slug || "",
});

async function tryToSave() {
  shouldCheckImageError.value = true;
  const hasError = !(await formRef.value.validate());
  if (hasError || !imageValidate.value) return resetValidation(5000);

  $q.loading.show();
  const fd = new FormData();

  fd.append(
    "image",
    typeof form.value.image === "string" ? null : form.value.image
  );

  fd.append("name[uz]", form.value.name.uz);
  fd.append("name[ru]", form.value.name.ru);
  fd.append("slug", form.value.slug);

  const res = categoryId.value
    ? await productCategory.updateById(categoryId.value, fd)
    : await productCategory.create(fd);

  if (!res) {
    $q.loading.hide();
    return;
  }
  resetData();

  modalRef.value.close();
  $q.notify({
    progress: true,
    position: "top",
    message: categoryId.value ? "O'zgartirildi" : "Qo'shiildi",
    type: "positive",
    color: "primary",
    timeout: 2000,
  });
  $q.loading.hide();
  emit("added");
}

let shouldCheckImageError = ref(false);
const imageValidate = computed(() => {
  if (!shouldCheckImageError.value) return true;
  return form.value.image;
});
setTimeout(() => {
  console.log("props", props?.category);
}, 1000);
function resetData() {
  resetValidation();
  form.value.image = null;
  form.value.name.uz = "";
  form.value.name.ru = "";
  form.value.slug = "";
}
let resetTimeout = 0;
function resetValidation(timeout = 0) {
  clearTimeout(resetTimeout);
  resetTimeout = setTimeout(() => {
    shouldCheckImageError.value = false;
    formRef.value?.resetValidation();
  }, timeout);
}

defineExpose({
  open() {
    modalRef.value.open();
  },
  close() {
    modalRef.value.close();
  },
});
</script>
<template>
  <TheModal
    ref="modalRef"
    :title="categoryId ? 'Kategoriyani o\'zgartirish' : 'Kategoriya qo\'shish'"
    class="add-category-modal"
  >
    <template #content>
      <q-form
        ref="formRef"
        @validation-error="onValidationError"
        class="form-row"
      >
        <div class="col full_width">
          <div class="form-label">Kategoriya rasmi</div>

          <BaseImageUpload
            v-model="form.image"
            :urlImage="form.image"
            title="Rasmni yuklang"
          />
          <div v-if="!imageValidate" class="negative_text">
            Kategoriya rasmini yuklang
          </div>
        </div>
        <div class="col">
          <div class="form-label">Nomi (UZ)</div>
          <BaseInput
            v-model="form.name.uz"
            outlined
            placeholder="Nomini kiriting"
            :rules="[validate.required]"
          />
        </div>
        <div class="col">
          <div class="form-label">Nomi (RU)</div>
          <BaseInput
            v-model="form.name.ru"
            outlined
            placeholder="Nomini kiriting"
            :rules="[validate.required]"
          />
        </div>
        <div class="col full_width">
          <div class="form-label">Slug</div>
          <BaseInput
            v-model="form.slug"
            outlined
            placeholder="Slugni kiriting"
            :rules="[validate.required]"
          />
        </div>
      </q-form>
      <footer class="flex justify-end mt-3">
        <q-btn
          :label="categoryId ? 'Saqlash' : 'Qo\'shish'"
          color="primary"
          @click="tryToSave"
        />
      </footer>
    </template>
  </TheModal>
</template>

<style lang="scss">
.add-category-modal .q-card {
  max-width: 800px;
}
</style>
