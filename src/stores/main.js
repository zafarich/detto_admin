import { defineStore } from "pinia";
import { ref } from "vue-demi";

export const useMainStore = defineStore("main", () => {
  const baseURL = process.env.API || "";

  const openDrawerWidth = 240;
  const closeDrawerWidth = 67;
  const isDrawerOpen = ref(true);
  const drawerWidth = ref(openDrawerWidth);

  return {
    baseURL,
    isDrawerOpen,
    drawerWidth,
    toggleDrawer() {
      isDrawerOpen.value = !isDrawerOpen.value;
      drawerWidth.value = isDrawerOpen.value
        ? openDrawerWidth
        : closeDrawerWidth;
    },
  };
});
