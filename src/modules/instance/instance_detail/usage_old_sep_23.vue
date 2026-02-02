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

    <!-- METRICS -->
    <v-col cols="12" v-for="(item, index) in metrics" :key="index">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          <v-row class="pt-5 px-7">
            <v-col class="d-flex flex-row align-center pa-0" style="height: 24px;">
              <svg class="donut-circle" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6" fill="white" :stroke="item.color" stroke-width="4" />
              </svg>
              <h3 class="pl-2">{{ item.title }}</h3>
            </v-col>
          </v-row>
          <v-row class="ml-n5">
            <v-col class="pa-0">
              <chart
                :type="item.type"
                :startDate="range.start"
                :endDate="range.end"
                :height="null"
                ></chart>
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
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { INSTANCEDETAIL } from "./namespace";
import {
  computed,
  defineComponent,
  ref,
  watch,
} from "@vue/composition-api";
import INSTANCE from "../namespace";
import chart from "./chart.vue";

export default defineComponent({
  data() {
    return {
      metrics: [
        {
          title: 'CPU Usage',
          color: '#F2994A',
          type: 'cpumetrics',
        }, {
          title: 'RAM Usage',
          color: '#2C94D2',
          type: 'rammetrics',
        }, {
          title: 'Network In Usage',
          color: '#5B4DBE',
          type: 'inputin',
        }, {
          title: 'Network Out Usage',
          color: '#5B4DBE',
          type: 'inputoutput',
        }, {
          title: 'Disk Read',
          color: '#27AE60',
          type: 'diskread',
        }, {
          title: 'Disk Write',
          color: '#27AE60',
          type: 'diskwrite',
        }
      ]
    }
  },
  setup(props: any, context: any) {
    const { getinstancemetricssocket } = useNamespacedActions(INSTANCEDETAIL, [
      "getinstancemetricssocket",
    ]);

    const { getInstanceDetail } = useNamespacedGetters(INSTANCE, [
      "getInstanceDetail",
    ]);

    const type = ['cpu', 'ram', 'network-in', 'network-out', 'disk-read', 'disk-write']

    const range = ref({
      start: new Date(),
      end: new Date(),
    });

    const setWebsocket = (status?: string, range?: object) => {
      const { instanceid } = context.root.$route.params;
      const { path } = context.root.$route;

      type.forEach((data => {
        getinstancemetricssocket({ id: instanceid, type: data, range: range, status: status ? status : undefined, path: path });
      }))
    }

    watch(range, (val) => {
      const { instanceid } = context.root.$route.params;

      const start = moment(new Date(val.start)).format('DD-MM hh')
      const end = moment(new Date(val.end)).format('DD-MM hh')
      const currentDays = moment(new Date()).format('DD-MM hh')

      if(currentDays !== (start || end)){
        setWebsocket('stop', val)
      } else {
        setWebsocket()
      }
    });

    return {
      getinstancemetricssocket,
      getInstanceDetail,
      vcalendar: false,
      range,
      type,
      setWebsocket,
    };
  },

  created() {
    this.setWebsocket()
  },

  components: {
    chart,
  },
});
</script>
<style lang="scss" scoped>
</style>
