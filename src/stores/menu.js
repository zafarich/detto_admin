import * as api from "src/api/menu";
import { defineStore } from "pinia";
import { ref } from "vue-demi";

export const useMenuStore = defineStore("menu", () => {
  const all_count = ref({});

  async function getMenuSizes(params = { limit: 20 }) {
    const res = await api.getMenuSizes(params);
    all_count.value = res.total_items;
    return res?.result;
  }
  async function getMenuDetail(id) {
    const res = await api.getMenuDetail(id);
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
    getMenuSizes,
    getMenuDetail,
    all_count,
    create,
    deleteById,
    updateById,
  };
});
