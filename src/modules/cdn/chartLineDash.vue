<template>
  <div style="height: 300px">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ["data", "options"],
  mounted() {
    this.renderChart(this.data, this.options);
  },
  watch: {
    data: {
      deep: true,
      handler(newData) {
        this.renderChart(newData, this.options);
      },
    },
    options: {
      deep: true,
      handler(newOptions) {
        this.renderChart(this.data, newOptions);
      },
    },
  },
};
</script>
