<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card flat class="rounded-lg elevation-0">
          <v-container class="px-7 py-4" fluid>
            <v-row class="d-flex align-center">
              <v-col cols="8">
                <div class="headline mb-2 font-weight-bold font--text">
                  <!-- Deka NFS ( Network File System ) -->
                  NFS
                </div>
                <p style="color: #a5b3bf;">
                  Each NFS is for you to share files in a folder that connect on a network.
                </p>
              </v-col>
              <v-col cols="4" class="d-flex justify-end align-center">
                <v-btn v-if="nfs_list.length > 0" depressed append class="secondary" width="150" height="45"
                @click="() => {
                  validateprivilages(['NFS', 'editor', true]).then(() => {
                    $router.push('network-file-system/create')
                  })
                }">
                  Create NFS
                </v-btn>
              </v-col>
            </v-row>

            <v-row v-if="nfs_list.length > 0">
              <v-col cols="12">
                <v-data-table 
                hide-default-footer 
                :headers="headers" 
                :items="nfs_list" 
                :server-items-length="pagination.itemsLength"
                :items-per-page="pagination.itemsPerPage"
                class="elevation-0">

                  <template v-slot:no-data>
                    {{ isLoading ? "Loading.." : "No data available" }}
                  </template>

                  <template v-slot:item.created_at="{ item }">
                    {{ $moment(item.created_at).format("DD/MM/YYYY") }}
                  </template>

                  <template v-slot:item.size="{ item }">
                    {{ item.size }} {{ item.unit_size }} 
                  </template>


                  <template v-slot:item.action="{ item }">
                    <popupquote
                      v-model="item.open"
                      :offsetTop="21"
                      :documentid="'popup' + item.id"
                      offset-y
                      allow-overflow
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <label
                          v-bind="attrs"
                          class="primary--text linkpointer"
                          style="position: relative; white-space: nowrap"
                          @click="
                            ($event) => {
                              on.click($event);
                              itemSelectedvalue = item;
                            }
                          "
                          >More
                          <v-icon
                            :class="{
                              rotate: item.open,
                            }"
                            :id="'popup' + item.id"
                            color="primary"
                            >mdi-chevron-down</v-icon
                          >
                        </label>
                        <!-- <label v-else class="grey--text">
                          More
                            <v-icon>
                            mdi-chevron-down
                          </v-icon>
                        </label> -->
                      </template>
                      <v-list>
                        <v-list-item
                          :to="itemSelectedvalue.id + '/client'"
                          append
                        >
                          <v-list-item-title>Detail</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                        v-if="item.status != 'On Create' && item.status != 'Error While Creating'"
                        append
                        @click="() => {
                          validateprivilages(['NFS', 'editor', true]).then(() => {
                            selectedItem = item
                            dialog_resize = !dialog_resize
                          })
                        }"
                        >
                          <v-list-item-title>Increase Size</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                        v-else
                        append
                        >
                          <v-list-item-title class="grey--text">Increase Size</v-list-item-title>
                        </v-list-item>
                        <!-- <v-list-item
                          :to="itemSelectedvalue.id + '/client'"
                          append
                        >
                          <v-list-item-title>Show Clients</v-list-item-title>
                        </v-list-item> -->
                        <v-divider />
                        <v-list-item
                          v-if="!read_only"
                          @click="
                            () => {
                              validateprivilages(['NFS', 'editor', true]).then(() => {
                                dialog_delete = true;
                                itemSelectedvalue = item;
                              })
                            }
                          "
                        >
                          <v-list-item-title class="error--text"
                            >Delete</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </popupquote>
                  </template>

                  <template v-slot:item.name="{ item }">
                    <div class="d-flex">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                          v-bind="attrs"
                          v-on="on"
                          :color="item.status == 'Created' ? 'primary' : 'red'" class="mr-3">mdi-circle
                          </v-icon>
                          <!-- <div class="mr-2" v-else>
                            <span>
                              <v-progress-circular
                              v-bind="attrs"
                              v-on="on" :size="25" color="primary" indeterminate></v-progress-circular>
                            </span>
                          </div> -->
                          <div>
                            <router-link :to="'' + item.id" append>
                              <span class="primary--text">{{ item.name }}</span>
                            </router-link>
                          </div>
                        </template>
                        <span>
                          {{ item.status == 'On Create' ? 'Creating' : item.status }}
                        </span>
                      </v-tooltip>
                    </div>
                  </template>

                  <template v-slot:footer="{ props }">
                    <custom-footer-datatable :props="props" 
                      v-if="nfs_list.length"
                      @input="
                        (val) => {
                          options = val;
                          changePage(getNFS, val);
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
                      Looks like you don't have any Network File System
                    </p>
                    <v-row>
                      <v-col>
                        <p style="
                            font-size: 12px;
                            color: #a5b3bf;
                            margin-bottom: 20px;
                          ">
                          Create unlimited NFS service that lets you
                          to share your files and amounts of data in a folder. Each folder
                          can access by other server. Makes your sharing flow data between
                          server on your project more simply
                        </p>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-btn width="100%" append max-width="300" height="50" depressed class="secondary" exact
                        @click="() => {
                          validateprivilages(['NFS', 'editor', true]).then(() => {
                            $router.push('network-file-system/create')
                          })
                        }">
                          Create Network File System
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-if="dialog_delete" v-model="dialog_delete" max-width="500">
      <v-card>
        <v-card-title>
          <div class="headline font-weight-bold font--text pb-4">Destroy Network File System ?</div>
        </v-card-title>
        <v-card-text class="pb-0">
          <p>All your data in this server will be deleted without backup. Are you sure?</p>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn color="accent" :disabled="isLoadingBtn" block depressed height="50" @click="dialog_delete = false"> Cancel </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="error"
                block
                height="50"
                :disabled="isLoadingBtn"
                :loading="isLoadingBtn"
                @click="
                  () => {
                    doDeleteNFS()
                  }
                "
                depressed
              >
                Yes
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <dialogResize
    v-if="dialog_resize"
    v-model="dialog_resize"
    :nfs_detail="selectedItem" />
  </div>
</template>
  
<script>
import { NFS } from "@/modules/network-file-system/namespace";
import { ref, onMounted, computed } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { AccessControl } from "@/lib/middleware";
import dialogResize from "./dialogs/resize.vue";

export default {
  components: {
    dialogResize
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("NFS"));
    let isLoading = ref(true);
    let isLoadingBtn = ref(false);
    const { getNFSList, deleteNFS } = useNamespacedActions(NFS, [
      "getNFSList",
      "deleteNFS",
    ]);
    const {
        validateprivilages,
      } = useNamespacedActions("HOMEPAGE", [
        "validateprivilages",
      ]);
    const { nfs_list, nfs_pagination } = useNamespacedState(NFS, ["nfs_list", "nfs_pagination"]);
    const itemSelectedvalue = ref({});
    const dialog_delete = ref(false);
    const dialog_resize = ref(false);
    const selectedItem = ref()
    const options = ref({});
    const currentProj = ref(JSON.parse(localStorage.getItem("currentProj")));

    const pagination = computed({
      get: () => {
        return {
          itemsLength: nfs_pagination.value.total_data,
          pageCount: nfs_pagination.value.total_page,
          itemsPerPage: nfs_pagination.value.limit,
          page: nfs_pagination.value.page,  
        }
      }
    })

    const headers = ref([
        { text: "Name", value: "name", sortable: false},
        { text: "Zone", value: "zone", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "Quota Size", value: "size", sortable: false },
        { text: "Created Date", value: "created_at", sortable: false },
        { text: "Action", sortable: false, value: "action" },
      ]);

    const changePage = async (func, val) => {
      await func({ page: val.page, limit: val.itemsPerPage } )
    };

    async function getNFS(paginate=null) {
      let params = {project_id: currentProj.value.id}
      if (paginate){
        params = {...params, ...paginate}
      }
      await getNFSList({params: params});
    }

    async function doDeleteNFS() {
      isLoadingBtn.value = true
      context.root.$store.dispatch("HOMEPAGE/showProcessToastWS", `Deleting NFS`, { root: true });
      await deleteNFS(
        {
        params: {
          id: itemSelectedvalue.value.id,
        },
      });
      isLoadingBtn.value = false
      dialog_delete.value = false;
      await getNFS();
    }

    onMounted(async () => {
      await getNFS();
      isLoading.value = false
    });
    return {
      itemSelectedvalue,
      dialog_delete,
      read_only,
      isLoading,
      isLoadingBtn,
      nfs_list,
      headers,
      dialog_resize,
      pagination,
      doDeleteNFS,
      changePage,
      getNFS,
      options,
      selectedItem,
      validateprivilages
    };
  },
};
</script>

<style lang="scss" scoped>
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}
</style>