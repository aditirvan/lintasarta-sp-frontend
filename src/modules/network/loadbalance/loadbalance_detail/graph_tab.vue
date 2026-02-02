<template>
  <v-container fluid class="pa-8">
    <p class="fz-21 font-weight-bold">Frontend</p>
    <v-row class="graph">
      <v-col md="6" class="px-5">
        <div class="d-flex flex-row align-center">
          <div class="mr-3 d-flex flex-row align-center">
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
          </div>
          <p class="mb-0 fw-600">HTTP Request per Second</p>
          <v-spacer />
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
                  {{ httprequest.start.toLocaleDateString("id-ID") }} -
                  {{ httprequest.end.toLocaleDateString("id-ID") }}
                </p>
                <v-icon class="ml-2" style="width: 13px; height: 13px"
                  >$vuetify.icons.calendarIcon</v-icon
                >
              </v-btn>
            </template>
            <vc-date-picker
              @dayclick="dayclick($event)"
              v-model="httprequest"
              is-range
            />
          </v-menu>
        </div>
        <div class="py-4" style="margin-left:-25px;margin-right:-20px">
          <custline
            :data="data"
            :options="options"
            ref="httpchart"
            id="httpchart"
            :height="null"
          ></custline>
        </div>
      </v-col>
      <v-col md="6" class="px-5">
        <div class="d-flex flex-row align-center">
          <div class="mr-3 d-flex flex-row align-center">
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
          </div>
          <p class="mb-0 fw-600">Connection</p>
          <v-spacer />
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
                  {{ httprequest.start.toLocaleDateString("id-ID") }} -
                  {{ httprequest.end.toLocaleDateString("id-ID") }}
                </p>
                <v-icon class="ml-2" style="width: 13px; height: 13px"
                  >$vuetify.icons.calendarIcon</v-icon
                >
              </v-btn>
            </template>
            <vc-date-picker
              @dayclick="dayclick($event)"
              v-model="httprequest"
              is-range
            />
          </v-menu>
        </div>
        <div class="py-4" style="margin-left:-25px;margin-right:-20px">
          <custline
            :data="data2"
            :options="options2"
            ref="connectionchart"
            id="connectionchart"
            :height="null"
          ></custline>
        </div>
      </v-col>
      
    
      <v-col md="6" class="px-5">
        <div class="d-flex flex-row align-center">
          <div class="mr-3 d-flex flex-row align-center">
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
                stroke="#219653"
                stroke-width="4"
              />
            </svg>
          </div>
          <p class="mb-0 fw-600">HTTP Responses</p>
          <v-spacer />
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
                  {{ httprequest.start.toLocaleDateString("id-ID") }} -
                  {{ httprequest.end.toLocaleDateString("id-ID") }}
                </p>
                <v-icon class="ml-2" style="width: 13px; height: 13px"
                  >$vuetify.icons.calendarIcon</v-icon
                >
              </v-btn>
            </template>
            <vc-date-picker
              @dayclick="dayclick($event)"
              v-model="httprequest"
              is-range
            />
          </v-menu>
        </div>
        <div class="py-4" style="margin-left:-25px;margin-right:-20px">
          <custline
            :data="data3"
            :options="options3"
            ref="httpresponsechart"
            id="httpresponsechart"
            :height="null"
          ></custline>
        </div>
      </v-col>
      <v-col md="6" class="px-5">
        <div class="d-flex flex-row align-center">
          <div class="mr-3 d-flex flex-row align-center">
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
                stroke="#F2C94C"
                stroke-width="4"
              />
            </svg>
          </div>
          <p class="mb-0 fw-600">Traffic Received/Sent</p>
          <v-spacer />
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
                  {{ httprequest.start.toLocaleDateString("id-ID") }} -
                  {{ httprequest.end.toLocaleDateString("id-ID") }}
                </p>
                <v-icon class="ml-2" style="width: 13px; height: 13px"
                  >$vuetify.icons.calendarIcon</v-icon
                >
              </v-btn>
            </template>
            <vc-date-picker
              @dayclick="dayclick($event)"
              v-model="httprequest"
              is-range
            />
          </v-menu>
        </div>
        <div class="py-4" style="margin-left:-25px;margin-right:-20px">
          <custline
            :data="data4"
            :options="options4"
            ref="traffictchart"
            id="traffictchart"
            :height="null"
          ></custline>
        </div>
      </v-col>
    </v-row>

    <p class="fz-21 font-weight-bold">Instance</p>
    <v-row class="graph">
      <v-col md="6" class="px-5">
        <div class="d-flex flex-row align-center">
          <div class="mr-3 d-flex flex-row align-center">
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
                stroke="#1F60A8"
                stroke-width="4"
              />
            </svg>
          </div>
          <p class="mb-0 fw-600">HTTP Total Session Duration</p>
          <v-spacer />
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
                  {{ httprequest.start.toLocaleDateString("id-ID") }} -
                  {{ httprequest.end.toLocaleDateString("id-ID") }}
                </p>
                <v-icon class="ml-2" style="width: 13px; height: 13px"
                  >$vuetify.icons.calendarIcon</v-icon
                >
              </v-btn>
            </template>
            <vc-date-picker
              @dayclick="dayclick($event)"
              v-model="httprequest"
              is-range
            />
          </v-menu>
        </div>
        <div class="py-4" style="margin-left:-25px;margin-right:-20px">
          <custline
            :data="data5"
            :options="options5"
            ref="httpsessionchart"
            id="httpsessionchart"
            :height="null"
          ></custline>
        </div>
      </v-col>
      <v-col md="6" class="px-5">
        <div class="d-flex flex-row align-center">
          <div class="mr-3 d-flex flex-row align-center">
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
                stroke="#9B51E0"
                stroke-width="4"
              />
            </svg>
          </div>
          <p class="mb-0 fw-600">HTTP Average Response Time</p>
          <v-spacer />
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
                  {{ httprequest.start.toLocaleDateString("id-ID") }} -
                  {{ httprequest.end.toLocaleDateString("id-ID") }}
                </p>
                <v-icon class="ml-2" style="width: 13px; height: 13px"
                  >$vuetify.icons.calendarIcon</v-icon
                >
              </v-btn>
            </template>
            <vc-date-picker
              @dayclick="dayclick($event)"
              v-model="httprequest"
              is-range
            />
          </v-menu>
        </div>
        <div class="py-4" style="margin-left:-25px;margin-right:-20px">
          <custline
            :data="data6"
            :options="options6"
            ref="averageresponsechart"
            id="averageresponsechart"
            :height="null"
          ></custline>
        </div>
      </v-col>
      
    
      <v-col md="6" class="px-5">
        <div class="d-flex flex-row align-center">
          <div class="mr-3 d-flex flex-row align-center">
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
          </div>
          <p class="mb-0 fw-600">Queue Size</p>
          <v-spacer />
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
                  {{ httprequest.start.toLocaleDateString("id-ID") }} -
                  {{ httprequest.end.toLocaleDateString("id-ID") }}
                </p>
                <v-icon class="ml-2" style="width: 13px; height: 13px"
                  >$vuetify.icons.calendarIcon</v-icon
                >
              </v-btn>
            </template>
            <vc-date-picker
              @dayclick="dayclick($event)"
              v-model="httprequest"
              is-range
            />
          </v-menu>
        </div>
        <div class="py-4" style="margin-left:-25px;margin-right:-20px">
          <custline
            :data="data7"
            :options="options3"
            ref="queuesizechart"
            id="queuesizechart"
            :height="null"
          ></custline>
        </div>
      </v-col>
      <v-col md="6" class="px-5">
        <div class="d-flex flex-row align-center">
          <div class="mr-3 d-flex flex-row align-center">
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
          </div>
          <p class="mb-0 fw-600">HTTP Responses</p>
          <v-spacer />
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
                  {{ httprequest.start.toLocaleDateString("id-ID") }} -
                  {{ httprequest.end.toLocaleDateString("id-ID") }}
                </p>
                <v-icon class="ml-2" style="width: 13px; height: 13px"
                  >$vuetify.icons.calendarIcon</v-icon
                >
              </v-btn>
            </template>
            <vc-date-picker
              @dayclick="dayclick($event)"
              v-model="httprequest"
              is-range
            />
          </v-menu>
        </div>
        <div class="py-4" style="margin-left:-25px;margin-right:-20px">
          <custline
            :data="data8"
            :options="options8"
            ref="instancehttpresponsechart"
            id="instancehttpresponsechart"
            :height="null"
          ></custline>
        </div>
      </v-col>

      <v-col md="6" class="px-5">
        <div class="d-flex flex-row align-center">
          <div class="mr-3 d-flex flex-row align-center">
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
          </div>
          <p class="mb-0 fw-600">Downtime</p>
          <v-spacer />
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
                  {{ httprequest.start.toLocaleDateString("id-ID") }} -
                  {{ httprequest.end.toLocaleDateString("id-ID") }}
                </p>
                <v-icon class="ml-2" style="width: 13px; height: 13px"
                  >$vuetify.icons.calendarIcon</v-icon
                >
              </v-btn>
            </template>
            <vc-date-picker
              @dayclick="dayclick($event)"
              v-model="httprequest"
              is-range
            />
          </v-menu>
        </div>
        <div class="py-4" style="margin-left:-25px;margin-right:-20px">
          <custline
            :data="data9"
            :options="options9"
            ref="downtimechart"
            id="downtimechart"
            :height="null"
          ></custline>
        </div>
      </v-col>
      <v-col md="6" class="px-5">
        <div class="d-flex flex-row align-center">
          <div class="mr-3 d-flex flex-row align-center">
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
          </div>
          <p class="mb-0 fw-600">Health Checks</p>
          <v-spacer />
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
                  {{ httprequest.start.toLocaleDateString("id-ID") }} -
                  {{ httprequest.end.toLocaleDateString("id-ID") }}
                </p>
                <v-icon class="ml-2" style="width: 13px; height: 13px"
                  >$vuetify.icons.calendarIcon</v-icon
                >
              </v-btn>
            </template>
            <vc-date-picker
              @dayclick="dayclick($event)"
              v-model="httprequest"
              is-range
            />
          </v-menu>
        </div>
        <div class="py-4" style="margin-left:-25px;margin-right:-20px">
          <custline
            :data="data10"
            :options="options10"
            ref="healthcheckchart"
            id="healthcheckchart"
            :height="null"
          ></custline>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { onMounted, defineComponent, ref } from "@vue/composition-api";
import custline from "./custline.vue";
import { useGraph } from "@/composable/usegraph";
import moment from "moment";

export default defineComponent({
  components: { custline },
  setup(props, context) {
    const { generateOptions, generateGradient, generateDatalength, generatedata } = useGraph(
      props,
      context
    );
    const division = Math.floor(100 / 8);
    const labels = Array(100)
      .fill(true)
      .map((v, i) =>
        moment()
          .add(1 + i, "days")
          .format("HH:mm")
      )
      .filter((v, i) => i % division == 0);

    const data = generatedata(labels, '#F2994A', '#F2994A' )

    const data2 = generatedata(labels, '#2C94D2', '#2C94D2', 40)

    const data3 = generatedata(labels, '#219653', '#219653')

    const data4 = generatedata(labels, '#F2C94C', '#F2C94C', 40)
    const data5 = generatedata(labels, '#1F60A8', '#1F60A8')
    const data6 = generatedata(labels, '#9B51E0', '#9B51E0', 40)
    const data7 = generatedata(labels, '#EB5757', '#EB5757')
    const data8 = generatedata(labels, '#27AE60', '#27AE60', 40)
    const data9 = generatedata(labels, '#F2994A', '#F2994A')
    const data10 = generatedata(labels, '#2C94D2', '#2C94D2', 40)

    onMounted(() => {
      const gradientFill = generateGradient(
        "httpchart",
        "#F2994A",
        "#FFFFFF",
        "",
        ""
      );
      data.datasets[0].backgroundColor = gradientFill as any;
      const chart = context.refs.httpchart as any;
      chart.renderChart(data, options);

      const gradientFill2 = generateGradient(
        "connectionchart",
        "#2C94D2",
        "#FFFFFF",
        "",
        ""
      );
      data2.datasets[0].backgroundColor = gradientFill2 as any;
      const chart2 = context.refs.connectionchart as any;
      chart2.renderChart(data2, options2);

      const gradientFill3 = generateGradient(
        "connectionchart",
        "#219653",
        "#FFFFFF",
        "",
        ""
      );
      data3.datasets[0].backgroundColor = gradientFill3 as any;
      const chart3 = context.refs.httpresponsechart as any;
      chart3.renderChart(data3, options3);

      const gradientFill4 = generateGradient(
        "connectionchart",
        "#F2C94C",
        "#FFFFFF",
        "",
        ""
      );
      data4.datasets[0].backgroundColor = gradientFill4 as any;
      const chart4 = context.refs.traffictchart as any;
      chart4.renderChart(data4, options4);

      const gradientFill5 = generateGradient(
        "connectionchart",
        "#1F60A8",
        "#FFFFFF",
        "",
        ""
      );
      data5.datasets[0].backgroundColor = gradientFill5 as any;
      const chart5 = context.refs.httpsessionchart as any;
      chart5.renderChart(data5, options5);

      const gradientFill6 = generateGradient(
        "connectionchart",
        "#9B51E0",
        "#FFFFFF",
        "",
        ""
      );
      data6.datasets[0].backgroundColor = gradientFill6 as any;
      const chart6 = context.refs.averageresponsechart as any;
      chart6.renderChart(data6, options6);

      const gradientFill7 = generateGradient(
        "connectionchart",
        "#EB5757",
        "#FFFFFF",
        "",
        ""
      );
      data7.datasets[0].backgroundColor = gradientFill7 as any;
      const chart7 = context.refs.queuesizechart as any;
      chart7.renderChart(data7, options7);

      const gradientFill8 = generateGradient(
        "connectionchart",
        "#27AE60",
        "#FFFFFF",
        "",
        ""
      );
      data8.datasets[0].backgroundColor = gradientFill8 as any;
      const chart8 = context.refs.instancehttpresponsechart as any;
      chart8.renderChart(data8, options8);

      const gradientFill9 = generateGradient(
        "connectionchart",
        "#F2994A",
        "#FFFFFF",
        "",
        ""
      );
      data9.datasets[0].backgroundColor = gradientFill9 as any;
      const chart9 = context.refs.downtimechart as any;
      chart9.renderChart(data9, options9);

      const gradientFill10 = generateGradient(
        "connectionchart",
        "#2C94D2",
        "#FFFFFF",
        "",
        ""
      );
      data10.datasets[0].backgroundColor = gradientFill10 as any;
      const chart10 = context.refs.healthcheckchart as any;
      chart10.renderChart(data10, options10);
    });

    // Configuration options go here
    const options = generateOptions(0, 80, 20, 1.6, (v) => `${v}%`, "#F2994A");
    const options2 = generateOptions(0, 40, 10, 1.6, (v) => `${v} GB`, "#2C94D2");
    const options3 = generateOptions(0, 80, 20, 1.6, (v) => `${v}%`, "#219653");
    const options4 = generateOptions(0, 40, 10, 1.6, (v) => `${v} GB`, "#F2C94C");
    const options5 = generateOptions(0, 80, 20, 1.6, (v) => `${v}%`, "#1F60A8");
    const options6 = generateOptions(0, 40, 10, 1.6, (v) => `${v} GB`, "#9B51E0");
    const options7 = generateOptions(0, 80, 20, 1.6, (v) => `${v}%`, "#EB5757");
    const options8 = generateOptions(0, 40, 10, 1.6, (v) => `${v} GB`, "#27AE60");
    const options9 = generateOptions(0, 80, 20, 1.6, (v) => `${v}%`, "#F2994A");
    const options10 = generateOptions(0, 40, 10, 1.6, (v) => `${v} GB`, "#2C94D2");
    return {
      httprequest: ref({
        start: new Date(),
        end: new Date(),
      }),
      data, data2, data3, data4, data5, data6, data7, data8, data9, data10,
      options, options2, options3, options4, options5, options6, options7, options8, options9, options10,
      dayclick(event) {},
    };
  },
});
</script>
<style lang="scss" scoped>
.row.graph {
  margin-left: -20px;
  margin-right: -20px;
}
.fw-600{
  font-weight: 600;
}
</style>