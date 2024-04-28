<script setup>
import { ref, computed } from "vue-demi";

import { useMainStore } from "stores/main";
const mainStore = useMainStore();

const drawer = ref(false);
const menu = ref([
  {
    title: "Dashboard",
    to: "/",
    icon: "dashboard",
    name: "dashboard",
  },
  {
    title: "Mahsulotlar",
    to: "/products",
    icon: "inventory",
    name: "products",
  },
  {
    title: "Menyular",
    to: "/menu",
    icon: "restaurant_menu",
    name: "menu",
  },
]);
const navList = computed(() => {
  return menu.value;
});

function handleClickExpansionItem(v) {
  if (!v?.items) {
    menu.value.forEach((el) => {
      if (el.items) el.value = false;
    });
  }
}
</script>
<template>
  <q-drawer
    v-model="drawer"
    show-if-above
    bordered
    :width="mainStore.drawerWidth"
    class="left-drawer"
  >
    <q-scroll-area style="height: 100vh">
      <q-list>
        <q-expansion-item
          v-for="nav in navList"
          :key="nav.title"
          v-model="nav.value"
          :to="nav.to"
          exact
          class="nav-item"
          :expand-icon-class="nav?.items ? '' : 'hide'"
          @click="handleClickExpansionItem(nav)"
        >
          <template #header>
            <q-icon v-if="nav.icon" :name="nav.icon" :class="[nav.name]" />
            <span class="title">
              {{ nav.title }}
            </span>
          </template>
          <q-item
            clickable
            v-ripple
            v-for="item in nav?.items"
            :key="item.title"
            :to="item.to"
            class="nav-item-child"
          >
            <span class="title">
              {{ item.title }}
            </span>
          </q-item>
        </q-expansion-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<style lang="scss" scoped>
.q-drawer-container {
  &:deep(.q-drawer--left) {
    transition: 0.22s ease-in-out;
    border-right: 1px solid $border-color;
    .q-scrollarea {
      height: calc(100vh - 73px) !important;
    }
    .q-item {
      display: flex;
      align-items: center;
      padding-left: 22px;
      .q-icon {
        font-size: 22px;
        color: $grey-6;
      }
      .title {
        font-weight: 600;
        font-size: 14px;
        line-height: 17px;
        margin-left: 22px;
      }
      .q-item__section--side {
        margin-left: auto;
        padding: 0;
        .q-icon {
          font-size: 26px;
        }
      }
    }
    .q-item.q-router-link--active,
    .q-item--active {
      i {
        color: $primary;
      }
    }
  }
}
</style>
