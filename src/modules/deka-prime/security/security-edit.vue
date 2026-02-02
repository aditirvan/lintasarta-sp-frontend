<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <div class="d-flex justify-center" v-if="loadFirewall">
            <v-progress-circular :size="80" color="primary" indeterminate class="ma-10"></v-progress-circular>
          </div>

          <v-container fluid class="px-7 py-4" v-else>
            <v-row>
              <v-col cols="9">
                <div class="firewall-title">Edit Firewall Rules</div>
              </v-col>
            </v-row>
            <br />
            <v-card class="rounded-lg mt-4 mb-4" flat outlined>
              <v-row class="mr-2 ml-2">
                <v-col md="6"
                  ><v-card class="bs" elevation="1"
                    ><v-col
                      ><p class="mb-0"><b>Name</b></p></v-col
                    >
                    <v-text-field outlined class="mr-2 ml-2" :value="detailFirewall.name" @input="nameInput = $event"></v-text-field>
                    <v-col
                      ><p class="mb-0"><b>Action</b></p></v-col
                    >
                    <v-select
                      :items="listAction"
                      item-text="name"
                      item-value="value"
                      outlined
                      class="mr-2 ml-2"
                      :value="detailFirewall.action"
                      @input="actionInput = $event"
                    ></v-select>
                  </v-card>
                </v-col>
                <v-col md="6"
                  ><v-card class="bs" elevation="1"
                    ><v-col
                      ><v-row>
                        <v-col class="pt-0 pb-0 pr-0"
                          ><p class="mb-0"><b>Source</b></p></v-col
                        >
                        <v-col class="d-flex justify-end pt-0 pb-0 pl-0">
                          <v-row>
                            <v-col class="d-flex justify-end pt-0 pb-0 pl-0 pr-0"
                              ><v-btn
                                width="90"
                                outlined
                                color="primary"
                                @click="
                                  () => {
                                    ipSource = true;
                                  }
                                "
                                ><v-icon small class="mt-1" left>mdi-plus</v-icon> IP</v-btn
                              ></v-col
                            >
                            <v-col class="d-flex justify-end pt-0 pb-0 pl-0"
                              ><v-btn
                                width="90"
                                outlined
                                color="primary"
                                @click="
                                  () => {
                                    openSource = true;
                                  }
                                "
                                ><v-icon small class="mt-1" left>mdi-plus</v-icon> Add</v-btn
                              ></v-col
                            >
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-card class="bs ml-2 mr-2 mb-2 scroll" elevation="1">
                      <div v-if="!detailFirewall.source" class="d-flex justify-center mt-10">Any</div>
                      <div v-else>
                        <v-list dense v-if="detailFirewall.source.vnicGroupId" class="pb-0">
                          <v-list-item-group>
                            <v-list-item v-for="(item, i) in detailFirewall.source.vnicGroupId" :key="i">
                              <v-list-item-content>
                                <v-list-item-title v-text="item" class="fz-14-i"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-icon>
                                <v-icon small color="red" @click="deleteSourceObject(i)">mdi-close</v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                        <v-list dense v-if="detailFirewall.source.ipAddress" class="pb-0 pt-0">
                          <v-list-item-group>
                            <v-list-item v-for="(item, i) in detailFirewall.source.ipAddress" :key="i">
                              <v-list-item-content>
                                <v-list-item-title v-text="item" class="fz-14-i"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-icon>
                                <v-icon small color="red" @click="deleteSourceIp(i)">mdi-close</v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                        <v-list dense v-if="detailFirewall.source.groupingObjectId" class="pt-0">
                          <v-list-item-group>
                            <v-list-item v-for="(item, i) in detailFirewall.source.groupingObjectId" :key="i">
                              <v-list-item-content>
                                <v-list-item-title v-text="item" class="fz-14-i"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-icon>
                                <v-icon small color="red" @click="deleteSourceGroup(i)">mdi-close</v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </div>
                    </v-card>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mr-2 ml-2">
                <v-col md="6"
                  ><v-card class="bs" elevation="1"
                    ><v-col
                      ><v-row>
                        <v-col class="pt-0 pb-0 pr-0"
                          ><p class="mb-0"><b>Destination</b></p></v-col
                        >
                        <v-col class="d-flex justify-end pt-0 pb-0 pl-0">
                          <v-row>
                            <v-col class="d-flex justify-end pt-0 pb-0 pl-0 pr-0"
                              ><v-btn
                                width="90"
                                outlined
                                color="primary"
                                @click="
                                  () => {
                                    ipDestination = true;
                                  }
                                "
                                ><v-icon small class="mt-1" left>mdi-plus</v-icon> IP</v-btn
                              ></v-col
                            >
                            <v-col class="d-flex justify-end pt-0 pb-0 pl-0"
                              ><v-btn
                                width="90"
                                outlined
                                color="primary"
                                @click="
                                  () => {
                                    objectDestination = true;
                                  }
                                "
                                ><v-icon small class="mt-1" left>mdi-plus</v-icon> Add</v-btn
                              ></v-col
                            >
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-card class="bs ml-2 mr-2 mb-2 scroll" elevation="1">
                      <div v-if="!detailFirewall.destination" class="d-flex justify-center mt-10">Any</div>
                      <div v-else>
                        <v-list dense v-if="detailFirewall.destination.vnicGroupId" class="pb-0">
                          <v-list-item-group>
                            <v-list-item v-for="(item, i) in detailFirewall.destination.vnicGroupId" :key="i">
                              <v-list-item-content>
                                <v-list-item-title v-text="item" class="fz-14-i"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-icon>
                                <v-icon small color="red" @click="deleteDestinationObject(i)">mdi-close</v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                        <v-list dense v-if="detailFirewall.destination.ipAddress" class="pb-0 pt-0">
                          <v-list-item-group>
                            <v-list-item v-for="(item, i) in detailFirewall.destination.ipAddress" :key="i">
                              <v-list-item-content>
                                <v-list-item-title v-text="item" class="fz-14-i"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-icon>
                                <v-icon small color="red" @click="deleteDestinationIp(i)">mdi-close</v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                        <v-list dense v-if="detailFirewall.destination.groupingObjectId" class="pt-0">
                          <v-list-item-group>
                            <v-list-item v-for="(item, i) in detailFirewall.destination.groupingObjectId" :key="i">
                              <v-list-item-content>
                                <v-list-item-title v-text="item" class="fz-14-i"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-icon>
                                <v-icon small color="red" @click="deleteDestinationGroup(i)">mdi-close</v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </div>
                    </v-card>
                  </v-card>
                </v-col>
                <v-col md="6"
                  ><v-card class="bs" elevation="1"
                    ><v-col
                      ><v-row>
                        <v-col class="pt-0 pb-0 pr-0"
                          ><p class="mb-0"><b>Service</b></p></v-col
                        >
                        <v-col class="d-flex justify-end pt-0 pb-0 pl-0"
                          ><v-btn
                            outlined
                            color="primary"
                            @click="
                              () => {
                                addService = true;
                              }
                            "
                            ><v-icon small class="mt-1" left>mdi-plus</v-icon> Add</v-btn
                          ></v-col
                        >
                      </v-row>
                    </v-col>
                    <v-card class="bs ml-2 mr-2 mb-2 scroll" elevation="1">
                      <div v-if="!detailFirewall.application" class="d-flex justify-center mt-10">Any</div>
                      <v-list dense v-else>
                        <v-list-item-group>
                          <v-list-item v-for="(item, i) in detailFirewall.application.service" :key="i">
                            <v-list-item-content>
                              <v-list-item-title class="fz-14-i"
                                >{{ item.protocol }} : <span v-if="item.protocol == 'icmp'">{{ item.icmpType }}</span
                                ><span v-else v-for="(data, index) in item.port" :key="index"
                                  >{{ data }} : <span v-for="(dt, index) in item.sourcePort" :key="index">{{ dt }}</span></span
                                ></v-list-item-title
                              >
                            </v-list-item-content>

                            <v-list-item-icon>
                              <v-icon small color="red" @click="deleteService(i)">mdi-close</v-icon>
                            </v-list-item-icon>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mr-2 ml-2">
                <v-col>
                  <v-btn depressed style="background-color: #a5b3bf !important" block height="50" :disabled="loadUpdate" class="primary" @click="cancel()">
                    <span class="fz-16">Cancel</span>
                  </v-btn>
                </v-col>

                <v-col>
                  <v-btn depressed block height="50" class="secondary fz-16" @click="save()" :disabled="loadUpdate" :loading="loadUpdate">Save</v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <DialogAddSource :dialog-source.sync="openSource"></DialogAddSource>
    <DialogIpSource :ip-source.sync="ipSource"></DialogIpSource>
    <DialogIpDestination :ip-destination.sync="ipDestination"></DialogIpDestination>
    <DialogAddDestination :object-destination.sync="objectDestination"></DialogAddDestination>
    <DialogAddService :add-service.sync="addService"></DialogAddService>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPNETWORK } from "../networking/namespace";
import { DPSECURITY } from "./namespace";
import DialogAddSource from "./tabs-dialog-firewall/dialog-add-source.vue";
import DialogIpSource from "./tabs-dialog-firewall/dialog-ip-source.vue";
import DialogIpDestination from "./tabs-dialog-firewall/dialog-ip-destination.vue";
import DialogAddDestination from "./tabs-dialog-firewall/dialog-add-destination.vue";
import DialogAddService from "./tabs-dialog-firewall/dialog-add-service.vue";

export default {
  components: {
    DialogAddSource,
    DialogIpSource,
    DialogIpDestination,
    DialogAddDestination,
    DialogAddService,
  },
  setup(props, context) {
    const { refresh } = useNamespacedActions(DPNETWORK, ["refresh"]);
    const { getDetailFirewallNsxv, updateDetailRuleNsxv } = useNamespacedActions(DPSECURITY, ["getDetailFirewallNsxv", "updateDetailRuleNsxv"]);
    // const { getListCatalog } = useNamespacedActions(CATALOG, ["getListCatalog"]);
    // const { getListTemplateVm } = useNamespacedActions(VDC, ["getListTemplateVm"]);
    const { detailFirewall, loadFirewall, loadUpdate, detailAllEdge } = useNamespacedGetters(DPSECURITY, [
      "detailFirewall",
      "loadFirewall",
      "loadUpdate",
      "detailAllEdge",
    ]);

    onMounted(() => {
      const params = {
        idEdge: context.root.$route.params.idEdge,
        idRule: context.root.$route.params.idRule,
      };
      getDetailFirewallNsxv(params);
      setInterval(() => {
        const deka = localStorage.getItem("dekaPrime");
        if (deka) {
          refresh();
        } else {
          return;
        }
      }, 1000 * 60 * 10);
      //   getListTemplateVm();
      //   getListCatalog();
      refresh();
    });
    const openSource = ref(false);
    const ipSource = ref(false);
    const ipDestination = ref(false);
    const objectDestination = ref(false);
    const addService = ref(false);
    const actionInput = ref("");
    const nameInput = ref("");
    const selectedItem = ref([]);
    const listSource = ref([]);
    const listAction = ref([
      { name: "Accept", value: "accept" },
      { name: "Deny", value: "deny" },
    ]);

    const deleteSourceObject = (index) => {
      detailFirewall.value.source.vnicGroupId.splice(index, 1);
    };
    const deleteSourceIp = (index) => {
      detailFirewall.value.source.ipAddress.splice(index, 1);
    };
    const deleteSourceGroup = (index) => {
      detailFirewall.value.source.groupingObjectId.splice(index, 1);
    };
    const deleteDestinationIp = (index) => {
      detailFirewall.value.destination.ipAddress.splice(index, 1);
    };
    const deleteDestinationObject = (index) => {
      detailFirewall.value.destination.vnicGroupId.splice(index, 1);
    };
    const deleteDestinationGroup = (index) => {
      detailFirewall.value.destination.groupingObjectId.splice(index, 1);
    };
    const deleteService = (index) => {
      detailFirewall.value.application.service.splice(index, 1);
    };

    const save = () => {
      const body = {
        action: actionInput.value ? actionInput.value : detailFirewall.value.action,
        enabled: true,
        loggingEnabled: false,
        name: nameInput.value ? nameInput.value : detailFirewall.value.name,
        ruleId: detailFirewall.value.ruleId,
        ruleTag: detailFirewall.value.ruleTag,
        ruleType: detailFirewall.value.ruleType,
        application: detailFirewall.value.application,
        destination: detailFirewall.value.destination,
        source: detailFirewall.value.source,
      };
      const id = {
        idEdge: context.root.$route.params.idEdge,
        idRule: context.root.$route.params.idRule,
      };
      const params = { id: id, body: body };
      updateDetailRuleNsxv(params);
      setTimeout(() => {
        context.root.$router.push(`/dp-security/${detailAllEdge.value.Name}/${context.root.$route.params.idVdc}/${context.root.$route.params.idEdge}/2`);
      }, 1500);
    };

    const cancel = () => {
      context.root.$router.push(`/dp-security/${detailAllEdge.value.Name}/${context.root.$route.params.idVdc}/${context.root.$route.params.idEdge}/2`);
    };

    return {
      openSource,
      ipSource,
      ipDestination,
      objectDestination,
      selectedItem,
      deleteSourceObject,
      deleteSourceIp,
      deleteDestinationIp,
      deleteDestinationObject,
      deleteService,
      deleteSourceGroup,
      deleteDestinationGroup,
      listSource,
      save,
      cancel,
      listAction,
      detailFirewall,
      loadFirewall,
      addService,
      actionInput,
      nameInput,
      loadUpdate,
      detailAllEdge,
    };
  },
};
</script>

<style lang="scss" scoped>
.bs {
  box-shadow: none !important;
  border: 1px solid rgb(2 0 0 / 12%);
}
.scroll {
  height: 150px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: hidden;
  background-color: transparent;
}

.fz-14-i {
  font-size: 14px !important;
}
</style>
