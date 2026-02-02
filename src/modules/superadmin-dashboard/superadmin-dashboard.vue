<template>
  <v-row fluid>
    <v-col cols="12">
      <v-card flat class="rounded-lg px-7 py-4">
        <v-card-text class="pa-0">
          <v-row>
            <v-col>
              <div class="headline font-weight-bold font--text">
                Instance Usage
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex flex-row align-center">
              <svg
                class="donut-circle"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  fill="white"
                  stroke="#F2994A"
                  stroke-width="4"
                />
              </svg>
              <p class="pl-2 mb-0" style="font-weight:600">CPU</p>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-menu

                offset-y
                :close-on-click="true"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    depressed
                    :ripple="false"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    style="border: 1px solid #ece9f1"
                  >
                    <p class="black--text mb-0" style="font-weight: 400">
                      {{ range.start.toLocaleDateString("id-ID") }} -
                      {{ range.end.toLocaleDateString("id-ID") }}
                    </p>
                    <v-icon class="ml-2" style="width: 13px; height: 13px"
                    >$vuetify.icons.calendarIcon
                    </v-icon
                    >
                  </v-btn>
                </template>
                <vc-date-picker
                  @dayclick="dayclick($event)"
                  v-model="range"
                  is-range
                />
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <custline ref="cpuusage" id="cpuusage" :height="null"></custline>
            </v-col>
          </v-row>
          <v-row class="mt-7">
            <v-col class="d-flex flex-row align-center">
              <svg
                class="donut-circle"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  fill="white"
                  stroke="#2C94D2"
                  stroke-width="4"
                />
              </svg>
              <p class="pl-2 mb-0" style="font-weight:600">RAM</p>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-menu

                offset-y
                :close-on-click="true"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    depressed
                    :ripple="false"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    style="border: 1px solid #ece9f1"
                  >
                    <p class="black--text mb-0" style="font-weight: 400">
                      {{ range.start.toLocaleDateString("id-ID") }} -
                      {{ range.end.toLocaleDateString("id-ID") }}
                    </p>
                    <v-icon class="ml-2" style="width: 13px; height: 13px"
                    >$vuetify.icons.calendarIcon
                    </v-icon
                    >
                  </v-btn>
                </template>
                <vc-date-picker
                  @dayclick="dayclick($event)"
                  v-model="range"
                  is-range
                />
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <custline
                id="ramusage"
                ref="ramusage"
                :height="null"
                :data="data2"
                :options="options2"
              ></custline>
            </v-col>
          </v-row>
          <v-row class="mt-7">
            <v-col class="d-flex flex-row align-center">
              <svg
                class="donut-circle"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  fill="white"
                  stroke="#BB6BD9"
                  stroke-width="4"
                />
              </svg>
              <p class="pl-2 mb-0" style="font-weight:600">Network</p>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-menu

                offset-y
                :close-on-click="true"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    depressed
                    :ripple="false"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    style="border: 1px solid #ece9f1"
                  >
                    <p class="black--text mb-0" style="font-weight: 400">
                      {{ range.start.toLocaleDateString("id-ID") }} -
                      {{ range.end.toLocaleDateString("id-ID") }}
                    </p>
                    <v-icon class="ml-2" style="width: 13px; height: 13px"
                    >$vuetify.icons.calendarIcon
                    </v-icon
                    >
                  </v-btn>
                </template>
                <vc-date-picker
                  @dayclick="dayclick($event)"
                  v-model="range"
                  is-range
                />
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <custline
                id="networkusage"
                ref="networkusage"
                :height="null"
                :data="data3"
                :options="options3"
              ></custline>
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card flat class="rounded-lg chart3">
        <v-card-text>
          <v-row>
            <v-col>
              <div class="headline font-weight-bold font--text">
                Storage Usage
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex flex-row align-center">
              <svg
                class="donut-circle"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  fill="white"
                  stroke="#27AE60"
                  stroke-width="4"
                />
              </svg>
              <p class="pl-2 mb-0" style="font-weight:600">Memory</p>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-menu

                offset-y
                :close-on-click="true"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    depressed
                    :ripple="false"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    style="border: 1px solid #ece9f1"
                  >
                    <p class="black--text mb-0" style="font-weight: 400">
                      {{ range.start.toLocaleDateString("id-ID") }} -
                      {{ range.end.toLocaleDateString("id-ID") }}
                    </p>
                    <v-icon class="ml-2" style="width: 13px; height: 13px"
                    >$vuetify.icons.calendarIcon
                    </v-icon
                    >
                  </v-btn>
                </template>
                <vc-date-picker
                  @dayclick="dayclick($event)"
                  v-model="range"
                  is-range
                />
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <custline ref="storageusage" id="storageusage" :height="null"></custline>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card flat class="rounded-lg chart3">
        <v-card-text>
          <v-row>
            <v-col>
              <div class="headline font-weight-bold font--text">
                Object Storage Usage
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex flex-row align-center">
              <svg
                class="donut-circle"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  fill="white"
                  stroke="#EB5757"
                  stroke-width="4"
                />
              </svg>
              <p class="pl-2 mb-0" style="font-weight:600">Memory</p>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-menu

                offset-y
                :close-on-click="true"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    depressed
                    :ripple="false"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    style="border: 1px solid #ece9f1"
                  >
                    <p class="black--text mb-0" style="font-weight: 400">
                      {{ range.start.toLocaleDateString("id-ID") }} -
                      {{ range.end.toLocaleDateString("id-ID") }}
                    </p>
                    <v-icon class="ml-2" style="width: 13px; height: 13px"
                    >$vuetify.icons.calendarIcon
                    </v-icon
                    >
                  </v-btn>
                </template>
                <vc-date-picker
                  @dayclick="dayclick($event)"
                  v-model="range"
                  is-range
                />
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <custline ref="objectstorageusage" id="objectstorageusage" :height="null"></custline>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import moment from "moment";

import line from "./line.vue";

interface ChartInterface extends Vue {
  renderChart: any;
}

export default defineComponent({
  data() {
    const labels: Array<string> = ['']
    let d = moment().subtract(41, 'day')
    for (let i = 1; i < 41; i++) {
      if (i % 5 == 0) {
        labels.push(d.format('DD/MM/YYYY'))
      } else {
        labels.push('')
      }
      d.add(1, 'day')
    }
    const generateHex = (hex: string | number, point: number) => {
      return labels.map((e, i) => {
        if (i == point) return hex;
        else return null;
      });
    };
    const generateDataset = (
      color: string,
      data: Array<number>
    ): {
      pointBorderColor: any;
      pointBackgroundColor: any;
      pointRadius: any;
      pointBorderWidth: any;
      data: any;
      borderColor: any;
      fill?: any;
      backgroundColor: any;
    } => {
      return {
        pointBorderColor: generateHex(color, 5),
        pointBackgroundColor: generateHex("#ffffff", 5),
        pointRadius: generateHex(0, 5),
        pointBorderWidth: generateHex(0, 5),
        data: data,
        backgroundColor: ["transparent"],
        borderColor: [color],
      };
    };
    const generateOptions = (
      min: number,
      max: number,
      stepsize: number,
      callback: (value: number) => string
    ): any => {
      return {
        legend: {
          display: false,
        },
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        responsive: true,
        onResize: (ins: any, size: any) => {
          // console.log(ins, size)
        },
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45
              },
              gridLines: {
                display: false,
                zeroLineWidth: 0,
              },
              display: true,
              scaleLabel: {
                display: true,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                zeroLineWidth: 1,
              },
              ticks: {
                min: min,
                max: max,
                stepSize: stepsize,
                callback: callback,
              },
              display: true,
              scaleLabel: {
                display: true,
              },
            },
          ],
        },
      };
    };
    return {
      vcalendar: false,
      range: {
        start: moment().subtract(6, "days").toDate(),
        end: new Date(),
      },
      data: {
        labels: labels,
        datasets: [
          generateDataset("#F2994A", [
            7, 8, 15, 26, 35, 40, 38, 32,
            25, 20, 29, 33, 33, 34, 36, 36,
            35, 40, 48, 60, 70, 78, 77.5, 75, 71,
            65, 58, 51, 51.3, 55, 58, 60, 59.7,
            55, 51, 51.5, 53.5, 53, 43, 39, 37
          ]),
        ],
      },
      options: generateOptions(0, 80, 20, (value: number): string => {
        return "" + value + "%";
      }),
      data2: {
        labels: labels,
        datasets: [
          generateDataset("#2C94D2", [
            7, 8, 15, 26, 35, 40, 38, 32,
            25, 20, 29, 33, 33, 34, 36, 36,
            35, 40, 48, 60, 70, 78, 77.5, 75, 71,
            65, 58, 51, 51.3, 55, 58, 60, 59.7,
            55, 51, 51.5, 53.5, 53, 43, 39, 37
          ]),
        ],
      },
      options2: generateOptions(0, 80, 20, (value: number): string => {
        return "" + value + " GB";
      }),
      data3: {
        labels: labels,
        datasets: [
          generateDataset("#BB6BD9", [
            7, 11, 15, 20, 25, 27.8, 28.5, 27.8, 25, 22, 18,
            14, 13, 12, 12, 20, 31, 37,
            38, 48, 60, 70, 72.5, 72, 71, 70,
            57, 55, 60, 70, 77, 80, 78.2,
            72, 60, 53, 44, 30, 36, 38.2, 38
          ]),
        ],
      },
      options3: generateOptions(0, 80, 20, (value: number): string => {

        return "" + value + " MBps";
      }),
      data4: {
        labels: labels,
        datasets: [
          generateDataset("#27AE60", [
            7, 8, 15, 26, 35, 40, 38, 32,
            25, 20, 29, 33, 33, 34, 36, 36,
            35, 40, 48, 60, 70, 78, 77.5, 75, 71,
            65, 58, 51, 51.3, 55, 58, 60, 59.7,
            55, 51, 51.5, 53.5, 53, 43, 39, 37
          ]),
        ],
      },
      options4: generateOptions(0, 80, 20, (value: number): string => {
        return "" + value + "%";
      }),
      data5: {
        labels: labels,
        datasets: [
          generateDataset("#EB5757", [
            7, 8, 15, 26, 35, 40, 38, 32,
            25, 20, 29, 33, 33, 34, 36, 36,
            35, 40, 48, 60, 70, 78, 77.5, 75, 71,
            65, 58, 51, 51.3, 55, 58, 60, 59.7,
            55, 51, 51.5, 53.5, 53, 43, 39, 37
          ]),
        ],
      },
      options5: generateOptions(0, 80, 20, (value: number): string => {
        return "" + value + "%";
      }),
    };
  },
  mounted() {
    const generateGradient = (idcanvas: string, rgba0: string, rgba1: string, data: string, options: string) => {
      const canvas: HTMLCanvasElement | null = document.querySelector(
        `#${idcanvas} canvas`
      );
      const contex2d = canvas?.getContext('2d')
      const gradientFill = contex2d?.createLinearGradient(0, 0, 0, 700);
      gradientFill?.addColorStop(0, rgba0);
      gradientFill?.addColorStop(1, rgba1);
      const elemen = this as any
      elemen[data].datasets[0] = {
        ...elemen[data].datasets[0],
        backgroundColor: gradientFill,
        fill: true,
      }
      const chart = elemen.$refs[idcanvas] as ChartInterface;
      chart.renderChart(elemen[data], elemen[options]);
    };
    generateGradient('cpuusage', 'rgba(242,153,74,0.5)', 'rgba(255,255,255,0)', 'data', 'options');
    generateGradient('ramusage', 'rgba(44, 148, 210, 0.5)', 'rgba(255, 255, 255, 0)', 'data2', 'options2');
    generateGradient('networkusage', 'rgba(116, 89, 217, 0.5)', 'rgba(255, 255, 255, 0)', 'data3', 'options3');
    generateGradient('storageusage', 'rgba(39, 174, 96, 0.5)', 'rgba(255, 255, 255, 0)', 'data4', 'options4');
    generateGradient('objectstorageusage', 'rgba(235, 87, 87, 0.5)', 'rgba(255, 255, 255, 0)', 'data5', 'options5');
  },
  methods: {
    dayclick(event) {
    },
  },
  watch: {
    range() {
      this.vcalendar = false;
    },
  },
  components: {
    custline: line,
  },
});
</script>
<style lang="scss" scoped>
</style>
