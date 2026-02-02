<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row class="d-flex justify-center"
              ><v-col>
                <!-- <v-card-text> oc - OpenShift Command Line Interface (CLI) </v-card-text> -->
                <div class="headline font-weight-bold font--text mb-2">oc - OpenShift Command Line Interface (CLI)</div>
                <div>With the OpenShift command line interface, you can create applications and manage OpenShift projects from a terminal.</div>
              </v-col>
            </v-row>
            <v-row>
              <v-list>
                <v-subheader style="color: black" class="fz-14"
                  >The oc binary offers the same capabilities as the kubectl binary, but it is further extended to natively support OpenShift Container Platform
                  features.</v-subheader
                >
                <v-list-item v-for="(row, index) in listDownload" :key="index" :disabled="openshift_detail.status != 'Created'">
                  <v-list-item-icon class="d-flex align-self-center">
                    <v-icon color="black" x-small>mdi-circle</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      ><a :href="row.link">{{ row.name }}</a></v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { DEKAROCK } from "./namespace";
import { useNamespacedState } from "vuex-composition-helpers";

export default {
  setup(props, context) {
    const { openshift_detail } = useNamespacedState(DEKAROCK, ["openshift_detail"]);
    const listDownload = ref([
      {
        name: "Download oc for Linux for x86_64",
        link: `https://downloads-openshift-console.apps.ocp-${openshift_detail.value.domain_base}.dekarock.cloudeka.id/amd64/linux/oc.tar`,
      },
      {
        name: "Download oc for Mac for x86_64",
        link: `https://downloads-openshift-console.apps.ocp-${openshift_detail.value.domain_base}.dekarock.cloudeka.id/amd64/mac/oc.zip`,
      },
      {
        name: "Download oc for Windows for x86_64",
        link: `https://downloads-openshift-console.apps.ocp-${openshift_detail.value.domain_base}.dekarock.cloudeka.id/amd64/windows/oc.zip`,
      },
      {
        name: "Download oc for Linux for ARM 64",
        link: `https://downloads-openshift-console.apps.ocp-${openshift_detail.value.domain_base}.dekarock.cloudeka.id/arm64/linux/oc.tar`,
      },
      {
        name: "Download oc for Mac for ARM 64",
        link: `https://downloads-openshift-console.apps.ocp-${openshift_detail.value.domain_base}.dekarock.cloudeka.id/arm64/mac/oc.zip`,
      },
      {
        name: "Download oc for Linux for IBM Power, little endian",
        link: `https://downloads-openshift-console.apps.ocp-${openshift_detail.value.domain_base}.dekarock.cloudeka.id/ppc64le/linux/oc.tar`,
      },
      {
        name: "Download oc for Linux for IBM Z",
        link: `https://downloads-openshift-console.apps.ocp-${openshift_detail.value.domain_base}.dekarock.cloudeka.id/s390x/linux/oc.tar`,
      },
      { name: "LICENSE", link: `https://downloads-openshift-console.apps.ocp-${openshift_detail.value.domain_base}.dekarock.cloudeka.id/oc-license` },
    ]);
    return {
      listDownload,
      openshift_detail,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-application--is-ltr .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 0px !important;
}
::v-deep .v-list-item {
  height: 25px;
  min-height: 0px !important;
}
</style>
