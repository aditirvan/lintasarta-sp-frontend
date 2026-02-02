<template>
  <v-row fluid class="py-0">
    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text
          class="d-flex justify-end"
          style="padding-left: 30px; padding-right: 30px"
        >
          <v-menu
            v-model="vcalendar"
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
                  >$vuetify.icons.calendarIcon</v-icon
                >
              </v-btn>
            </template>
            <vc-date-picker
              @dayclick="dayclick($event)"
              v-model="range"
              is-range
              :min-date="new Date(getInstanceDetail.created_at)"
              :max-date="new Date()"
            />
          </v-menu>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" class="pt-0">
      <v-card flat class="rounded-lg">
        <v-card-text>
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
              <h3 class="pl-2">CPU Usage</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <custline
                ref="cpuusage"
                id="cpuusage"
                v-if="loaded"
                :data="data"
                :options="options"
                :height="null"
              ></custline>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    

    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text>
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
                  stroke="#2C94D2"
                  stroke-width="4"
                />
              </svg>
              <h3 class="pl-2">RAM Usage</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <custline
                id="ramusage"
                ref="ramusage"
                v-if="loaded1"
                :height="null"
                :data="data2"
                :options="options2"
              ></custline>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

     <v-col cols="12">
      <v-card flat class="rounded-lg ">
        <v-card-text>
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
                  stroke="#422F8A"
                  stroke-width="4"
                />
              </svg>
              <h3 class="pl-2">Network In Usage</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <custline
                v-if="loaded2"
                id="networkusagein"
                ref="networkusagein"
                :height="null"
                :data="data4"
                :options="options4"
              ></custline>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    
    <v-col cols="12">
      <v-card flat class="rounded-lg ">
        <v-card-text>
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
                  stroke="#422F8A"
                  stroke-width="4"
                />
              </svg>
              <h3 class="pl-2">Network Out Usage</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <custline
                v-if="loaded2"
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


   

  </v-row>
</template>
<script lang="ts">
// import line from "./line.vue";
import Vue from "vue";
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
import { INSTANCEDETAIL } from "./namespace";
import {
  computed,
  defineComponent,
  reactive,
  ref,
  watch,
} from "@vue/composition-api";
import INSTANCE from "../namespace";

interface ChartInterface extends Vue {
  renderChart: any;
}
export default defineComponent({
  setup(props: any, context: any) {
    const labels = [
      "00:00",
      "02:00",
      "04:00",
      "06:00",
      "08:00",
      "10:00",
      "12:00",
      "14:00",
    ];
    const generateHex = (hex: string | number, point: number, data: any) => {
      return data.map((e: any, i: any) => {
        // if (i == point) return hex;
        // else return null;
        return hex;
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
        pointBorderColor: generateHex(color, 3, data),
        pointBackgroundColor: generateHex("#ffffff", 3, data),
        pointRadius: generateHex(0, 3, data),
        pointBorderWidth: generateHex(0, 3, data),
        data: data,
        backgroundColor: ["transparent"],
        borderColor: [color],
      };
    };
    const generateOptions = (
      min: number,
      max: number,
      stepsize: number,
      callback: (value: number) => string,
      tooltipcolor: string,
      unit: string
    ): any => {


      return {
        showLines: true,
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
              gridLines: {
                display: false,
                zeroLineWidth: 0,
              },
              display: true,
              scaleLabel: {
                display: true,
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 8,
                callback: (val: any) => {
                  return moment(new Date(val)).format("DD HH:mm");
                },
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
        hover: {
          mode: "index",
          intersect: false,
        },
        tooltips: {
          displayColors: false,
          mode: "index",
          intersect: false,
          yAlign: "bottom",
          xAlign: "center",
          titleAlign: "left",
          caretSize: 0,
          custom: function (tooltipModel: any) {
            tooltipModel.titleMarginBottom = 0;
            tooltipModel.height = 32;
            tooltipModel.backgroundColor = tooltipcolor;
          },
          callbacks: {
            title: function (data: any) {
              return parseFloat(data[0].yLabel).toFixed(2) + unit;
            },
            label: (val: any) => {
              return moment(new Date(val.xLabel)).format("DD/MM/YY HH:mm");
            },
          },
        },
      };
    };
    const { getinstancemetricssocket } = useNamespacedActions(INSTANCEDETAIL, [
      "getinstancemetricssocket",
    ]);
    const { getInstanceDetail } = useNamespacedGetters(INSTANCE, [
      "getInstanceDetail",
    ]);
    const {
      instancemetrics,
      cpumetrics,
      rammetrics,
      inputoutput,
      inputin,
    } = useNamespacedState(INSTANCEDETAIL, [
      "instancemetrics",
      "cpumetrics",
      "rammetrics",
      "inputoutput",
      "inputin",
    ]);
    const data = ref();
    const loaded = ref(false);
    const options = generateOptions(
      0,
      100,
      20,
      (value: number): string => {
        return "" + value + "%";
      },
      "rgb(242,153,74)",
      "%"
    );
    const { package_instance } = getInstanceDetail.value;
    const { ram, vcpu } = package_instance;
    const generateGradient = (
      idcanvas: string,
      rgba0: string,
      rgba1: string,
      data: any,
      options: any
    ) => {
      const canvas: HTMLCanvasElement | null = document.querySelector(
        `#${idcanvas} canvas`
      );
      const contex2d = canvas?.getContext("2d");
      const gradientFill = contex2d?.createLinearGradient(0, 0, 0, 400);
      gradientFill?.addColorStop(0, rgba0);
      gradientFill?.addColorStop(1, rgba1);
      data.datasets = data.datasets.map((x: any) => {
        return {
          ...x,
          backgroundColor: gradientFill,
          fill: true,
        };
      });
  
      const chart = context.refs[idcanvas] as ChartInterface;
      //data.datasets._chart.destroy();
      
      chart.renderChart(data, options, {responsive: true, maintainAspectRatio: false});

    };
    watch(cpumetrics as any, (val: Array<any>) => {
      loaded.value = false;

      const cpulabels = val.map(x => {
          return x.date_time;
      });


      const dataspread = val.map(x => {
          return x.value / vcpu;
      })

      //let cpulabels = val.map((x: any) => x.date_time);
      //const dataspread = val.map((x: any) => x.value / vcpu);

      data.value = {
        labels: cpulabels ? cpulabels : labels,
        datasets: [
          generateDataset(
            "#F2994A",
            dataspread ? dataspread : [50, 90, 60, 40, 65, 80, 60, 70]
          ),
        ],
      };
      loaded.value = true;
      context.root.$nextTick(() => {
        generateGradient(
          "cpuusage",
          "rgba(242,153,74,0.5)",
          "rgba(255,255,255,0)",
          data.value,
          options
        );
      });
    });
    const loaded1 = ref(false);
    const data2 = ref();

    // calculate 1 ram = 1GB = 1024mb
    let options2 = generateOptions(
      0,
      ram * 1024,
      (ram * 1024) / 4,
      (value: number): string => {
        return "" + value + " MB";
      },
      "rgb(44, 148, 210)",
      " MB"
    );
  
    watch(rammetrics as any, (val: Array<any>) => {
      loaded1.value = false;
      let cpulabels = val.map((x: any) => x.date_time);
      const dataspread: number[] = val.map((x: any) => x.value);
     
      // const peak = Math.max(...dataspreadram);
      // // buat max kelipatan 128 mb
      // let max = 128;
      // while (max < peak) {
      //   max = max + 128;
      // }
      // let options2 = generateOptions(
      //   0,
      //   max,
      //   max / 4,
      //   (value: number): string => {
      //     return "" + value + " MB";
      //   },
      //   "rgb(44, 148, 210)",
      //   " MB"
      // );

 

      data2.value = {
        labels: cpulabels ? cpulabels : labels,
        datasets: [
          generateDataset(
            "#2C94D2",
            dataspread? dataspread : [50, 90, 60, 40, 65, 80, 60, 70],
          ),
        ],
      };

      // const dataspreadram = val.map(x => {
      //     data2.value.datasets.data.push(x.value / ram)
      //     //return x.value / ram;
      // })


      console.log(data2.value);

      loaded1.value = true;
      context.root.$nextTick(() => {
        generateGradient(
          "ramusage",
          "rgba(44, 148, 210, 0.5)",
          "rgba(255,255,255,0)",
          data2.value,
          options2
        );
      });
    });

    const data3 = ref();
    const loaded2 = ref(false);
    let options3 = generateOptions(
      0,
      10,
      2,
      (value: number): string => {
        return "" + value + " mbps";
      },
      "rgb(116, 89, 217)",
      "mbps"
    );
    watch(inputoutput as any, (val: Array<any>) => {
      
      loaded2.value = false;
    
      let cpulabels = val.map((x: any) => x.date_time);
      const dataspread1: number[] = val.map((x: any) => x.value);


      //console.log(dataspread1);
      const peak = Math.max(...dataspread1);
      let max = 10;
      while (max < peak) {
        max = max + 10;
      }
      options3 = generateOptions(
        0,
        max,
        max / 4,
        (value: number): string => {
          return "" + value + " mbps";
        },
        "rgb(116, 89, 217)",
        "mbps"
      );
      data3.value = {
        labels: cpulabels ? cpulabels : labels,
        datasets: [
          generateDataset(
            "#422F8A",
            dataspread1 ? dataspread1 : [50, 90, 60, 40, 65, 80, 60, 70]
          )
        ],
      };
     
      //console.log(data3.value);
      context.root.$nextTick(() => {
        generateGradient(
          "networkusage",
          "rgba(44, 148, 210, 0.5)",
          "rgba(255,255,255,0)",
          data3.value,
          options3
        );
      });
      loaded2.value = true;
    });


    const data4 = ref();
    const loaded3 = ref(false);
    let options4 = generateOptions(
      0,
      10,
      2,
      (value: number): string => {
        return "" + value + " mbps";
      },
      "rgb(116, 89, 217)",
      "mbps"
    );
    watch(inputin as any, (val: Array<any>) => {
      
      loaded3.value = false;
    
      let cpulabels = val.map((x: any) => x.date_time);
      const dataspread1: number[] = val.map((x: any) => x.value);


      //console.log(dataspread1);
      const peak = Math.max(...dataspread1);
      let max = 10;
      while (max < peak) {
        max = max + 10;
      }
      options4 = generateOptions(
        0,
        max,
        max / 4,
        (value: number): string => {
          return "" + value + " mbps";
        },
        "rgb(116, 89, 217)",
        "mbps"
      );
      data4.value = {
        labels: cpulabels ? cpulabels : labels,
        datasets: [
          generateDataset(
            "#422F8A",
            dataspread1 ? dataspread1 : [50, 90, 60, 40, 65, 80, 60, 70]
          )
        ],
      };
      //console.log(data3.value);
      context.root.$nextTick(() => {
        generateGradient(
          "networkusagein",
          "rgba(44, 148, 210, 0.5)",
          "rgba(255,255,255,0)",
          data4.value,
          options4
        );
      });
      loaded3.value = true;
    });

    const range = ref({
      // start: (() => {
      //   let f = moment().subtract(6, "days").set({hour:0,minute:0,second:0,millisecond:0}).toDate();
      //   let g = new Date(getInstanceDetail.value.created_at);
      //   if (g.getTime() > f.getTime()) {
      //     return g;
      //   } else {
      //     return f;
      //   }
      // })(),
      start: new Date(),
      end: new Date(),
    });
    watch(range, (val) => {
      const { instanceid } = context.root.$route.params;
      var mulai = moment().toDate();  
      mulai.setHours(0);
      mulai.setMinutes(0);
      mulai.setSeconds(0);
      mulai.setMilliseconds(0);
      
      var akhir = moment().toDate();  
      akhir.setHours(23);
      akhir.setMinutes(59);
      akhir.setSeconds(59);
      akhir.setMilliseconds(0);
      
      val.start =mulai;
      val.end =akhir;

      // val.start = moment(val.start).set({hour:0,minute:0,second:0,millisecond:0}).toISOString()
      // val.end = moment(val.end).set({hour:23,minute:59,second:59,millisecond:0}).toDate()

      // getinstancemetrics({ id: instanceid, range: val });
    });

    
  
      

    return {
      // rams,
      loaded,
      loaded1,
      loaded2,
      loaded3,
      getInstanceDetail,
      getinstancemetricssocket,
      instancemetrics,
      vcalendar: false,
      range,
      data,
      options,
      data2,
      options2,
      data3,
      options3,
      data4,
      options4,
 
    };
  },

  created() {
    const { instanceid } = this.$route.params;
    
    this.getinstancemetricssocket({ id: instanceid, type: 'cpu' });
    this.getinstancemetricssocket({ id: instanceid, type: 'ram' });
    this.getinstancemetricssocket({ id: instanceid, type: 'network-out' });
    this.getinstancemetricssocket({ id: instanceid, type: 'network-in' });

    
  },
  methods: {
    dayclick(event) {},
  },
  components: {
    // custline: line,
  },
});
</script>
<style lang="scss" scoped>
</style>
