<template>
  <v-container class="pa-0" fluid>
    <div>
      <v-row>
        <v-col>
          <v-card flat class="rounded-lg elevation-0 pa-3">
            <v-card-title class="pb-0">
              <v-row class="d-flex flex-row" r>
                <div>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                      v-bind="attrs"
                      v-on="on" 
                      style="font-size: 50px;" :color="nfs_detail.status == 'Created' ? 'primary' : 'red'">mdi-circle</v-icon>
                    </template>
                    <span>
                      {{ nfs_detail.status == 'On Create' ? 'Creating' : nfs_detail.status }}
                    </span>
                  </v-tooltip>
                </div>
                <v-col class="py-0" cols="9">
                  <h4>{{ nfs_detail.name }}</h4>
                  <h5>{{ nfs_detail.zone }}</h5>
                  <p class="my-0" style="font-size: 0.8rem">
                    <span class="primary--text">
                      ({{ nfs_detail.node }})
                    </span>
                    in
                    <span class="primary--text font-weight-bold">{{ nfs_detail.path }}
                    </span>
                    | <span>
                        {{ nfs_detail.size }} {{ nfs_detail.unit_size }}
                        <!-- <v-icon class="ml-2" style="width: 13px; height: 13px;">$vuetify.icons.resizeIcon</v-icon> -->
                      </span> 
                      <br>
                      IP Private : {{ nfs_detail.ip_private ? nfs_detail.ip_private : '-' }}
                  </p>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-actions>
              <v-tabs v-model="tab">
                <!-- <v-tab to="overview" replace>Overview</v-tab> -->
                <v-tab to="client" replace>Clients</v-tab>
              </v-tabs>
              <!-- <v-col cols="2" class="d-flex justify-end align-center" v-if="tab == 'client' && nfs_client_list.length > 0">
                <v-btn width="100%" max-width="300" height="30" append depressed class="secondary" exact
                  v-on:click="() => { dialog_add = !dialog_add }">
                  Add Client
                </v-btn>
              </v-col> -->
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-tabs-items v-model="tab">
            <!-- <v-tab-item value="overview">
              <v-card flat class="rounded-lg pa-3">
                <v-card-text class="pa-8">
                  <p class="fz-21 font-weight-bold">Total Usages</p>
                  <v-row>
                    <v-col cols="12" style="padding-top: 0px;">
                      <div class="text-right font-weight-bold" style="font-size: 1.2rem">
                        <br />{{ nfs_detail.current_size }} / {{ nfs_detail.size }} {{ nfs_detail.unit_size }}
                      </div>
                      <v-progress-linear color="light-blue" height="20" :value="calculatePercentage(nfs_detail.current_size, nfs_detail.size)
                        " striped>
                        <template v-slot:default="{ value }">
                          <strong>{{ value }}</strong>
                        </template>
                      </v-progress-linear>
                      <div class="text-right">
                        *value will be updated frequently
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item> -->
            <v-tab-item value="client">
              <v-card flat class="rounded-lg pa-3">
                <v-card-text class="pa-8">
                  <div class="d-flex flex-row" style="align-items: center">
                    <div class="headline font-weight-bold font--text">
                      Clients
                    </div>
                    <v-spacer />
                    <v-btn
                    v-if="tab == 'client' && nfs_client_list.length > 0 && (!read_only && (nfs_detail.status != 'On Create' && nfs_detail.status != 'Error While Creating'))"
                    depressed
                    width="150"
                    height="50"
                    class="secondary"
                    @click="
                      () => { 
                        validateprivilages(['NFS', 'editor', true]).then(() => {
                          dialog_add = !dialog_add  
                        })
                      }
                    "
                    >
                    Add Client
                    </v-btn>
                  </div>

                  <v-row v-if="clientIsLoading">
                    <v-col md="12">
                      <v-card flat class="text-center">
                        <p style="
                              font-size: 16px;
                              margin-bottom: 10px;
                              text-transform: capitalize;
                            " class="font-weight-bold">
                          Loading . . .
                        </p>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row v-else-if="nfs_client_list.length > 0">
                    <v-col cols="12">
                      <v-data-table 
                      hide-default-footer 
                      :headers="headers" 
                      :items="nfs_client_list" 
                      :server-items-length="pagination.itemsLength"
                      :items-per-page="pagination.itemsPerPage"
                        class="elevation-0">

                        <template v-slot:item.action="{ item }">
                          <span class="error--text pr-3 ml-2"
                          v-if="item.status == 'Created'"
                          style="cursor: pointer;"
                          @click="() => {
                            validateprivilages(['NFS', 'editor', true]).then(() => {
                              clientVal = item
                              openDialogDelete = !openDialogDelete
                            })
                          }">Delete</span>

                          <span class="grey--text pr-3 ml-2"
                          v-else>
                          Delete</span>
                        </template>

                        <template v-slot:footer="{ props }">
                          <custom-footer-datatable :props="props" 
                            v-if="nfs_client_list.length"
                            @input="
                              (val) => {
                                options = val;
                                changePage(getNFSClient, val);
                              }
                            "/>
                        </template>

                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-row v-else>
                    <v-col md="12">
                      <v-card flat outlined class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto">
                        <v-card-text style="padding-top: 72px; padding-bottom: 78px">
                          <p style="
                              font-size: 16px;
                              margin-bottom: 10px;
                              text-transform: capitalize;
                            " class="font-weight-bold">
                            Looks like you don't have any client
                          </p>
                          <v-row>
                            <v-col>
                              <v-btn v-if="!read_only && (nfs_detail.status != 'On Create' && nfs_detail.status != 'Error While Creating')" width="100%" max-width="300" height="50" append depressed class="secondary" exact
                                @click="() => { 
                                  validateprivilages(['NFS', 'editor', true]).then(() => {
                                    dialog_add = !dialog_add  
                                  })
                                }">
                                Add Client
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>

                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </div>
    <dialogAddClient v-if="dialog_add" v-model="dialog_add" :nfs_id="nfs_detail.id" />
    <dialogResize v-model="dialog_resize" :nfs_detail="nfs_detail" :nfs_id="nfs_detail.id" />
    <dialogDeleteClient
    v-if="openDialogDelete"
    v-model="openDialogDelete"
    :client="clientVal"
    />
  </v-container>
</template>

<script>
import { NFS } from "@/modules/network-file-system/namespace";
import { ref, onMounted, reactive, computed, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { AccessControl } from "@/lib/middleware";


import dialogAddClient from "./dialogs/add_client.vue";
import dialogResize from "./dialogs/resize.vue";
import dialogDeleteClient from "./dialogs/delete-client.vue";

import {
    mdiAccount,
    mdiDelete,
    mdiPencil,
    mdiShareVariant,
  } from '@mdi/js'

export default {
  components: {
    dialogAddClient,
    dialogResize,
    dialogDeleteClient
  },
  setup(props, context) {
    const id = context.root.$route.params.id;
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("NFS"));
    let isLoading = ref(true);
    const clientSelectedvalue = ref({});
    let clientIsLoading = ref(false);
    const dialog_delete = ref(false);
    const dialog_add = ref(false);
    const dialog_resize = ref(false);
    const openDialogDelete = ref(false);
    const clientVal = ref()
    const options = ref({});
    const { getNFSDetail, updateNFS, getNFSClientList, deleteClient } = useNamespacedActions(NFS, [
      "getNFSDetail",
      "updateNFS",
      "getNFSClientList",
      "deleteClient"
    ]);
    const {
        validateprivilages,
      } = useNamespacedActions("HOMEPAGE", [
        "validateprivilages",
      ]);
    const { nfs_detail, nfs_client_list, nfs_client_pagination } = useNamespacedState(NFS, ["nfs_detail", "nfs_client_list", "nfs_client_pagination"]);
    const tab = ref(null);
    const currentProj = ref(JSON.parse(localStorage.getItem("currentProj")));

    const pagination = computed({
      get: () => {
        return {
          itemsLength: nfs_client_pagination.value.total_data,
          pageCount: nfs_client_pagination.value.total_page,
          itemsPerPage: nfs_client_pagination.value.limit,
          page: nfs_client_pagination.value.page,  
        }
      }
    })

    const headers = ref([
      { text: "Client Name", value: "name", sortable: false },
      { text: "Network Subnet", value: "network_subnet", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Action", sortable: false, value: "action" },
    ]);

    watch(tab, async (newVal, oldVal) => {
      if (newVal === "client") {
        if (!id){
          this.$router.push(`/network-file-system`);
        }
        clientIsLoading.value = true
        await getNFSClient({ params: { id: id } })
        clientIsLoading.value = false
      }
    }
    )

    const changePage = async (func, val) => {
      await func({ page: val.page, limit: val.itemsPerPage } )
    };

    async function getNFSClient(paginate=null) {
      if (!id){
        this.$router.push(`/network-file-system`);
      }
      let params = {id: id}
      if (paginate){
        params = {...params, ...paginate}
      }
      await getNFSClientList({params: params});
    }

    const calculatePercentage = (usageInGB, limitInGB) => {
      if (limitInGB == 0) return "N/A";
      const percentage = (usageInGB / limitInGB) * 100;
      return `${percentage.toFixed(5)}%`;
    };

    onMounted(async () => {
      let res = await getNFSDetail(id)
      if (res && res.status >= 400) {
        location.href = '/network-file-system'
        return
      }
      isLoading.value = false
    });

    return {
      mdiPencil,

      pagination,
      validateprivilages,
      read_only,
      isLoading,
      clientSelectedvalue,
      dialog_delete,
      dialog_add,
      dialog_resize,
      tab,
      headers,
      clientIsLoading,
      nfs_client_list,
      nfs_client_pagination,
      nfs_detail,
      options,
      calculatePercentage,
      changePage,
      getNFSClient,
      openDialogDelete,
      clientVal
    };
  },
};
</script>
<style lang="scss" scoped>

.text-danger { color: #EB5757 }
.v-window.v-item-group {
  background-color: transparent;
}

.v-input-append {
  ::v-deep .v-input__slot {
    background: #eee !important;
  }
}
</style>