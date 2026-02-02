<template>
  <div>
    <v-card flat class="rounded-lg pa-0">
      <v-card-text class="pa-7">
        <v-row>
          <v-col class="d-flex flex-row align-center">
            <v-icon class="mr-4" style="font-size: 55px" color="#F1F2F2"
              >mdi-circle</v-icon
            >
            <div>
              <div class="headline font-weight-bold">{{ project.name }}</div>
              <p style="font-size: 12px" class="font--text mb-0">
                Update your project information under Settings
              </p>
            </div>
            <v-spacer />
            <v-btn
              to="/service-limit"
              color="secondary"
              style="height: 45px; width: 150px"
              outlined
              class="mr-3"
              v-if="
                currentProj.payment_method == 'postpaid' &&
                  currentProj.postpaid_type == 'fixed'
              "
            >
              List Service
            </v-btn>
            <v-btn
              v-if="!read_only"
              class="secondary"
              height="50"
              width="150"
              depressed
              :to="`/project/${currentProj.name}/${currentProj.id}/setting`"
              append
            >
              <span>Project Setting</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <div style="height: 30px; width: auto" />
    <!-- DEKA FLEXI -->
    <v-card v-if="currentProj.openstack_project_id && !currentProj.dekaprime_project_id" flat class="rounded-lg pa-7">
      <div class="headline font-weight-bold font--text mb-4">Instance</div>
      <instance />
      <div class="headline font-weight-bold font--text  mb-4">Storage</div>
      <storage />
      <div class="headline font-weight-bold font--text  mb-4">Image</div>
      <resourceimages />
    </v-card>

    <!-- DEKA PRIME -->
     <v-card v-else-if="currentProj.dekaprime_project_id && !currentProj.openstack_project_id" flat class="rounded-lg pa-7">
      <VdcDP v-if="!isloading" />
      <InstanceDP v-if="!isloading" />
      <NetworkDP v-if="!isloading" />
      <EdgeGatewayDP v-if="!isloading" />
    </v-card>

    <!-- DEKA PRIME AND DEKA FLEXI -->
    <v-card v-else class="rounded-lg mt-4 mb-4" flat outlined>
      <template>
        <v-tabs v-model="tab" class="mb-0 mt-2">
          <v-tab class="fz-12 firewall-title" >Deka Flexi</v-tab>
          <v-tab class="fz-12 firewall-title" >Deka Prime</v-tab>
        </v-tabs>
      </template>
      <v-tabs-items v-model="tab" class="mb-2">
        <v-tab-item>
          <v-card flat class="pa-4 ma-4">
            <div class="headline font-weight-bold font--text mb-4">Instance</div>

            <instance />
            <!-- <div class="headline font-weight-bold font--text">Object Storage</div>

            <objectstorage /> -->

            <div class="headline font-weight-bold font--text  mb-4">Storage</div>
            <storage />

            <div class="headline font-weight-bold font--text  mb-4">Image</div>

            <resourceimages />
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card flat class="px-4 ">
            <InstanceDP v-if="!isloading" />
            <NetworkDP v-if="!isloading" />
            <EdgeGatewayDP 
            v-if="!isloading"
            />
          </v-card>
        </v-tab-item>

      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import storage from "../organization/resource/storage";
// import objectstorage from "../organization/resource/objectstorage";
import instance from "../organization/resource/instance";
import resourceimages from "../organization/resource/images";
import { ref, onMounted, reactive } from "@vue/composition-api";
import {
  useNamespacedState,
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { SUPERADMIN } from "../superadmin/namespace";
import { AccessControl } from "@/lib/middleware";
import VdcDP from '../deka-prime/vdc/vdc.vue'
import EdgeGatewayDP from '../superadmin-dp-edgegateway/edge-gateway.vue'
import InstanceDP from '../deka-prime/vdc/vdc-tabs.vue'
import NetworkDP from '../deka-prime/networking/networking.vue'
import { EDGEGATEWAY } from '../superadmin-dp-edgegateway/namespace';

export default {
  props: ["project"],
  components: {
    storage,
    // objectstorage,
    instance,
    resourceimages,
    EdgeGatewayDP,
    InstanceDP,
    NetworkDP,
    VdcDP,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Organization'));
    const loading = ref(true);
    const tab = ref(0)

    const instance = reactive({
      headers: [
        { text: "Name", value: "name" },
        { text: "IP Address", value: "ip" },
        { text: "Region", value: "region" },
        { text: "Created Date", value: "createddate" },
        { text: "Tags", value: "tags" },
        { text: "Action", sortable: false, align: "center", value: "action" },
      ],
    });

    const object_storages = reactive({
      headers: [
        { text: "Name", value: "name" },
        { text: "Size", value: "size" },
        { text: "Created Date", value: "createddate" },
        { text: "Action", sortable: false, align: "center", value: "action" },
      ],
    });

    const storages = reactive({
      headers: [
        { text: "Name", value: "name" },
        { text: "Region", value: "region" },
        { text: "Size", value: "size" },
        { text: "Instance Name", value: "intance" },
        { text: "Created Date", value: "created" },
        { text: "Action", value: "action", sortable: false },
      ],
      data: [],
    });

    const images = reactive({
      headers: [
        { text: "Name", value: "name" },
        { text: "Size", value: "size" },
        { text: "Created Date", value: "created" },
        { text: "Action", value: "action", sortable: false },
      ],
      data: [],
    });

    const { fetchObjectStorages } = useNamespacedActions("OBJECTSTORAGE", [
      "fetchObjectStorages",
    ]);

    const { fetchinstances } = useNamespacedActions("INSTANCE", [
      "fetchinstances",
    ]);

    const { setCurrentProj } = useNamespacedMutations(SUPERADMIN, [
      "setCurrentProj",
    ]);
    const { dekaprimeVdcByProject } = useNamespacedActions(EDGEGATEWAY, ["fetchEdgeGateway", "dekaprimeVdcByProject"])
    const { vdcProject } = useNamespacedGetters(EDGEGATEWAY, ["vdcProject"])

    const currentProj = JSON.parse(localStorage.getItem("currentProj"));
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
    const isloading = ref(false)
    onMounted(async() => {
      fetchObjectStorages()
        fetchinstances()

      // isloading.value = true
      // currentProj.value = JSON.parse(localStorage.getItem("currentProj"));
      // await dekaprimeVdcByProject({projectDPId: currentProj.dekaprime_project_id })
      // localStorage.setItem('vdcById', JSON.stringify(vdcProject.value))
      // isloading.value = false
    });
    return {
      read_only,
      loading,
      instance,
      storages,
      images,
      object_storages,
      ...useNamespacedState("OBJECTSTORAGE", ["objectStorages"]),
      ...useNamespacedState("INSTANCE", ["instances"]),
      currentProj,
      currentOrg,
      tab,
      vdcProject,
      isloading
    };
  },
};
</script>

<style scoped>
.table-title {
  font-family: Fira Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
  padding-top: 30px;
}

.table-status {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-transform: capitalize;
  color: #a5b3bf;
  padding-top: 5px;
  padding-bottom: 20px;
}
</style>