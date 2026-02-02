<template>
  <v-container class="px-7">
    <div class="table-title">Instance</div>
    <v-row>
      <v-col cols="2" class="d-flex flex-column align-center">
        <div style="width: 80px">
          <pie
            :data="{
              datasets: [
                {
                  data: [10, 90],
                  backgroundColor: ['#2C94D2', '#C4C4C4'],
                  borderWidth: 0,
                },
              ],

              // These labels appear in the legend and in the tooltips when hovering different arcs
              labels: ['used', 'remaining'],
            }"
            :options="{
              legend: {
                display: false,
              },
              tooltips: {
                enabled: false,
              },
            }"
          />
        </div>

        <div class="usage-title pt-4">Instance</div>
      </v-col>
      <v-col cols="2" class="d-flex flex-column align-center">
        <div style="width: 80px">
          <pie
            :data="{
              datasets: [
                {
                  data: [10, 90],
                  backgroundColor: ['#2C94D2', '#C4C4C4'],
                  borderWidth: 0,
                },
              ],

              // These labels appear in the legend and in the tooltips when hovering different arcs
              labels: ['used', 'remaining'],
            }"
            :options="{
              legend: {
                display: false,
              },
              tooltips: {
                enabled: false,
              },
            }"
          />
        </div>
        <div class="usage-title pt-4">VCPUs</div>
      </v-col>
      <v-col cols="2" class="d-flex flex-column align-center">
        <div style="width: 80px">
          <pie
            :data="{
              datasets: [
                {
                  data: [10, 90],
                  backgroundColor: ['#2C94D2', '#C4C4C4'],
                  borderWidth: 0,
                },
              ],

              // These labels appear in the legend and in the tooltips when hovering different arcs
              labels: ['used', 'remaining'],
            }"
            :options="{
              legend: {
                display: false,
              },
              tooltips: {
                enabled: false,
              },
            }"
          />
        </div>
        <div class="usage-title pt-4">RAM</div>
      </v-col>
    </v-row>
    <div class="table-title">Storage</div>
    <v-row>
      <v-col cols="2" class="d-flex flex-column align-center">
        <div style="width: 80px">
          <pie
            :data="{
              datasets: [
                {
                  data: [10, 90],
                  backgroundColor: ['#2C94D2', '#C4C4C4'],
                  borderWidth: 0,
                },
              ],

              // These labels appear in the legend and in the tooltips when hovering different arcs
              labels: ['used', 'remaining'],
            }"
            :options="{
              legend: {
                display: false,
              },
              tooltips: {
                enabled: false,
              },
            }"
          />
        </div>
        <div class="usage-title pt-4">Storage</div>
      </v-col>
      <v-col cols="2" class="d-flex flex-column align-center">
        <div style="width: 80px">
          <pie
            :data="{
              datasets: [
                {
                  data: [10, 90],
                  backgroundColor: ['#2C94D2', '#C4C4C4'],
                  borderWidth: 0,
                },
              ],

              // These labels appear in the legend and in the tooltips when hovering different arcs
              labels: ['used', 'remaining'],
            }"
            :options="{
              legend: {
                display: false,
              },
              tooltips: {
                enabled: false,
              },
            }"
          />
        </div>
        <div class="usage-title pt-4">Snapshots</div>
      </v-col>
      <v-col cols="2" class="d-flex flex-column align-center">
        <div style="width: 80px">
          <pie
            :data="{
              datasets: [
                {
                  data: [10, 90],
                  backgroundColor: ['#2C94D2', '#C4C4C4'],
                  borderWidth: 0,
                },
              ],

              // These labels appear in the legend and in the tooltips when hovering different arcs
              labels: ['used', 'remaining'],
            }"
            :options="{
              legend: {
                display: false,
              },
              tooltips: {
                enabled: false,
              },
            }"
          />
        </div>
        <div class="usage-title pt-4">Volume Storage</div>
      </v-col>
    </v-row>
    <div class="table-title">Network</div>
    <v-row>
      <v-col cols="2" class="d-flex flex-column align-center">
        <div style="width: 80px">
          <pie
            :data="{
              datasets: [
                {
                  data: [10, 90],
                  backgroundColor: ['#2C94D2', '#C4C4C4'],
                  borderWidth: 0,
                },
              ],

              // These labels appear in the legend and in the tooltips when hovering different arcs
              labels: ['used', 'remaining'],
            }"
            :options="{
              legend: {
                display: false,
              },
              tooltips: {
                enabled: false,
              },
            }"
          />
        </div>

        <div class="usage-title pt-4">Floating IP</div>
      </v-col>
      <v-col cols="2" class="d-flex flex-column align-center">
        <div style="width: 80px">
          <pie
            :data="{
              datasets: [
                {
                  data: [10, 90],
                  backgroundColor: ['#2C94D2', '#C4C4C4'],
                  borderWidth: 0,
                },
              ],

              // These labels appear in the legend and in the tooltips when hovering different arcs
              labels: ['used', 'remaining'],
            }"
            :options="{
              legend: {
                display: false,
              },
              tooltips: {
                enabled: false,
              },
            }"
          />
        </div>
        <div class="usage-title pt-4">Security Groups</div>
      </v-col>
      <v-col cols="2" class="d-flex flex-column align-center">
        <div style="width: 80px">
          <pie
            :data="{
              datasets: [
                {
                  data: [10, 90],
                  backgroundColor: ['#2C94D2', '#C4C4C4'],
                  borderWidth: 0,
                },
              ],

              // These labels appear in the legend and in the tooltips when hovering different arcs
              labels: ['used', 'remaining'],
            }"
            :options="{
              legend: {
                display: false,
              },
              tooltips: {
                enabled: false,
              },
            }"
          />
        </div>
        <div class="usage-title pt-4">Networks</div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import pie from "./pie.vue";

export default defineComponent({
  components: { pie },
});
</script>
<style scoped>
.table-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
  padding-top: 20px;
  padding-bottom: 30px;
}

.usage-title {
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 140%;
  /* or 22px */

  text-align: center;

  /* Primary/Font */

  color: #556272;
}

.usage-detail {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 140%;
  /* identical to box height, or 20px */

  text-align: center;

  /* Primary/ Blue Grey */

  color: #a5b3bf;
}

.pie {
  position: absolute;
  top: 344px;
  left: 92px;
}
</style>