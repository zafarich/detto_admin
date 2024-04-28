<script setup>
import BaseImg from "components/UI/BaseImg.vue";
import UserSettingsDropdown from "components/partials/user/UserSettingsDropdown.vue";
import { useMainStore } from "stores/main";

const mainStore = useMainStore();

const emit = defineEmits(["toggle-left-drawer"]);
</script>

<template>
  <q-header class="main-header">
    <div class="q-page-container">
      <div class="logo-wrap" :style="`width: ${mainStore.drawerWidth}px`">
        <div class="title">
          {{ mainStore.isDrawerOpen ? "Admin" : "A" }}
        </div>
        <q-btn
          dense
          round
          icon="keyboard_double_arrow_right"
          aria-label="Menu"
          class="toggle-btn"
          :class="{ rotate: mainStore.isDrawerOpen }"
          @click="mainStore.toggleDrawer"
        />
      </div>

      <UserSettingsDropdown class="ml-auto" />
    </div>
  </q-header>
</template>

<style lang="scss" scoped>
.main-header {
  .logo-wrap {
    transition: 0.22s ease-in-out;
    border-right: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    height: 73px;
    display: flex;
    align-items: center;
    padding: 16px;
    padding-left: 22px;
    padding-right: 0;
    position: absolute;
    left: 0;
    .title {
      font-weight: 600;
      font-size: 23px;
      line-height: 27px;
    }
    .toggle-btn {
      position: absolute;
      box-shadow: 0px 0px 10px $shadow-color;
      right: -16px;
      background-color: $white;
      &.rotate {
        :deep(.q-icon) {
          rotate: 180deg;
        }
      }
    }
  }
  .organization-wrap {
    display: flex;
    .organization-logo {
      border-radius: 6px;
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .title {
      font-weight: 600;
      font-size: 14px;
      color: #000;
      max-width: 220px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .description {
      font-weight: 500;
      font-size: 12px;
      line-height: 20px;
      color: $grey-6;
    }
  }
}
</style>
