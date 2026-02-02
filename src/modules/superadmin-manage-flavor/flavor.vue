<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row class="d-flex justify-center mb-5"
              ><v-col md="6" sm="12">
                <div class="headline font-weight-bold font--text">List Flavor</div>
              </v-col>
              <v-col md="6" sm="12">
                <v-row class="justify-end">
                  <v-col md="6" sm="12">
                    <router-link to="/manage-flavor/flavor-type"
                      ><v-btn block color="secondary" dark height="45" width="150" class="fz-14" outlined>Manage Type</v-btn>
                    </router-link></v-col
                  >
                  <v-col md="6" sm="12" v-if="!read_only">
                    <router-link to="/manage-flavor/create-flavor"
                      ><v-btn block color="secondary" dark height="45" width="150" class="fz-14">Create Flavor</v-btn>
                    </router-link></v-col
                  >
                </v-row>
              </v-col>
            </v-row>
            <v-row class="d-flex">
              <v-col sm="12" md="3" class="pt-0 pb-0">
                <v-select outlined :items="listAllTypeFlavor" item-text="name" item-value="id" v-model="selectType" @change="changeType($event)"></v-select>
              </v-col>

              <v-col sm="12" md="3" class="pt-0 pb-0">
                <v-select placeholder="Region" v-model="region" :items="selectAllRegions" @change="getFlavorbyRegion($event)" outlined> </v-select>
              </v-col>

              <v-col sm="12" md="3" class="pt-0 pb-0">
                <v-select
                  placeholder="Processor"
                  v-model="processor"
                  :items="processorAllType"
                  item-value="value"
                  item-text="name"
                  @change="getFlavorbyProcessor($event)"
                  outlined
                >
                </v-select>
              </v-col>

              <v-col sm="12" md="3" class="pt-0 pb-0">
                <v-text-field outlined v-model="searchData" placeholder="Search" @input="searchFlavor($event)"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-data-table
                  :headers="headers"
                  :items="listManageFlavor"
                  item-key="id"
                  single-line
                  class="elevation-0"
                  :loading="loadingGetFlavor"
                  :server-items-length="totalFlavor.count"
                  hide-default-footer
                >
                  <template #[`item.type_id`]="{ item }">
                    <v-row>
                      <v-col
                        ><span>{{ getNameType(item.type_id) }}</span>
                      </v-col>
                    </v-row>
                  </template>

                  <template #[`item.vcpu`]="{ item }">
                    <v-col>{{ item.vcpu }} vCPU</v-col>
                  </template>
                  <template #[`item.ram`]="{ item }">
                    <v-col>{{ item.ram }} GB</v-col>
                  </template>

                  <template #[`item.status`]="{ item }">
                    <v-switch
                      v-model="item.status"
                      inset
                      :false-value="'deactive'"
                      :true-value="'active'"
                      @click="
                        () => {
                          dialogActive = read_only ? false : true;
                          dataFlavor = item;
                        }
                      "
                      readonly
                    ></v-switch>
                  </template>

                  <template #[`item.action`]="{ item }">
                    <popupquote v-model="popo" :offsetTop="20" :coordinate="coordinate" :documentid="'popup' + item.id" offset-y allow-overflow>
                      <template v-slot:activator="{ on, attrs }">
                        <label
                          v-bind="attrs"
                          class="primary--text linkpointer"
                          style="position: relative; white-space: nowrap"
                          @click="
                            ($event) => {
                              on.click($event);
                              show($event, item);
                            }
                          "
                          >More
                          <v-icon
                            :class="{
                              rotate: item.id == activemenuinstance && popo,
                            }"
                            :id="'popup' + item.id"
                            color="primary"
                            >mdi-chevron-down
                          </v-icon>
                        </label>
                      </template>
                      <v-list class="cursor-pointer font-weight-bold" width="100">
                        <v-list-item>
                          <v-list-item-title
                            ><span
                              @click="
                                () => {
                                  dialogEdit = true;
                                  editFlavor = item;
                                  statusAction = 'detail';
                                }
                              "
                              >Detail</span
                            ></v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item :disabled="read_only">
                          <v-list-item-title
                            ><span
                              @click="
                                () => {
                                  dialogEdit = true;
                                  editFlavor = item;
                                  statusAction = 'edit';
                                }
                              "
                              >Edit</span
                            ></v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item :disabled="read_only">
                          <v-list-item-title
                            ><span
                              class="red--text"
                              @click="
                                () => {
                                  openDialog = true;
                                  detailFlavor = item;
                                }
                              "
                              >Delete</span
                            ></v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </popupquote>
                  </template>
                  <template v-slot:footer="{ props }">
                    <custom-footer-datatable
                      @input="
                        (val) => {
                          options = val;
                          changePage(val);
                        }
                      "
                      :props="props"
                    />
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <deleteFlavor :dialog-closed.sync="openDialog" v-if="openDialog" :detail-flavor="detailFlavor"></deleteFlavor>
    <dialogActiveFlavor v-if="dialogActive" :dialog-active.sync="dialogActive" :data-flavor="dataFlavor"></dialogActiveFlavor>
    <dialogEditDetailFlavor v-if="dialogEdit" :dialog-edit.sync="dialogEdit" :edit-flavor="editFlavor" :status-action="statusAction"></dialogEditDetailFlavor>
  </div>
</template>

<script>
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import popupquote from "@/modules/customsharedcomponents/popupquote.vue";
import deleteFlavor from "./delete-flavor";
import { SUPERADMINMANAGEFLAVOR } from "./namespace";
import { AccessControl } from "@/lib/middleware";
import dialogActiveFlavor from "./diaolgActiveFlavor.vue";
import dialogEditDetailFlavor from "./edit-detail-flavor.vue";
import { useRegion } from "@/modules/instance/compositionapi/useregion";

export default {
  components: {
    popupquote,
    deleteFlavor,
    dialogActiveFlavor,
    dialogEditDetailFlavor,
  },
  setup(props, context) {
    const { getListManageFlavor, fetchManageInstanceFlavors, getTypeFlavors } = useNamespacedActions(SUPERADMINMANAGEFLAVOR, [
      "getListManageFlavor",
      "fetchManageInstanceFlavors",
      "getTypeFlavors",
    ]);
    const { listManageFlavor, loadingGetFlavor, totalFlavor, listTypeFlavor } = useNamespacedGetters(SUPERADMINMANAGEFLAVOR, [
      "listManageFlavor",
      "loadingGetFlavor",
      "totalFlavor",
      "listTypeFlavor",
    ]);
    const { selectregions: selectRegions, fetchregions } = useRegion();
    onMounted(() => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      // getListManageFlavor(params);
      fetchManageInstanceFlavors(params);
      getTypeFlavors();
      fetchregions();
    });

    const listAllTypeFlavor = computed(() => {
      const all = [{ name: "All", id: "" }];
      return all.concat(listTypeFlavor.value);
    });
    const selectAllRegions = computed(() => {
      const all = [{ text: "All", value: { name: "", ID: "" } }];
      return all.concat(selectRegions.value);
    });
    const processorAllType = computed(() => {
      const all = [{ name: "All", value: "" }];
      return all.concat(processorType.value);
    });
    const processorType = ref([
      { name: "Intel", value: "intel" },
      { name: "AMD High Core", value: "amd_high_core" },
      { name: "AMD High CPU", value: "amd_high_cpu" },
    ]);

    const headers = ref([
      { text: "Name", value: "flavor_name", sortable: false },
      { text: "Type", value: "type_id", sortable: false },
      { text: "Region", value: "region", sortable: false },
      { text: "vCPU", value: "vcpu", sortable: false, width: "10%" },
      { text: "RAM", value: "ram", sortable: false, width: "10%" },
      { text: "Status", value: "status", sortable: false },
      { text: "Action", value: "action", sortable: false },
    ]);
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Manage Flavor"));

    const region = ref({ text: "All", value: { name: "", ID: "" } });
    const processor = ref("");
    const statusAction = ref("");
    const dialogEdit = ref(false);
    const editFlavor = ref("");
    const dialogActive = ref(false);
    const dataFlavor = ref("");
    const selectType = ref("");
    const searchData = ref("");
    const options = ref({});
    const detailFlavor = ref({});
    const openDialog = ref(false);
    const popo = ref(false);
    const coordinate = reactive({ x: 0, y: 0 });
    const show = (e, instance) => {
      e.preventDefault();
      activemenuinstance.value = instance.id;
      showMenu1.value = false;
      coordinate.x = e.clientX - 20;
      coordinate.y = e.clientY + 10;
      context.root.$nextTick(() => {
        showMenu1.value = true;
      });
    };
    const showMenu1 = ref(false);
    const activemenuinstance = ref({});
    const changePage = (val) => {
      const params = new URLSearchParams();
      params.append("limit", val.itemsPerPage);
      params.append("page", val.page);
      fetchManageInstanceFlavors(params);
    };
    const getNameType = (val) => {
      const data = listTypeFlavor.value.find((ele) => ele.id == val);
      return data?.name;
    };
    const changeType = (val) => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      params.append("type_id", val);
      params.append("region", region.value.name ? region.value.name : "");
      params.append("processor", processor.value ? processor.value : "");
      fetchManageInstanceFlavors(params);
    };
    const searchFlavor = (val) => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      params.append("search", val);
      fetchManageInstanceFlavors(params);
    };
    const getFlavorbyRegion = (val) => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      params.append("type_id", selectType.value ? selectType.value : "");
      params.append("region", val.name);
      params.append("processor", processor.value ? processor.value : "");
      fetchManageInstanceFlavors(params);
    };
    const getFlavorbyProcessor = (val) => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      params.append("type_id", selectType.value ? selectType.value : "");
      params.append("region", region.value.name ? region.value.name : "");
      params.append("processor", val);
      fetchManageInstanceFlavors(params);
    };

    return {
      listManageFlavor,
      headers,
      popo,
      coordinate,
      show,
      showMenu1,
      activemenuinstance,
      openDialog,
      listTypeFlavor,
      getNameType,
      changePage,
      options,
      read_only,
      totalFlavor,
      loadingGetFlavor,
      detailFlavor,
      listAllTypeFlavor,
      selectType,
      searchData,
      changeType,
      searchFlavor,
      dialogActive,
      dataFlavor,
      dialogEdit,
      editFlavor,
      statusAction,
      selectAllRegions,
      selectRegions,
      processorAllType,
      processorType,
      processor,
      region,
      getFlavorbyRegion,
      getFlavorbyProcessor,
    };
  },
};
</script>

<style lang="scss" scoped>
[role="menu"] {
  margin-top: 12px;
}
.title {
  margin-bottom: 10px;
  text-transform: capitalize;
}
.cl {
  color: #a5b3bf;
}

.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}
</style>
