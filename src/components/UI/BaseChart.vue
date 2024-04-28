<template>
  <div :id="chartName" width="100%" style="min-height: 150px" />
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue-demi";
import ApexCharts from "apexcharts";

const props = defineProps({
  chartName: {
    type: String,
    default: "canvas",
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});
let chart = null;
onMounted(() => {
  const ctx = document.getElementById(props.chartName);

  chart = new ApexCharts(ctx, props.options);

  chart.render();
});

onBeforeUnmount(() => chart.destroy());
</script>

<style scoped></style>
