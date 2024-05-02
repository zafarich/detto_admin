<script setup>
import { nextTick, onMounted, ref } from "vue-demi";
import { useRouter, useRoute } from "vue-router";

import TheTable from "src/components/common/TheTable.vue";
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
    component: TableActions,
    name: "t_actions",
  },
];

const tableRef = ref(null);
const addEditProductDialog = ref(false);
const editItem = ref({});
const params = ref({});

async function fetchData() {
  loading.value = true;
  await nextTick();
  params.value = { ...params.value, ...tableRef.value.pagination };
  // data.value = (await productStore.fetch(params.value)) || [];
  data.value = [
    {
      name: "Grechka",
      measure_type: "gram",
      calories: 140,
    },
  ];
  tableRef.value.rowsNumber = productStore.all_count;
  tableRef.value.prepareHeaders();
  loading.value = false;
}
onMounted(fetchData);

const tableSettings = {
  defaultColumnOrder: ["name", "measure_type", "calories", "t_actions"],
  formatColumns: {},
  fieldFormatColumns: {},
};

function productAddedOrChanged() {
  // addEditProductDialog.value = false;
  resetFilterAndFetch();
}
function editData(data) {
  editItem.value = data;
  addEditProductDialog.value = true;
}
function request(pagination) {
  params.value = { ...params.value, ...pagination };
  fetchData();
}

function resetFilterAndFetch() {}
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
          @click="
            editItem = {};
            addEditProductDialog = true;
          "
        />
      </div>
    </header>

    <AddEditProduct
      :key="addEditProductDialog"
      :data="editItem"
      v-model="addEditProductDialog"
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
