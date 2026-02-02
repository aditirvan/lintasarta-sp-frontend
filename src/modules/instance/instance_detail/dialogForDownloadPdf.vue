<template>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          <div class="headline font-weight-bold font--text pb-4">
            Export All Metrics Deka Agent
          </div>
        </v-card-title>
        <v-card-text class="pb-0">
          <p class="titletext">Please select a date</p>

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
              :min-date="new Date(instance.created_at)"
              :max-date="new Date()"
            />
          </v-menu>
          
        </v-card-text>
        <v-card-actions>
          <!-- <v-row class="ma-2"> -->
          <v-row class="ma-0">
            <v-col cols="12">
              <v-btn
                color="primary"
                block
                height="50"
                depressed
                :disabled="disableBtn"
                @click="confirmDownload"
              >
  
                <beat-loader
                  v-if="isLoadingDownload"
                  :loading="isLoadingDownload"
                  :color="'white'"
                  :size="'10px'"
                  class="ml-2"
                />
                <span v-if="textDownload">Download</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  <script lang='ts'>
  import { defineComponent, computed, ref, watch } from '@vue/composition-api';
  import Vue from 'vue';
  import { useNamespacedActions, useNamespacedState, useActions, useState } from 'vuex-composition-helpers'
  import moment from "moment/moment.js";

  
  export default defineComponent({
    props: ["value", "instance"],
    computed: {
      dialog: {
        get: function () {
          return this.value;
        },
        set: function (val) {
          val == false ? (this.confirmVar = "") : "";
          this.$emit("input", val);
        },
      },
    },
    setup(props, { emit }) {
        const instance = ref(props.instance)
        const disableBtn = ref(false);
        const { isLoadingDownload, textDownload } = useNamespacedState("INSTANCEDETAIL", ["isLoadingDownload", "textDownload"]);

        const range = ref({
            start: new Date((new Date()).setDate((new Date()).getDate() - 1)),
            end: new Date((new Date()).setDate((new Date()).getDate() )),
        });
        const { topbarloading } = useState(["topbarloading"]);
        const { downloadPdfMetric, } = useNamespacedActions("INSTANCEDETAIL",["downloadPdfMetric",]);

        async function confirmDownload() {
            topbarloading.value.start();
    
            downloadPdfMetric({
                id: props.instance.id,
                start_time: moment(new Date(range.value.start)).format('x'),
                end_time: moment(new Date(range.value.end)).format('x')
            }).then(async() => {
                this.dialog = false;
            });
    
    
            topbarloading.value.done();            
        }

      return {
        vcalendar: false,
        disableBtn,
        range,
        isLoadingDownload,
        confirmDownload,
        textDownload,
  
      }
    },
  });
  </script>