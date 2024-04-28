<script setup>
import BaseImg from "../UI/BaseImg.vue";
import { useMainStore } from "stores/main";
const mainStore = useMainStore();
const props = defineProps({
  propsData: {
    type: Object,
    default: null,
  },
});
</script>
<template>
  <BaseImg
    :src="mainStore?.baseURL + props?.propsData?.row?.image"
    :alt="props?.propsData?.row?.image + '-locale-icon'"
    width="70px"
    height="70px"
  />
</template>

<style></style>
