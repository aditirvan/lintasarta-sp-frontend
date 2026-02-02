<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat id="container">
          <!-- <div class="d-flex justify-center" v-if="loadFirewall">
            <v-progress-circular :size="80" color="primary" indeterminate class="ma-10"></v-progress-circular>
          </div> -->

          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="9">
                <div class="firewall-title">Edit Firewall Rules</div>
              </v-col>
            </v-row>
            <br />
            <v-card class="rounded-lg mt-4 mb-4" flat outlined>
              <v-row class="mr-2 ml-2">
                <v-col md="6"
                  ><v-card class="" elevation="0"
                    ><v-col
                      ><p class="mb-0"><b>Name</b></p></v-col
                    >
                    <v-text-field outlined class="mr-2 ml-2" :value="rowFirewallNsxt.name" @input="nameInput = $event"
                    ></v-text-field>
                    <v-col
                      ><p class="mb-0"><b>Action</b></p></v-col
                    >
                    <v-select
                      :items="listAction"
                      item-text="name"
                      item-value="value"
                      outlined
                      class="mr-2 ml-2"
                      :value="rowFirewallNsxt.actionValue"
                      @input="actionInput = $event"
                    ></v-select>
                    <v-col
                      ><p class="mb-0"><b>IP Protocol</b></p></v-col
                    >
                    <v-select
                      :items="listProtocol"
                      item-text="name"
                      item-value="value"
                      outlined
                      class="mr-2 ml-2"
                      :value="rowFirewallNsxt.ipProtocol"
                      @input="protocolInput = $event"
                    ></v-select>
                    <v-col>
                      <p class="font-weight-bold">Comment</p>
                      <v-textarea
                        outlined
                        @input="commentInput = $event"
                        :value="rowFirewallNsxt.comments"
                        placeholder="Insert Comment"
                      ></v-textarea>
                    </v-col>
                    <v-col>
                      <p class="mb-0"><b>State</b></p>
                    </v-col>
                    <v-radio-group :value="rowFirewallNsxt.enabled" @change="stateInput = $event" hide-details class="mr-2 ml-2 mt-0 mb-1" row>
                      <v-row>
                        <v-col>
                          <v-radio label="Enabled" :value="true">
                            <template v-slot:label>
                              <span class="fs-14">Enabled</span>
                            </template>
                          </v-radio>
                        </v-col>

                        <v-col>
                          <v-radio label="Disabled" :value="false">
                            <template v-slot:label>
                              <span class="fs-14">Disabled</span>
                            </template>
                          </v-radio>
                        </v-col>
                      </v-row>
                    </v-radio-group>
                    <!-- <v-col>
                      <p class="mb-0"><b>Logging</b></p>
                    </v-col>
                    <v-radio-group :value="rowFirewallNsxt.logging" @change="loggingInput = $event" hide-details class="mr-2 ml-2 mt-0"  row>
                      <v-row>
                        <v-col>
                          <v-radio label="Enabled" :value="true">
                            <template v-slot:label>
                              <span class="fs-14">Enabled</span>
                            </template>
                          </v-radio>
                        </v-col>

                        <v-col>
                          <v-radio label="Disabled" :value="false">
                            <template v-slot:label>
                              <span class="fs-14">Disabled</span>
                            </template>
                          </v-radio>
                        </v-col>
                      </v-row>
                    </v-radio-group> -->

                  </v-card>
                </v-col>
                <v-col md="6"
                  ><v-card class="" elevation="0"
                    >
                    <v-col
                      md="12"><v-row>
                        <v-col class="pt-0 pb-0 pr-0 d-flex justify-space-between">
                          <p class="mb-0"><b>Applications</b></p>
                          <v-btn
                          style="margin-top:-8px"
                          icon
                          color="primary"
                          @click="
                            () => {
                              openDialogApplications = true;
                            }
                          "
                          ><v-icon class="">mdi-plus</v-icon></v-btn>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-card class="bs ml-2 mr-2 mb-2 scroll" elevation="1">
                      <div v-if="!dataSelectedApp || !dataSelectedApp.length" class="d-flex justify-center mt-10">Any</div>
                      <div v-else>
                        <v-list dense  class="pb-0">
                          <v-list-item-group>
                            <v-list-item v-for="(item, i) in dataSelectedApp" :key="i">
                              <v-list-item-content>
                                <v-list-item-title v-text="item.name" class="fz-14-i"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-icon>
                                <v-icon small color="red" @click="deleteApp(i)">mdi-close</v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </div>
                    </v-card>
                  </v-card>
                  <v-card class="" elevation="0"
                    ><v-col
                      ><v-row>
                        <v-col class="pt-0 pb-0 pr-0 d-flex justify-space-between"
                          ><p class="mb-0"><b>Source</b></p>
                           <v-btn
                          style="margin-top:-8px"
                          icon
                          color="primary"
                          @click="
                            () => {
                              openDialogSource = true;
                              titleDialog = 'Source'
                            }
                          "
                          ><v-icon class="">mdi-plus</v-icon></v-btn>
                          </v-col
                        >
                      </v-row>
                    </v-col>
                    <v-card class="bs ml-2 mr-2 mb-2 scroll" elevation="1">
                      <div v-if="!dataSelectedSource || !dataSelectedSource.length" class="d-flex justify-center mt-10">Any</div>
                      <div v-else>
                        <v-list dense class="pb-0">
                          <v-list-item-group>
                            <v-list-item v-for="(item, i) in dataSelectedSource" :key="i">
                              <v-list-item-content>
                                <v-list-item-title v-text="item.name" class="fz-14-i"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-icon>
                                <v-icon small color="red" @click="deleteSource(i)">mdi-close</v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </div>
                    </v-card>
                  </v-card>
                  <v-card class="" elevation="0"
                    ><v-col
                      ><v-row>
                        <v-col class="pt-0 pb-0 pr-0 d-flex justify-space-between"
                          ><p class="mb-0"><b>Destination</b></p>
                           <v-btn
                          style="margin-top:-8px"
                          icon
                          color="primary"
                          @click="
                            () => {
                              openDialogSource = true;
                              titleDialog = 'Destination'
                            }
                          "
                          ><v-icon class="">mdi-plus</v-icon></v-btn>
                          </v-col
                        >
                      </v-row>
                    </v-col>
                    <v-card class="bs ml-2 mr-2 mb-2 scroll" elevation="1">
                      <div v-if="!dataSelectedDest || !dataSelectedDest.length" class="d-flex justify-center mt-10">Any</div>
                      <v-list dense v-else>
                        <v-list-item-group>
                          <v-list-item v-for="(item, i) in dataSelectedDest" :key="i">
                            <v-list-item-content>
                                <v-list-item-title v-text="item.name" class="fz-14-i"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-icon>
                                <v-icon small color="red" @click="deleteDestination(i)">mdi-close</v-icon>
                              </v-list-item-icon>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mr-2 ml-2 mt-4">
                <v-col>
                  <v-btn :disabled="isLoadingBtn" depressed style="background-color: #a5b3bf !important" block height="50" class="primary" @click="cancel()">
                    <span class="fz-16">Cancel</span>
                  </v-btn>
                </v-col>

                <v-col>
                  <v-btn :disabled="isLoadingBtn" depressed block height="50" class="secondary fz-16" @click="save()" :loading="isLoadingBtn">Save</v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <DialogApplications
    v-if="openDialogApplications"
    v-model="openDialogApplications"
    :dataSelected="dataSelectedApp"
    @sendSelected="dataSelectedApp = $event"
    :isSinggle="false"
    />
    <DialogSummary
    v-if="openDialogSource"
    v-model="openDialogSource"
    :dataSelected="titleDialog == 'Source' ? dataSelectedSource : dataSelectedDest"
    :title="titleDialog"
    @sendSelected="titleDialog == 'Source' ? dataSelectedSource = $event : dataSelectedDest = $event"
    />
    <!-- <DialogAddSource :dialog-source.sync="openSource"></DialogAddSource>
    <DialogIpSource :ip-source.sync="ipSource"></DialogIpSource>
    <DialogIpDestination :ip-destination.sync="ipDestination"></DialogIpDestination>
    <DialogAddDestination :object-destination.sync="objectDestination"></DialogAddDestination>
    <DialogAddService :add-service.sync="addService"></DialogAddService> -->
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedMutations } from "vuex-composition-helpers";
import { DPNETWORK } from "../../../networking/namespace";
import { DPSECURITY } from "../../namespace";
import DialogApplications from './dialog-applications.vue'
import DialogSummary from './dialog-source.vue'
import useVuelidate from '@vuelidate/core';
import { required,} from '@vuelidate/validators'

export default {
  components: {
    DialogApplications,
    DialogSummary,
  },
  setup(props, context) {
    const { refresh } = useNamespacedActions(DPNETWORK, ["refresh"]);
    const {  updateRuleFirewallNsxt, getListFirewallRuleNsxt } = useNamespacedActions(DPSECURITY, [ "updateRuleFirewallNsxt", "getListFirewallRuleNsxt"]);
    const { listRuleFirewallNsxt, rowFirewallNsxt, isLoadingBtn } = useNamespacedGetters(DPSECURITY, [
      "listRuleFirewallNsxt",
      "rowFirewallNsxt",
      "isLoadingBtn"
    ]);
    const { setRowFirewallNsxt } = useNamespacedMutations(DPSECURITY, ["setRowFirewallNsxt"])


    onMounted(() => {
      getListFirewallRuleNsxt(context.root.$route.params.idEdge)
      setRowFirewallNsxt(JSON.parse(localStorage.getItem('rowFirewallNsxt')))
      dataSelectedApp.value = rowFirewallNsxt.value.applicationPortProfiles ? rowFirewallNsxt.value.applicationPortProfiles : []
      dataSelectedSource.value = rowFirewallNsxt.value.sourceFirewallGroups ? rowFirewallNsxt.value.sourceFirewallGroups : []
      dataSelectedDest.value = rowFirewallNsxt.value.destinationFirewallGroups ? rowFirewallNsxt.value.destinationFirewallGroups : []

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

    const nameInput = ref("");
    const actionInput = ref("");
    const protocolInput = ref("");
    const commentInput = ref('')
    const stateInput = ref(true)
    const loggingInput = ref(true)
    const dataSelectedApp = ref([])
    const dataSelectedSource = ref([])
    const dataSelectedDest= ref([])
    const titleDialog = ref('')
    const openDialogApplications = ref(false)
    const openDialogSource = ref(false)

    const selectedItem = ref([]);
    const listAction = ref([
      { name: "Allow", value: "ALLOW" },
      { name: "Drop", value: "DROP" },
      { name: "Reject", value: "REJECT" },
    ]);
    const listProtocol = ref([
      { name: "IPv4", value: "IPV4" },
      { name: "IPv6", value: "IPV6" },
      { name: "IPv4 and IPv6", value: "IPV4_IPV6" },
    ]);

    // const $v = useVuelidate(
    //   {
    //     nameInput: { required },
    //   },
    //   {
    //     nameInput,
    //   })

    const deleteApp = (index) => {
      dataSelectedApp.value.splice(index, 1);
    };
    const deleteSource = (index) => {
      dataSelectedSource.value.splice(index, 1);
    };
    const deleteDestination = (index) => {
      dataSelectedDest.value.splice(index, 1);
    };


    const save = async() => {
      // $v.value.$touch()
      // if ($v.value.$errors.length) {
      //   let container = document.getElementById("container");
      //   container.scrollIntoView({behavior: "smooth"})
      //   return;
      // }
      const id = context.root.$route.params.idEdge;
      const body = {
        // action: actionInput.value ? actionInput.value : detailFirewall.value.action,
        // enabled: true,
        // loggingEnabled: false,
        // name: nameInput.value ? nameInput.value : detailFirewall.value.name,
        // ruleId: detailFirewall.value.ruleId,
        // ruleTag: detailFirewall.value.ruleTag,
        // ruleType: detailFirewall.value.ruleType,
        // application: detailFirewall.value.application,
        // destination: detailFirewall.value.destination,
        // source: detailFirewall.value.source,
        id: rowFirewallNsxt.value.id,
        name: nameInput.value ? nameInput.value : rowFirewallNsxt.value.name,
        description: rowFirewallNsxt.value.description,
        sourceFirewallGroups: dataSelectedSource.value,
        destinationFirewallGroups: dataSelectedDest.value,
        applicationPortProfiles: dataSelectedApp.value,
        ipProtocol: protocolInput.value ? protocolInput.value : rowFirewallNsxt.value.ipProtocol,
        // action: actionInput.value ? actionInput.value : rowFirewallNsxt.value.action,
        actionValue: actionInput.value ? actionInput.value : rowFirewallNsxt.value.actionValue,
        direction: rowFirewallNsxt.value.direction,
        logging: loggingInput.value,
        networkContextProfiles: rowFirewallNsxt.value.networkContextProfiles,
        enabled: stateInput.value,
        version: rowFirewallNsxt.value.version,
        comments: commentInput.value ? commentInput.value : rowFirewallNsxt.value.comments
      };
      let indexRow = listRuleFirewallNsxt.value.findIndex((x) => x.id == body.id)
      listRuleFirewallNsxt.value[indexRow] = body
      let userData = listRuleFirewallNsxt.value.filter( x => x.id != 'default_rule')
      let defaultData = listRuleFirewallNsxt.value.filter( x => x.id == 'default_rule')

      const params = { 
        defaultRules: defaultData,
        userDefinedRules: userData
      };
      await updateRuleFirewallNsxt({id: id, params: params});
      // setTimeout(() => {
        context.root.$router.push(`/dp-security/detail/${context.root.$route.params.name}/${context.root.$route.params.idVdc}/${context.root.$route.params.idEdge}/firewall`);
      // }, 1500);
    };

    const cancel = () => {
      context.root.$router.push(`/dp-security/detail/${context.root.$route.params.name}/${context.root.$route.params.idVdc}/${context.root.$route.params.idEdge}/firewall`);
    };

    onUnmounted(() => {
      localStorage.removeItem('rowFirewallNsxt')
      setRowFirewallNsxt({})
    })

    return {
      selectedItem,
      deleteApp,
      deleteSource,
      save,
      cancel,
      listAction,
      actionInput,
      nameInput,
      rowFirewallNsxt,
      listProtocol,
      protocolInput,
      stateInput,
      commentInput,
      loggingInput,
      openDialogApplications,
      dataSelectedApp,
      openDialogSource,
      dataSelectedSource,
      titleDialog,
      dataSelectedDest,
      deleteDestination,
      isLoadingBtn,
      // $v,
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
