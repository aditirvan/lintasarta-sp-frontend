<template>
  <v-row fluid class="py-0">
    <!-- CALENDAR -->
    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text class="d-flex justify-end" style="padding-left: 30px; padding-right: 30px">
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
                <v-icon class="ml-2" style="width: 13px; height: 13px">
                  $vuetify.icons.calendarIcon
                </v-icon>
              </v-btn>
            </template>
            <vc-date-picker
              v-model="range"
              is-range
              :min-date="new Date(getInstanceDetail.created_at)"
              :max-date="new Date()"
            />
          </v-menu>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaInstanceCPU"
                :src="srcMetricCPU"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                :height="iframeHeight"
              >
              </iframe>
              <p id="NoDataCPU" style="display:none; text-align: center;">No Data CPU</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaInstanceRAM"
                :src="srcMetricRAM"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                :height="iframeHeight"
              >
              </iframe>
              <p id="NoDataRAM" style="display:none; text-align: center;">No Data RAM</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaInstanceNetworkInUsage"
                :src="srcMetricNetworkIn"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                :height="iframeHeight"
              >
              </iframe>
              <p id="NoDataNetworkInUsage" style="display:none; text-align: center;">No Data Network In Usage</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaInstanceNetworkOutUsage"
                :src="srcMetricNetworkOut"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                :height="iframeHeight"
              >
              </iframe>
              <p id="NoDataNetworkOutUsage" style="display:none; text-align: center;">No Data Network Out Usage</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

  </v-row>
</template>
<script lang="ts">
import Vue from "vue";
import moment from "moment/moment.js";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { INSTANCEDETAIL } from "./namespace";
import {
  computed,
  defineComponent,
  ref,
  watch,
  onMounted,
} from "@vue/composition-api";
import INSTANCE from "../namespace";
import libProject from "@/lib/project";
import { async } from "rxjs";

const DELTAS = {
  "100":481,
  "200":427,
  "300":400,
  "400":400,
  "500":400,
  "700":400,
  "800":400,
  "900":400,
  "1000":400,
};

export default defineComponent({
  data() {
    return {
      iframeHeight: '0px',
    }
  },
  computed: {
    // Necessary for initial iframe height
    iframeOffsetWidth() {      
      return this.$refs['chartiframe'].offsetWidth;
    },
  },
  mounted() {
    this.iframeHeight = `${DELTAS[Math.min(1e3,Math.max(100*Math.floor(this.iframeOffsetWidth/100),100))]}px`;

    // setup event listener
    window.addEventListener('message', this.handleIframeResize);
  },
  beforeDestroy() {
    // destroy event listener
    window.removeEventListener('message', this.handleIframeResize);
  },
  methods: {
    handleIframeResize(e) {
      for(var b in e.data['datawrapper-height']) {
        if ('8dfPN' === b) {
          this.iframeHeight = `${e.data['datawrapper-height'][b]}px`;

        }
      }
    },
  },
  setup(props: any, context: any) {

    const { getInstanceDetail } = useNamespacedGetters(INSTANCE, [
      "getInstanceDetail",
    ]);

    const { fetchOpenstackInstanceDetail, fetchOpenstackProjectDetail } = useNamespacedActions(INSTANCE, [
      "fetchOpenstackInstanceDetail",
      "fetchOpenstackProjectDetail",
    ]);

    const { getmetricall } = useNamespacedActions(INSTANCEDETAIL, [
      "getmetricall",
    ]);

    const srcMetric = ref('');
    const srcMetricCPU = ref('');
    const srcMetricRAM = ref('');
    const srcMetricNetworkIn = ref('');
    const srcMetricNetworkOut = ref('');

    const {
      cpumetrics,
      rammetrics,
      inputoutput,
      inputin,
    } = useNamespacedState(INSTANCEDETAIL, [
      "cpumetrics",
      "rammetrics",
      "inputoutput",
      "inputin",
    ]);

    onMounted( async() => {

      const instanceOpenstack = await fetchOpenstackInstanceDetail(context.root._route.params.instanceid)
      const currOrg = await libProject.getCurrentOrg();
      const currentProjectID = await libProject.getActiveProjectID()
      const projectOpenstack = await fetchOpenstackProjectDetail(currentProjectID)
      if (typeof projectOpenstack === 'undefined') {

          const iframeCPU = document.getElementById('iframeGrafanaInstanceCPU') as HTMLIFrameElement | null
          const iframeRam = document.getElementById('iframeGrafanaInstanceRAM') as HTMLIFrameElement | null
          const iframeNetworkIn = document.getElementById('iframeGrafanaInstanceNetworkInUsage') as HTMLIFrameElement | null
          const iframeNetworkOut = document.getElementById('iframeGrafanaInstanceNetworkOutUsage') as HTMLIFrameElement | null


          iframeCPU.style.display = 'none'
          const NoDataCPU =  document.getElementById('NoDataCPU') as HTMLParagraphElement | null
          NoDataCPU.style.display = 'block'
          
          iframeRam.style.display = 'none'
          const NoDataRam =  document.getElementById('NoDataRAM') as HTMLParagraphElement | null
          NoDataRam.style.display = 'block'
          
          iframeNetworkIn.style.display = 'none'
          const NoDataNetworkIn =  document.getElementById('NoDataNetworkInUsage') as HTMLParagraphElement | null
          NoDataNetworkIn.style.display = 'block'
          
          iframeNetworkOut.style.display = 'none'
          const NoDataNetworkOut =  document.getElementById('NoDataNetworkOutUsage') as HTMLParagraphElement | null
          NoDataNetworkOut.style.display = 'block'
      } else {

      const nameProjectOpenstack = encodeURIComponent(projectOpenstack.Project.name)
      const nameOrg = encodeURIComponent(currOrg.name)
      const regionFullname = getInstanceDetail.value.region
      const region = regionFullname.split("-")[0];

      srcMetric.value = `${process.env.VUE_APP_API_BASE_URL_GRAFANA}/d-solo/sYXd1Y07k1/deka-flexi-organizations?orgId=2&var-ds=Prometheus`
      srcMetric.value += "&var-Organization=" + nameOrg
      srcMetric.value += "&var-Region=" + region
      srcMetric.value += "&var-Project=" + nameProjectOpenstack
      srcMetric.value += "&var-Instance=" + instanceOpenstack    
      srcMetric.value += "&var-Domain=All&var-Refresh=1m&var-OrgIsDeleted=N&var-ProjIsDeleted=N&refresh=1m"

      const date = new Date();
      const currentDays = moment(new Date()).format('x')
      const yesterday = moment(date.setDate(date.getDate() - 1)).format('x')

      const timeRangeDefault = `&from=${yesterday}&to=${currentDays}`

      srcMetricCPU.value = srcMetric.value + "&theme=light&panelId=2" + timeRangeDefault
      srcMetricRAM.value = srcMetric.value + "&theme=light&panelId=6" + timeRangeDefault
      srcMetricNetworkIn.value = srcMetric.value + "&theme=light&panelId=24" + timeRangeDefault
      srcMetricNetworkOut.value = srcMetric.value + "&theme=light&panelId=25" + timeRangeDefault

      const { instanceid } = context.root._route.params

      const range = {
        start: new Date((new Date()).setDate((new Date()).getDate() - 7)),
        end: date,
      }
      await getmetricall({ id: instanceid, range  });

      }

      const iframeCPU = document.getElementById('iframeGrafanaInstanceCPU') as HTMLIFrameElement | null

      if (cpumetrics.value.length == 0) {
        iframeCPU.style.display = 'none'
        const NoDataCPU =  document.getElementById('NoDataCPU') as HTMLParagraphElement | null
        NoDataCPU.style.display = 'block'
      }
      const iframeRam = document.getElementById('iframeGrafanaInstanceRAM') as HTMLIFrameElement | null
      if (rammetrics.value.length == 0) {
        iframeRam.style.display = 'none'
        const NoDataRam =  document.getElementById('NoDataRAM') as HTMLParagraphElement | null
        NoDataRam.style.display = 'block'
      }
      const iframeNetworkIn = document.getElementById('iframeGrafanaInstanceNetworkInUsage') as HTMLIFrameElement | null
      if (inputin.value.length == 0) {
        iframeNetworkIn.style.display = 'none'
        const NoDataNetworkIn =  document.getElementById('NoDataNetworkInUsage') as HTMLParagraphElement | null
        NoDataNetworkIn.style.display = 'block'
      }
      const iframeNetworkOut = document.getElementById('iframeGrafanaInstanceNetworkOutUsage') as HTMLIFrameElement | null
      if (inputoutput.value.length == 0) {
        iframeNetworkOut.style.display = 'none'
        const NoDataNetworkOut =  document.getElementById('NoDataNetworkOutUsage') as HTMLParagraphElement | null
        NoDataNetworkOut.style.display = 'block'
      }
      
    })

    const range = ref({
      start: new Date((new Date()).setDate((new Date()).getDate() - 1)),
      end: new Date(),
    });
    watch(range, (val) => {
      const date = new Date();
      const start = moment(new Date(val.start)).format('x')
      const end = moment(new Date(val.end)).format('x')
      const currentDays = moment(new Date()).format('x')
      const yesterday = moment(date.setDate(date.getDate() - 1)).format('x')

      const checkIsthereParamTimeFrom = srcMetricCPU.value.split("&from=")
      const checkIsthereRAMParamTimeFrom = srcMetricRAM.value.split("&from=")
      const checkIsthereNetworkInParamTimeFrom = srcMetricNetworkIn.value.split("&from=")
      const checkIsthereNetworkOutParamTimeFrom = srcMetricNetworkOut.value.split("&from=")

      if(currentDays !== (start || end)){
        const timeRange = `&from=${start}&to=${end}`

        srcMetricCPU.value = checkIsthereParamTimeFrom[0] + timeRange
        srcMetricRAM.value = checkIsthereRAMParamTimeFrom[0] + timeRange
        srcMetricNetworkIn.value = checkIsthereNetworkInParamTimeFrom[0] + timeRange
        srcMetricNetworkOut.value = checkIsthereNetworkOutParamTimeFrom[0] + timeRange

      } else {
        const timeRangeDefault = `&from=${yesterday}&to=${currentDays}`

        srcMetricCPU.value = checkIsthereParamTimeFrom[0] + timeRangeDefault
        srcMetricRAM.value = checkIsthereRAMParamTimeFrom[0] + timeRangeDefault
        srcMetricNetworkIn.value = checkIsthereNetworkInParamTimeFrom[0] + timeRangeDefault
        srcMetricNetworkOut.value = checkIsthereNetworkOutParamTimeFrom[0] + timeRangeDefault

      }
    });

    return {
      getInstanceDetail,
      vcalendar: false,
      fetchOpenstackInstanceDetail,
      fetchOpenstackProjectDetail,
      srcMetric,
      srcMetricCPU,
      srcMetricRAM,
      srcMetricNetworkIn,
      srcMetricNetworkOut,
      range,
      getmetricall,
      cpumetrics,
      rammetrics,
      inputoutput,
      inputin,
    };
  },

  created() {
  },

});
</script>
<style lang="scss" scoped>
</style>
