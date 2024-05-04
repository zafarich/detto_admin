<script setup>
import { nextTick, onMounted, ref } from "vue-demi";
import { useRouter, useRoute } from "vue-router";

import TheTable from "src/components/common/TheTable.vue";
import TheTableImage from "src/components/common/TheTableImage.vue";
import TableActions from "./table-cells/TableActions.vue";
import AddEditProduct from "./modules/AddEditProduct.vue";

import { useProductStore } from "src/stores/product";

const route = useRoute();
const router = useRouter();

const productStore = useProductStore();

const loading = ref(false);
const data = ref([]);

const tableBodyCells = [
  {
    component: TheTableImage,
    name: "image",
  },
  {
    component: TableActions,
    name: "t_actions",
  },
];

const tableRef = ref(null);
const addEditProductDialog = ref(null);
const editItem = ref({});
const params = ref({});

const render_key = ref(1);

async function fetchData() {
  loading.value = true;
  await nextTick();
  params.value = { ...params.value, ...tableRef.value.pagination };
  data.value = (await productStore.fetch(params.value)) || [];
  console.log("data.value", data.value);
  tableRef.value.rowsNumber = productStore.all_count;
  tableRef.value.prepareHeaders();
  loading.value = false;
}
onMounted(fetchData);

const tableSettings = {
  defaultColumnOrder: [
    "image",
    "name",
    "measure_type",
    "calories",
    "t_actions",
  ],
  formatColumns: {},
  fieldFormatColumns: {
    name: (row) => row?.title.uz,
    measure_type: (row) => row?.measure_type.title.uz,
  },
};

function productAddedOrChanged() {
  addEditProductDialog.value.close();
  resetFilterAndFetch();
}
function editData(data) {
  editItem.value = data;
  render_key.value = render_key.value + 1;
  setTimeout(() => {
    addEditProductDialog.value.open();
  }, 10);
}

function addProduct() {
  editItem.value = {};
  render_key.value = render_key.value + 1;
  setTimeout(() => {
    addEditProductDialog.value.open();
  }, 10);
}
function request(pagination) {
  params.value = { ...params.value, ...pagination };
  fetchData();
}

function resetFilterAndFetch() {
  fetchData();
}
</script>
<template>
  <q-page>
    <header class="q-page-header">
      <div class="q-page-header___left">
        <div class="title">Mahsulotlar</div>
      </div>
      <div class="q-page-header___right">
        <q-btn
          no-caps
          color="primary"
          icon-right="add"
          class="ml-auto"
          label="Mahsulot qo'shish"
          @click="addProduct"
        />
      </div>
    </header>

    <AddEditProduct
      ref="addEditProductDialog"
      :key="render_key"
      :product="editItem"
      @change="productAddedOrChanged"
    />

    <TheTable
      ref="tableRef"
      :loading="loading"
      :settings="tableSettings"
      :tableBodyCells="tableBodyCells"
      :data="data"
      :delete-fn="productStore?.deleteById"
      @fetch="request"
      @edit="editData"
      action_width="60"
    />
  </q-page>
</template>

<style></style>
