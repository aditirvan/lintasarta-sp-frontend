<template>
  <div>
    <v-card
      v-if="!loadBalancers.length && !isLoading"
      flat
      class="pa-7 rounded-0 rounded-b-lg"
    >
      <v-row>
        <v-col md="12">
          <v-card
            flat
            outlined
            class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
          >
            <v-card-text style="padding-top: 72px; padding-bottom: 78px">
              <p
                style="
                  font-size: 16px;
                  margin-bottom: 10px;
                  text-transform: capitalize;
                "
                class="font-weight-bold"
              >
                Looks like you don’t have any Load Balancers
              </p>
              <v-row>
                <v-col>
                  <p
                    style="
                      font-size: 12px;
                      color: #a5b3bf;
                      margin-bottom: 20px;
                    "
                  >
                    Load Balancers let you distribute traffic between multiple
                    Instance and are a good way to horizontally scale your app.
                    They’re fully managed by Lintasarta—no set up or configuration
                    required.
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    v-if="!read_only"
                    width="100%"
                    append
                    max-width="300"
                    height="50"
                    depressed
                    class="secondary"
                    exact
                    to="/network/loadbalancer/create"
                  >
                    Create Load Balancer
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-else flat class="mt-7 rounded-lg pa-7">
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p style="font-size: 24px; font-weight: 600" class="mb-0">
            Load Balancer
          </p>
          <v-spacer />
          <v-btn
            v-if="!read_only"
            depressed
            width="180"
            class="secondary"
            to="/network/loadbalancer/create"
          >
            <span class="fz-14">Create Load Balancer</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :hide-default-footer="true"
            :headers="headers"
            :items-per-page="10"
            :items="loadBalancers"
            class="elevation-0"
          >
            <template v-slot:no-data>
              {{ isLoading ? "Loading.." : "No data available" }}
            </template>
            <template v-slot:item.operating_status="{ item }">
              <span v-if="item.engine.loadbalancer.operating_status">{{
                item.engine.loadbalancer.operating_status
              }}</span>
              <span v-else>-</span>
            </template>
            <template v-slot:item.provisioning_status="{ item }">
              <span v-if="item.engine.loadbalancer.provisioning_status">{{
                item.engine.loadbalancer.provisioning_status
              }}</span>
              <span v-else>-</span>
            </template>
            <template v-slot:item.name="{ item }">
              <p class=" mb-0">
                <router-link
                  :to="{ path: `/network/loadbalancer/${item.id}` }"
                  tag="button"
                  :disabled="!item.openstack_uuid"
                  :class="{ 'primary--text': item.openstack_uuid }"
                  >{{ item.name }}</router-link
                >
              </p>
              <p>
                {{ item.region }} / {{ item.instance_ids.length }}
                {{ item.instance_ids.length > 1 ? "Instances" : "Instance" }}
              </p>
            </template>
            <template v-slot:item.status="{ item }">
              <span v-if="item.error_message" class="error--text">
                <v-tooltip
                  top
                  color="#333"
                  transition="slide-y-reverse-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <span v-on="on" v-bind="attrs">ERROR</span>
                  </template>
                  <span>Message: {{ item.error_message }}</span>
                </v-tooltip>
              </span>
              <span
                v-else-if="
                  item.openstack_uuid &&
                    item.engine &&
                    item.engine.loadbalancer &&
                    item.engine.loadbalancer.admin_state_up
                "
                >UP</span
              >
              <span
                class="error--text"
                v-else-if="
                  item.openstack_uuid &&
                    item.engine &&
                    item.engine.loadbalancer &&
                    !item.engine.loadbalancer.admin_state_up
                "
                >DOWN</span
              >
              <v-progress-linear
                v-else-if="!item.error_message && !item.openstack_uuid"
                color="blue"
                height="25"
                striped
                rounded
                indeterminate
              >
                Building
              </v-progress-linear>
            </template>
            <template v-slot:item.ipaddress="{ item }">
              <span>{{
                item.vpc ? `Gateway: ${item.vpc.ip_gateway}` : ""
              }}</span>
              <br />
              <span>{{
                item.engine.loadbalancer.vip_address
                  ? `Internal: ${item.engine.loadbalancer.vip_address}`
                  : ""
              }}</span>
              <br />
              <span v-if="item.floating_ip">{{
                item.floating_ip
                  ? `External: ${item.floating_ip.ip_address}`
                  : ""
              }}</span>
            </template>
            <template v-slot:item.healthcheck="{ item }"
              >Healthy Threshold : {{ item.health_check.max_healthy
              }}<br />Unhealthy Threshold :
              {{ item.health_check.max_unhealthy }}
            </template>
            <template v-slot:item.rules="{ item }">
              {{ item.rules.length }}
            </template>
            <template v-slot:item.created="{ item }">
              {{ $moment(new Date(item.created_at)).format("DD/MM/YYYY") }}
            </template>
            <template v-slot:item.action="{ item }">
              <div>
                <router-link
                  :to="{ path: `${item.id}/settings` }"
                  tag="button"
                  append
                  :class="{ 'primary--text': item.openstack_uuid }"
                  :disabled="!item.openstack_uuid || disabledField"
                  class="mr-4"
                  >Edit</router-link
                >
                <span
                  :disabled="disabledField"
                  style="cursor:pointer"
                  class="error--text"
                  @click="
                    () => {
                      validateprivilages(['Network', 'editor']).then(() => {
                        opendialogdeletedload = true;
                        selectedLB = item;
                      });
                    }
                  "
                  >Delete</span
                >
              </div>
            </template>
            <template v-slot:footer="{ props }">
              <custom-footer-datatable :props="props" />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
    <dialogDeleteLoad
      v-model="opendialogdeletedload"
      :loadBalancer="selectedLB"
      @close="opendialogdeletedload = false"
    />
  </div>
</template>

<script>
import { useNamespacedActions } from "vuex-composition-helpers";

import { onMounted, ref } from "@vue/composition-api";
import network from "../NetworkComposition";
import dialogDeleteLoad from "./dialogDeleteLoad";
import { useLoadBalancer } from "./useLoadBalancer";
import localstorage from "@/lib/localstorage";

import { AccessControl } from "@/lib/middleware";

export default {
  components: { dialogDeleteLoad },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Network'));
    const { loadbalances } = network();

    const selectedLB = ref(null);

    const { fetchLoadBalancers, loadBalancers } = useLoadBalancer();

    const disabledField = ref(false);
    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);

    validateprivilagesyncnew(["Images", "editor"]).then((res) => {
      disabledField.value = res;
    });

    const headers = ref([
      { text: "Name", value: "name" },
      { text: "Status", value: "status" },
      { text: "Provisioning Status", value: "provisioning_status" },
      { text: "Operating Status", value: "operating_status" },
      { text: "IP Address", value: "ipaddress" },
      { text: "Health Check", value: "healthcheck" },
      { text: "Rules", value: "rules" },
      { text: "Region", value: "region" },
      { text: "Created", value: "created" },
      { text: "Action", value: "action", align: "center" },
    ]);

    onMounted(() => {
      if(read_only.value){
        headers.value.pop()
      }
      fetchLoadBalancers();
    });
    return {
      read_only,

      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
      disabledField,
      selectedLB,
      opendialogdeletedload: ref(false),
      loadbalances,
      loadBalancers,
      headers,
      ...useLoadBalancer(),
    };
  },
  computed: {
    userType() {
      return localstorage.getItem("type");
    },
    userRole() {
      return localstorage.getItem("role");
    },
  },
};
</script>

<style scoped>
.v-btn {
  height: 55px !important;
}
</style>
