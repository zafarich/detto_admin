import * as api from "src/api/product";
import { defineStore } from "pinia";
import { ref } from "vue-demi";

export const useProductStore = defineStore("product", () => {
  const all_count = ref({});

  async function fetch(params = { limit: 20 }) {
    const res = await api.fetch(params);
    all_count.value = res.total_items;
    return res?.result;
  }

  async function fetchAll() {
    const res = await api.fetchAll();
    return res;
  }

  async function create(payload) {
    const res = await api.create(payload);
    return res;
  }
  async function updateById(id, payload) {
    const res = await api.updateById(id, payload);
    return res;
  }

  async function deleteById(id) {
    const res = await api.deleteById(id);
    return res;
  }

  return {
    fetch,
    fetchAll,
    all_count,
    create,
    deleteById,
    updateById,
  };
});
