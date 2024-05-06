<script setup>
import { nextTick, onMounted, ref } from "vue-demi";
import { useRouter, useRoute } from "vue-router";

import TheTable from "src/components/common/TheTable.vue";
import TableActions from "./table-cells/TableActions.vue";

import { useMenuStore } from "src/stores/menu";

const route = useRoute();
const router = useRouter();

const menuStore = useMenuStore();

const loading = ref(false);
const data = ref([]);

const tableBodyCells = [
  {
    component: TableActions,
    name: "t_actions",
  },
];

const tableRef = ref(null);

const params = ref({});

const render_key = ref(1);

async function fetchData() {
  loading.value = true;
  await nextTick();
  params.value = { ...params.value, ...tableRef.value.pagination };
  data.value = (await menuStore.getMenuSizes(params.value)) || [];
  console.log("data.value", data.value);
  tableRef.value.rowsNumber = menuStore.all_count;
  tableRef.value.prepareHeaders();
  loading.value = false;
}
onMounted(fetchData);

const tableSettings = {
  defaultColumnOrder: ["title", "t_actions"],
  formatColumns: {},
  fieldFormatColumns: {},
};

function request(pagination) {
  params.value = { ...params.value, ...pagination };
  fetchData();
}
</script>
<template>
  <q-page>
    <header class="q-page-header">
      <div class="q-page-header___left">
        <div class="title">Menular</div>
      </div>
    </header>

    <TheTable
      ref="tableRef"
      :loading="loading"
      :settings="tableSettings"
      :tableBodyCells="tableBodyCells"
      :data="data"
      @fetch="request"
      action_width="60"
    />
  </q-page>
</template>

<style></style>
