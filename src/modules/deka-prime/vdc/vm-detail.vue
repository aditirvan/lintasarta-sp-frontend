<template>
  <div>
    <v-row v-if="isLoadingVdc">
      <v-col cols="12">
        <v-card class="rounded-lg" flat
          ><v-container fluid class="px-7 py-4">
            <div class="d-flex justify-center">
              <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular></div></v-container></v-card
      ></v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" v-if="detailVm">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <br />
            <div class="bor-table mb-5">
              <v-row class="ma-0">
                <v-col>Name</v-col>
                <v-col>{{ detailVm.Name }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>State</v-col>
                <v-col :class="detail.Status == 'POWERED_ON' ? 'font-weight-bold green--text' : 'font-weight-bold grey--text'">{{ detail.Status }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Computer Name</v-col>
                <v-col>{{ detailVm.GuestCustomizationSection.ComputerName }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Description</v-col>
                <v-col>{{ detailVm.Description || "-" }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Operating System</v-col>
                <v-col>{{ detail.GuestOS }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Boot Delay</v-col>
                <v-col>-</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Storage Policy</v-col>
                <v-col>{{ detailVm.StorageProfile.Name }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Virtual Data Center</v-col>
                <v-col>{{ vdcName }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Owner</v-col>
                <v-col>{{ detail.OwnerName }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>VMware Tools</v-col>
                <v-col>{{ detailVm.VmSpecSection.VmToolsVersion }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Virtual Hardware Version</v-col>
                <v-col>Hardware Version {{ detail.HardwareVersion }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-0">
                <v-col>Enter BIOS Setup</v-col>
                <v-col>-</v-col>
              </v-row>
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { ref, onMounted } from "@vue/composition-api";
import { VDC } from "./namespace";
export default {
  setup(props, context) {
    const { detailVm, isLoadingVdc } = useNamespacedGetters(VDC, ["detailVm", "isLoadingVdc"]);
    // const { getDetailVm } = useNamespacedActions(VDC, ["getDetailVm"]);
    // onMounted(() => {
    //   const payload = {
    //     id_vdc: context.root.$route.params.id,
    //     id_vapp: context.root.$route.params.id_vapp,
    //     id_vm: context.root.$route.params.id_vm,
    //   };
    //   getDetailVm(payload);
    // });
    const detail = ref(JSON.parse(localStorage.getItem("dataVM") || "{}"));
    const vdcName = ref(localStorage.getItem("projectname"));
    return {
      detailVm,
      isLoadingVdc,
      detailVm,
      detail,
      vdcName,
    };
  },
};
</script>

<style lang="scss" scoped>
.bor-table {
  border: 1px solid rgb(2 0 0 / 12%);
}
</style>
