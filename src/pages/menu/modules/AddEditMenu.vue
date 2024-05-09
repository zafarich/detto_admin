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
  PER_TEXT_STATUS,
  MEASURE_TYPE_3,
  MEASURE_TYPE_2,
} from "src/types/productTypes";
import { useProductStore } from "src/stores/product";
import BaseSelect from "src/components/UI/BaseSelect.vue";

const props = defineProps({
  menu: {
    type: Object,
    default: () => {},
  },
});
const $q = useQuasar();
const emit = defineEmits(["change"]);
const productCategory = useProductStore();

const measure_types = Object.entries(MEASURE_TYPE_TEXT).map((v) => ({
  label: v[1],
  value: v[0],
}));

const measure_cup_types = Object.entries(MEASURE_CUP_TEXT).map((v) => ({
  label: v[1],
  value: v[0],
}));

const permission_types = Object.entries(PER_TEXT_STATUS).map((v) => ({
  label: v[1],
  value: v[0],
}));

const permission_type = [];

const formRef = ref(null);
const modalRef = ref(null);
const menu_id = ref(props.menu?.id || null);
const form = ref({
  image: props.menu?.image || null,
  title: {
    uz: props?.menu?.title?.uz || "",
    ru: props?.menu?.title?.ru || "",
  },
  measure_type: props?.menu?.measure_type?.id
    ? measure_types.find((item) => item.value == props?.menu?.measure_type?.id)
    : measure_types.find((item) => item.value == 2),
  calories: props?.menu?.calories || "",
  permission_description: {
    uz: props?.menu?.permission_description?.uz || "",
    ru: props?.menu?.permission_description?.ru || "",
  },
  measure_cup: props?.menu?.measure_cup?.id
    ? measure_cup_types.find((item) => item.value == 1)
    : null,
  measure_cup_value: props?.menu?.measure_cup_value || "",
});

async function tryToSave() {
  const hasError = !(await formRef.value.validate());
  if (hasError) return resetValidation(5000);

  $q.loading.show();
  const fd = new FormData();

  fd.append(
    "image",
    typeof form.value.image === "string" ? null : form.value.image
  );

  fd.append("title[uz]", form.value.title.uz);
  fd.append("title[ru]", form.value.title.ru);
  fd.append("measure_type_id", form.value.measure_type.value);
  fd.append("calories", form.value.calories);
  fd.append("measure_cup_id", form.value.measure_cup.value || "");
  fd.append("measure_cup_value", form.value.measure_cup_value);
  fd.append("permission_description[uz]", form.value.permission_description.uz);
  fd.append("permission_description[ru]", form.value.permission_description.ru);

  const res = menu_id.value
    ? await productCategory.updateById(menu_id.value, fd)
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
    message: menu_id.value ? "O'zgartirildi" : "Qo'shiildi",
    type: "positive",
    color: "primary",
    timeout: 2000,
  });
  $q.loading.hide();
  emit("change");
}

setTimeout(() => {
  console.log("props", props?.menu);
}, 1000);
function resetData() {
  resetValidation();
  form.value.image = null;
  form.value.title.uz = "";
  form.value.title.ru = "";
  form.value.measure_type = measure_types.find((item) => item.value == 2);
  form.value.calories = "";
  form.value.permission_description.uz = "";
  form.value.permission_description.ru = "";
  form.value.measure_cup = measure_cup_types.find((item) => item.value == 1);
  form.value.measure_cup_value = "";
}
let resetTimeout = 0;
function resetValidation(timeout = 0) {
  clearTimeout(resetTimeout);
  resetTimeout = setTimeout(() => {
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
  3: "piyoladagi",
  4: "choy qoshiqdagi",
};

const permission_texts = {
  one_week: {
    uz: "haftada 1 marta",
    ru: "в неделю один раз",
  },
  one_10day: {
    uz: "10 kunda 1 marta",
    ru: "1 раз в 10 дней",
  },
  one_2week: {
    uz: "2 haftada 1 marta",
    ru: "1 раз в 2 недели",
  },
};

function setDefaultPermissionText(item) {
  console.log("item", item);
  form.value.permission_description = permission_texts[item.value];
}

function changeType() {
  form.value.measure_cup_value = "";
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
    :title="menu_id ? 'Menuni o\'zgartirish' : 'Menu qo\'shish'"
    class="add-menu-modal"
  >
    <template #content>
      <div class="flex justify-between">
        <div class="menu_title">{{ menu?.menu_type?.title?.uz }}</div>
        <div class="menu_calories">{{ menu?.calories }} kkal</div>
      </div>
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
            @update:model-value="changeType"
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
              Bitta {{ weight_cup_title[form.measure_cup?.value] }} og'irligi
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

        <div class="col">
          <div class="form-label">Cheklov uchun izoh (UZ)</div>
          <BaseInput
            v-model="form.permission_description.uz"
            type="textarea"
            outlined
            placeholder="Kiriting"
            :rules="[
              form.permission_description.ru?.length ? validate.required : true,
            ]"
          />
        </div>

        <div class="col">
          <div class="form-label">Cheklov uchun izoh (RU)</div>
          <BaseInput
            v-model="form.permission_description.ru"
            type="textarea"
            outlined
            placeholder="Kiriting"
            :rules="[
              form.permission_description.uz?.length ? validate.required : true,
            ]"
          />
        </div>

        <div class="col full_width">
          <template v-for="item in permission_types" :key="item.value">
            <q-chip
              @click="setDefaultPermissionText(item)"
              clickable
              color="primary"
              text-color="white"
            >
              {{ item.label }}
            </q-chip>
          </template>
        </div>
      </q-form>
      <footer class="flex justify-end mt-3">
        <q-btn
          :label="menu_id ? 'Saqlash' : 'Qo\'shish'"
          color="primary"
          @click="tryToSave"
        />
      </footer>
    </template>
  </TheModal>
</template>

<style lang="scss">
.add-menu-modal .q-card {
  max-width: 1000px;
}
.menu_title {
  font-size: 18px;
  font-weight: 600;
}
.menu_calories {
  font-weight: 600;
  font-size: 18px;
  color: $primary;
}
</style>
