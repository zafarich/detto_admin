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
import { useMenuStore } from "src/stores/menu";
import BaseSelect from "src/components/UI/BaseSelect.vue";

import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  menu: {
    type: Object,
    default: () => {},
  },
  products: {
    type: Array,
    default: () => [],
  },
});
const $q = useQuasar();
const emit = defineEmits(["change"]);
const productCategory = useProductStore();
const menuStore = useMenuStore();

// const measure_types = Object.entries(MEASURE_TYPE_TEXT).map((v) => ({
//   label: v[1],
//   value: v[0],
// }));

// const measure_cup_types = Object.entries(MEASURE_CUP_TEXT).map((v) => ({
//   label: v[1],
//   value: v[0],
// }));

const formRef = ref(null);
const modalRef = ref(null);
const menu_id = ref(props.menu?.id || null);
const form = ref({
  menu_part_products: [
    {
      product: null,
      measure_cup_count: 1,
      measure_type_count: 1,
      calories: 0,
    },
  ],
});

const products_options = ref(props.products);

async function tryToSave() {
  const hasError = !(await formRef.value.validate());
  if (hasError) return resetValidation(5000);

  $q.loading.show();

  const resData = {
    menu_size_id: +route.params?.id,
    menu_type_id: props.menu?.type,
    calories: calculateAllProductCalories(),
    menu_part_products: [],
  };

  form.value.menu_part_products.forEach((product) => {
    if (!product.product) return;

    let product_item = {
      product_id: product?.product?.id,
      calories: calculateOneProductCalories(product),
    };

    if (product?.measure_cup_count) {
      product_item = {
        ...product_item,
        measure_cup_count: product.measure_cup_count,
        measure_type_count:
          product.measure_cup_count * product?.product?.measure_cup_value,
      };
    } else {
      product_item = {
        ...product_item,
        measure_type_count: product.measure_type_count,
      };
    }

    resData.menu_part_products.push(product_item);
  });

  const res = await menuStore.createMenu(resData);

  if (!res) {
    $q.loading.hide();
    return;
  }
  resetData();

  modalRef.value.close();
  $q.notify({
    progress: true,
    position: "top",
    message: "Qo'shiildi",
    type: "positive",
    color: "primary",
    timeout: 2000,
  });
  $q.loading.hide();
  emit("change");
}

function changeProduct(index) {
  const product_item = form.value?.menu_part_products?.[index]?.product;

  if (product_item?.measure_cup) {
    form.value.menu_part_products[index].measure_cup_count = 1;
    form.value.menu_part_products[index].measure_type_count = null;
  } else {
    form.value.menu_part_products[index].measure_cup_count = null;
    form.value.menu_part_products[index].measure_type_count = 1;
  }
}
function filterFn(val, update) {
  if (val === "") {
    update(() => {
      products_options.value = props.products;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    products_options.value = props.products.filter(
      (v) => v.title.toLowerCase().indexOf(needle) > -1
    );
  });
}
setTimeout(() => {
  console.log("props", props?.menu);
}, 1000);
function resetData() {
  form.value.menu_part_products = [
    {
      product: null,
      measure_cup_count: 1,
      measure_type_count: 1,
      calories: 0,
    },
  ];
  resetValidation();
}
let resetTimeout = 0;
function resetValidation(timeout = 0) {
  clearTimeout(resetTimeout);
  resetTimeout = setTimeout(() => {
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

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function calculateOneProductCalories(product) {
  let calories = 0;
  if (product?.product?.measure_cup) {
    calories =
      (product.measure_cup_count *
        product?.product?.measure_cup_value *
        product?.product?.calories) /
      100;
  } else {
    calories = product.measure_type_count * product?.product?.calories;
  }

  return parseInt(calories);
}

function calculateAllProductCalories() {
  let all = 0;

  form.value.menu_part_products.forEach((product) => {
    let calories = 0;
    if (product?.product?.measure_cup) {
      calories =
        (product.measure_cup_count *
          product?.product?.measure_cup_value *
          product?.product?.calories) /
        100;
    } else {
      calories = product.measure_type_count * product?.product?.calories;
    }

    all = all + calories;
  });

  return parseInt(all) || 0;
}

function changeCupOrCount(index, val) {
  const product = form.value.menu_part_products[index];
  const key = product?.measure_type_count
    ? "measure_type_count"
    : "measure_cup_count";
  form.value.menu_part_products[index];

  const new_value = form.value.menu_part_products[index]?.[key] + val;

  if (new_value > 0) {
    form.value.menu_part_products[index][key] = new_value;
  }
}

function addProduct() {
  form.value.menu_part_products.push({
    product: null,
    measure_cup_count: 1,
    measure_type_count: 1,
    calories: 0,
  });
}

function deleteProduct(index) {
  form.value.menu_part_products.splice(index, 1);
}
</script>
<template>
  <TheModal ref="modalRef" title="Menu qo'shish" class="add-menu-modal">
    <template #content>
      <div class="flex justify-between">
        <div class="menu_title">
          {{ capitalizeFirstLetter(menu?.title) }}
        </div>
        <div class="menu_calories">
          {{ calculateAllProductCalories() }} kkal
        </div>
      </div>
      <q-form
        ref="formRef"
        @validation-error="onValidationError"
        class="form-row"
      >
        <div class="col full_width">
          <template
            v-for="(product, index) in form?.menu_part_products"
            :key="index"
          >
            <div class="product-item-modal">
              <div class="item1">
                <div class="form-label">{{ index + 1 }} - Mahsulot</div>
                <BaseSelect
                  v-model="product.product"
                  option-label="title"
                  use-input
                  input-debounce="0"
                  @filter="filterFn"
                  outlined
                  :options="products_options"
                  :rules="[validate.required]"
                  @update:model-value="changeProduct(index)"
                />
              </div>
              <div class="item2">
                <template v-if="product.product">
                  <div class="form-label">
                    {{
                      capitalizeFirstLetter(
                        product?.product?.measure_cup?.title?.uz ||
                          product?.product?.measure_type?.title?.uz
                      )
                    }}
                  </div>
                  <div class="item2-wrap">
                    <q-btn
                      @click="changeCupOrCount(index, -0.5)"
                      outline
                      color="primary"
                      label="- 0.5"
                    />
                    <div class="title-count-cup">
                      {{
                        product?.product?.measure_cup
                          ? product?.measure_cup_count
                          : product?.measure_type_count
                      }}
                    </div>
                    <q-btn
                      @click="changeCupOrCount(index, 0.5)"
                      outline
                      color="primary"
                      label="+ 0.5"
                    />

                    <div
                      v-if="product?.product?.measure_cup"
                      class="ml-gr-title"
                    >
                      =
                      {{
                        product?.measure_cup_count *
                        product?.product?.measure_cup_value
                      }}
                      {{ product?.product?.measure_type?.title?.uz }}
                    </div>
                  </div>
                </template>
              </div>
              <div class="item3">
                <template v-if="product.product">
                  <div class="form-label">Kaloriyasi</div>
                  <div class="wrap-56">
                    {{ calculateOneProductCalories(product) }} kkal
                  </div>
                </template>
              </div>
              <div class="item4">
                <div class="form-label">.</div>
                <div class="wrap-56">
                  <q-btn
                    @click="deleteProduct(index)"
                    v-if="form.menu_part_products?.length > 1"
                    icon="delete"
                    dense
                    flat
                    color="negative"
                  />
                </div>
              </div>
            </div>
          </template>

          <q-btn
            @click="addProduct"
            label="Mahsulot qo'shish"
            icon="add"
            outline
            color="primary"
            class="mt-4"
          />
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
  font-size: 22px;
  font-weight: 600;
}
.menu_calories {
  font-weight: 600;
  font-size: 18px;
  color: $primary;
}

.product-item-modal {
  display: flex;
  margin: 0px -15px;
  margin-bottom: 20px;
  .item1 {
    width: 40%;
    padding: 0px 15px;
  }
  .item2 {
    width: 40%;
    padding: 0px 15px;
    .ml-gr-title {
      margin-left: 12px;
      font-size: 16px;
      font-weight: 600;
    }
    .item2-wrap {
      display: flex;
      align-items: center;
      height: 56px;
      .title-count-cup {
        width: 56px;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
      }
    }
  }
  .item3 {
    width: 10%;
    padding: 0px 15px;
    .wrap-56 {
      height: 56px;
      display: flex;
      align-items: center;
      font-size: 16px;
    }
  }
  .item4 {
    width: 10%;
    padding: 0px 15px;
    .wrap-56 {
      height: 56px;
      display: flex;
      align-items: center;
      font-size: 16px;
    }
  }
}
</style>
