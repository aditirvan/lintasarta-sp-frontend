<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Confirm {{ action == 'subscribe' ? "Subscribe" : "Unsubscribe" }} Deka Agent
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p v-if="action == 'subscribe'" class="titletext">{{ message_charging }}</p>
        <p class="titletext">Please type <b>Yes</b> to confirm</p>
        <v-text-field
          v-model="confirmVar"
          flat
          outlined
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <!-- <v-row class="ma-2"> -->
        <v-row class="ma-0">
          <v-col cols="12">
            <v-btn
              v-if="action == 'unsubscribe'"
              color="error"
              block
              height="50"
              depressed
              :disabled="disableBtn || isLoadingSubscribe"
              @click="confirmUnSubscribe"
            >

              <beat-loader
                v-if="isLoadingSubscribe"
                :loading="isLoadingSubscribe"
                :color="'white'"
                :size="'10px'"
                class="ml-2"
              />
              {{
                isLoadingSubscribe
                  ? ""
                  : "Confirm"
              }}
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              v-if="action == 'subscribe'"
              color="secondary"
              block
              height="50"
              depressed
              :disabled="disableBtn || isLoadingSubscribe"
              @click="confirmSubscribe"
            >

              <beat-loader
                v-if="isLoadingSubscribe"
                :loading="isLoadingSubscribe"
                :color="'white'"
                :size="'10px'"
                class="ml-2"
              />
              {{
                isLoadingSubscribe
                  ? ""
                  : "Confirm"
              }}
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

export default defineComponent({
  props: ["value", "instance", "service"],
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
    const confirmVar = ref("");
    const disableBtn = ref(true);
    const userId = localStorage.getItem("userId");

    watch(confirmVar, (val) => {
      return val.toLowerCase() == "yes"
        ? (disableBtn.value = false)
        : (disableBtn.value = true);
    });

    const { subscribeDekaAgent, unsubscribeDekaAgent } = useNamespacedActions("INSTANCEDETAIL",["subscribeDekaAgent", "unsubscribeDekaAgent"]);
    const { fetchInstanceDetail, getStatusSubscribeDekaAgent, validateEula } = useNamespacedActions("INSTANCE", [
      "fetchInstanceDetail",
      "getStatusSubscribeDekaAgent",
      "validateEula",
    ]);
    const { statusCheckEula } = useNamespacedState("INSTANCE", ["statusCheckEula"]);
    const { isLoadingSubscribe } = useNamespacedState("INSTANCEDETAIL", ["isLoadingSubscribe"]);
    const { topbarloading } = useState(["topbarloading"]);

    const action = ref('')

    const formatRupiah = (num) => {
      return num.toLocaleString("id-ID");
    }

    const payment_method = props.instance.project.payment_method
    const service_detail = props.service

    // const price_per_hour = formatRupiah(service_detail.services[0].service_tag[0].price_per_hour)
    // const price_per_month = formatRupiah(service_detail.services[0].service_tag[0].price_per_month)
    const price_per_hour = formatRupiah(service_detail.price_per_hour)
    const price_per_month = formatRupiah(service_detail.price_per_month)
    let message_charging = ""
    
    if (props.instance.package_deka_agent.id == "" || props.instance.package_deka_agent.status == "inactive") {
      action.value = 'subscribe'
      if (payment_method == 'postpaid') {
        // per-bulan
        message_charging = `you will be charged Rp. ${price_per_month} every month`
      } else {
        // per-jam
        message_charging = `You will be charged Rp. ${price_per_hour} per hour`
      }

    } else {
      action.value = 'unsubscribe'
    }

    async function confirmUnSubscribe() {
      topbarloading.value.start();

      unsubscribeDekaAgent({
        id: props.instance.package_deka_agent.id,
        user_id: JSON.parse(userId),
      }).then(async() => {
        this.dialog = false;
        await fetchInstanceDetail(props.instance.id)
        await getStatusSubscribeDekaAgent(props.instance.id)
      });


      topbarloading.value.done();            
    }


    async function confirmSubscribe() {
      topbarloading.value.start();
      
      subscribeDekaAgent({
        instance_id: props.instance.id,
        user_id: JSON.parse(userId),
      }).then(async() => {
        this.dialog = false;
        await fetchInstanceDetail(props.instance.id)
        await getStatusSubscribeDekaAgent(props.instance.id)
        if (!statusCheckEula.value && localStorage.getItem("role").toLowerCase() !== 'superadmin') {
          const payload = {
            form_name: "Form Subscribe Deka Agent",
            project_id: localStorage.getItem("projectid"),
          };
          validateEula(payload)
        }
      });


      topbarloading.value.done();            
    }

    return {
      confirmVar,
      disableBtn,
      confirmSubscribe,
      isLoadingSubscribe,
      action,
      confirmUnSubscribe,
      message_charging,

      // dialog,
      // nameoforg,
      // restore,
      // nameoforgError,
      // orgNameProp,
      // restoreroleweblabel,
    }
  },
});
</script>