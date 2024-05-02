<script setup>
import { computed, ref } from "vue-demi";

import { useQuasar } from "quasar";
import BaseImageUpload from "src/components/UI/BaseImageUpload.vue";
import BaseInput from "src/components/UI/BaseInput.vue";
import TheModal from "src/components/common/TheModal.vue";
import { onValidationError, translate } from "src/utils/helpers";
import validate from "src/utils/validate";
import {
  MEASURE_TYPE_TEXT,
  MEASURE_CUP_TEXT,
  MEASURE_TYPE_3,
  MEASURE_TYPE_2,
} from "src/types/productTypes";
import { useProductStore } from "src/stores/product";
import BaseSelect from "src/components/UI/BaseSelect.vue";

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
});
const $q = useQuasar();
const emit = defineEmits(["added"]);
const productCategory = useProductStore();

const measure_types = Object.entries(MEASURE_TYPE_TEXT).map((v) => ({
  label: v[1],
  value: v[0],
}));

const measure_cup_types = Object.entries(MEASURE_CUP_TEXT).map((v) => ({
  label: v[1],
  value: v[0],
}));

const formRef = ref(null);
const modalRef = ref(null);
const product_id = ref(props.product?.id || null);
const form = ref({
  image: props.product?.image || null,
  title: {
    uz: props?.product?.title?.uz || "",
    ru: props?.product?.title?.ru || "",
  },
  measure_type: props?.product?.measure_type?.id
    ? {
        value: props?.product?.measure_type?.id,
        label: props?.product?.measure_type?.title?.uz,
      }
    : measure_types.find((item) => item.value == 2),
  calories: props?.product?.calories || "",
  measure_description: props?.product?.measure_description || "",
  permission_description: props?.product?.permission_description || "",
  measure_cup:
    props?.product?.measure_cup?.id ||
    measure_cup_types.find((item) => item.value == 1),
  measure_cup_value: props?.product?.measure_cup_value || "",
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

  fd.append("title[uz]", form.value.title.uz);
  fd.append("title[ru]", form.value.title.ru);
  fd.append("measure_type", form.value.measure_type);
  fd.append("calories", form.value.calories);
  fd.append("measure_cup", form.value.measure_cup);
  fd.append("measure_cup_value", form.value.measure_cup_value);
  fd.append("measure_description", form.value.measure_description);
  fd.append("permission_description", form.value.permission_description);

  const res = product_id.value
    ? await productCategory.updateById(product_id.value, fd)
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
    message: product_id.value ? "O'zgartirildi" : "Qo'shiildi",
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
  console.log("props", props?.product);
}, 1000);
function resetData() {
  resetValidation();
  (form.value.image = null), (form.value.title.uz = "");
  form.value.title.ru = "";
  form.value.measure_type = null;
  form.value.calories = "";
  form.value.measure_description = "";
  form.value.permission_description = "";
  form.value.measure_cup = null;
  form.value.measure_cup_value = "";
}
let resetTimeout = 0;
function resetValidation(timeout = 0) {
  clearTimeout(resetTimeout);
  resetTimeout = setTimeout(() => {
    shouldCheckImageError.value = false;
    formRef.value?.resetValidation();
  }, timeout);
}

const calory_title = {
  1: "1 donadagi",
  2: "100 gramdagi",
  3: "100 ml dagi",
  4: "1 bo'lakdagi",
};

const weight_cup_title = {
  1: "osh qoshiqdagi",
  2: "piyoladagi",
};

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
    :title="product_id ? 'Mahsulotni o\'zgartirish' : 'Mahsulot qo\'shish'"
    class="add-category-modal"
  >
    <template #content>
      <q-form
        ref="formRef"
        @validation-error="onValidationError"
        class="form-row"
      >
        <div class="col full_width">
          <div class="form-label">Mahsulot rasmi</div>

          <BaseImageUpload
            v-model="form.image"
            :urlImage="form.image"
            title="Rasmni yuklang"
          />
          <div v-if="!imageValidate" class="negative_text">
            Mahsulot rasmini yuklang
          </div>
        </div>
        <div class="col">
          <div class="form-label">Nomi (UZ)</div>
          <BaseInput
            v-model="form.title.uz"
            outlined
            :rules="[validate.required]"
            placeholder="Nomini kiriting"
          />
        </div>
        <div class="col">
          <div class="form-label">Nomi (RU)</div>
          <BaseInput
            v-model="form.title.ru"
            outlined
            placeholder="Nomini kiriting"
            :rules="[validate.required]"
          />
        </div>

        <div class="col">
          <div class="form-label">Turi</div>
          <BaseSelect
            v-model="form.measure_type"
            placeholder="Turini kiriting"
            outlined
            :options="measure_types"
            :rules="[validate.required]"
          />
        </div>

        <div class="col">
          <div class="form-label">
            Kaloriyasi ( {{ calory_title[form.measure_type?.value] }} )
          </div>
          <BaseInput
            v-model="form.calories"
            outlined
            placeholder="Kaloriyani kiriting"
            mask="#####"
            :rules="[validate.required]"
          />
        </div>

        <template v-if="form.measure_type.value == MEASURE_TYPE_2">
          <div class="col">
            <div class="form-label">O'lchov narsasi</div>
            <BaseSelect
              v-model="form.measure_cup"
              placeholder="Tanlang"
              outlined
              :options="measure_cup_types"
              :rules="[validate.required]"
            />
          </div>

          <div class="col">
            <div class="form-label">
              Bitta {{ weight_cup_title[form.measure_cup.value] }} og'irligi
              gramda
            </div>
            <BaseInput
              v-model="form.measure_cup_value"
              outlined
              placeholder="Kiriting"
              mask="#####"
              :rules="[validate.required]"
            />
          </div>
        </template>
      </q-form>
      <footer class="flex justify-end mt-3">
        <q-btn
          :label="product_id ? 'Saqlash' : 'Qo\'shish'"
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
