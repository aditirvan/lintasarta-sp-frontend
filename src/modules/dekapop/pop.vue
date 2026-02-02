<template>
  <div>
    <v-row>
      <v-col cols="12" class="py-0">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-7">
            <v-row class="d-flex"
              ><v-col cols="9">
                <div class="headline font-weight-bold font--text">
                  Deka Prime on Premise Usage
                </div>
              </v-col>
              <v-col md="1"></v-col>
              <v-col md="2" v-if="role.toLowerCase() == 'superadmin'">
                <router-link to="/dekapop/create" v-if="!read_only"
                  ><v-btn
                    block
                    color="secondary"
                    dark
                    height="45"
                    width="150"
                    class="fz-14"
                    >Create Deka POP</v-btn
                  ></router-link
                ></v-col
              ></v-row
            >
            <v-row>
              <v-col md="12">
                <v-data-table
                  class="mb-5"
                  :items="getListPop"
                  :headers="headersPop"
                  item-key="id"
                  :single-expand="singleExpand"
                  :expanded.sync="expanded"
                  show-expand
                  hide-default-footer
                  :server-items-length="totalRowsPop"
                >
                  <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length">
                      <v-card class="bs-no pa-4">
                        <v-col
                          class="d-flex justify-center"
                          v-if="!item.license_name"
                        >
                          no data available</v-col
                        >
                        <v-col v-if="item.license_name">
                          <h2>Usage</h2>
                          <v-row>
                            <v-col
                              ><v-row>
                                <v-col sm="12" md="6" class="pt-0"
                                  ><p class="mb-1 font-weight-regular">
                                    Usage Hour
                                  </p>
                                  <span class="font-weight-bold font--text">{{
                                    item.usage_hour
                                  }}</span>
                                </v-col>
                                <v-col sm="12" md="6" class="pt-0"
                                  ><p class="mb-1 font-weight-regular">
                                    Total Core
                                  </p>
                                  <span class="font-weight-bold font--text">{{
                                    item.total_cores
                                  }}</span>
                                </v-col>
                              </v-row></v-col
                            >
                            <v-col
                              ><v-row>
                                <v-col sm="12" md="6" class="pt-0"
                                  ><p class="mb-1 font-weight-regular">
                                    Commitment Core
                                  </p>
                                  <span class="font-weight-bold font--text">{{
                                    item.commitment_core
                                  }}</span>
                                </v-col>
                                <v-col sm="12" md="6" class="pt-0"
                                  ><p class="mb-1 font-weight-regular">
                                    On Demand Core
                                  </p>
                                  <span class="font-weight-bold font--text">{{
                                    item.on_demand_core
                                  }}</span>
                                </v-col>
                              </v-row></v-col
                            >
                          </v-row>
                          <!-- <v-row>
                            <v-col
                              ><v-row>
                                <v-col sm="12" md="6" class="pt-0"
                                  ><p class="mb-1 font-weight-regular">
                                    Tarif Commitment Core
                                  </p>
                                  <span class="font-weight-bold font--text">{{
                                    toIDRWithDotFormat(
                                      item.tariff_commitment_core
                                    )
                                  }}</span>
                                </v-col>
                                <v-col sm="12" md="6" class="pt-0"
                                  ><p class="mb-1 font-weight-regular">
                                    Tarif On Demand Core
                                  </p>
                                  <span class="font-weight-bold font--text">{{
                                    toIDRWithDotFormat(
                                      item.tariff_on_demand_core
                                    )
                                  }}</span>
                                </v-col>
                              </v-row></v-col
                            >
                            <v-col
                              ><v-row>
                                <v-col sm="12" md="6" class="pt-0"
                                  ><p class="mb-1 font-weight-regular">
                                    USD Rate
                                  </p>
                                  <span class="font-weight-bold font--text">{{
                                    toIDRWithDotFormat(item.usd_to_idr_rate)
                                  }}</span>
                                </v-col>
                                <v-col sm="12" md="6" class="pt-0"
                                  ><p class="mb-1 font-weight-regular">
                                    Total Tarif
                                  </p>
                                  <span class="font-weight-bold font--text">{{
                                    toIDRWithDotFormat(item.total_amount)
                                  }}</span>
                                </v-col>
                              </v-row></v-col
                            >
                          </v-row> -->
                          <v-row>
                            <v-col
                              ><v-row>
                                <!-- <v-col sm="12" md="6" class="pt-0"
                                  ><p class="mb-1 font-weight-regular">
                                    Status Payment
                                  </p>
                                  <span class="font-weight-bold font--text">{{
                                    item.status_payment ? "Paid" : "Unpaid"
                                  }}</span>
                                </v-col> -->
                                <v-col sm="12" md="6" class="pt-0"
                                  ><p class="mb-1 font-weight-regular">
                                    Month / Year
                                  </p>
                                  <span class="font-weight-bold font--text"
                                    >{{ item.month }} / {{ item.year }}</span
                                  >
                                </v-col>
                              </v-row></v-col
                            >
                            <v-col
                              ><v-row>
                                <v-col sm="12" md="6" class="pt-0"> </v-col>
                                <v-col sm="12" md="6" class="pt-0">
                                </v-col> </v-row
                            ></v-col>
                          </v-row>
                        </v-col>
                      </v-card>
                    </td>
                  </template>

                  <template #[`item.action`]="{ item }">
                    <popupquote
                      v-model="popo"
                      :offsetTop="20"
                      :coordinate="coordinate"
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
                      <v-list class="cursor-pointer font-weight-bold">
                        <v-list-item>
                          <v-list-item-title
                            ><span class="primary--text"
                              ><router-link :to="`dekapop/details/${item.id}`"
                                >Details</router-link
                              ></span
                            ></v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item v-if="role.toLowerCase() == 'superadmin'">
                          <v-list-item-title v-if="!read_only"
                            ><span class="primary--text"
                              ><router-link :to="`dekapop/edit/${item.id}`"
                                >Edit</router-link
                              ></span
                            ></v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item v-if="role.toLowerCase() == 'superadmin'">
                          <v-list-item-title v-if="!read_only"
                            ><span
                              class="red--text"
                              @click="
                                () => {
                                  dataItem = item;
                                  openDialog = true;
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
    <DeletePop
      :dialog-closed.sync="openDialog"
      :data-item="dataItem"
      v-if="openDialog"
    ></DeletePop>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from "@vue/composition-api";
import { POP } from "./namespace";
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { toIDRWithDotFormat } from "@/lib/formatter";
import DeletePop from "./delete-dekapop.vue";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    DeletePop,
  },
  setup(props, context) {
    const { fetchPop } = useNamespacedActions(POP, ["fetchPop"]);
    const { getListPop, totalRowsPop } = useNamespacedGetters(POP, [
      "getListPop",
      "totalRowsPop",
    ]);
    const currentProj = ref(JSON.parse(localStorage.getItem("currentProj")));
    const role = ref(localStorage.getItem("role"));
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Deka POP"));

    const expanded = ref([]);
    const singleExpand = ref(true);
    const popo = ref(false);
    const coordinate = reactive({ x: 0, y: 0 });
    const showMenu1 = ref(false);
    const activemenuinstance = ref({});
    const openDialog = ref(false);
    const dataItem = ref("");
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

    const headersPop = ref([
      { text: "Usage Meter Name", value: "usage_meter_name", sortable: false },
      { text: "", value: "data-table-expand" },
      //      { text: "Type of License", value: "license_type", sortable: false },
      // { text: "No Contract", value: "no_contract", sortable: false },
      { text: "Product Name", value: "product_name", sortable: false },
      { text: "Service Instance", value: "service_instance", sortable: false },
      { text: "Validity License", value: "validity_license", sortable: false },
      {
        text: "Action",
        sortable: false,
        align: "center",
        value: "action",
        width: "5%",
      },
    ]);

    onMounted(async () => {
      const params = new URLSearchParams();
      params.append("projectId", currentProj.value.id);
      params.append("limit", "10");
      params.append("page", "1");
      params.append("sort", "created_at desc");
      await fetchPop(params);
    });

    const changePage = async (val) => {
      const params = new URLSearchParams();
      params.append("projectId", currentProj.value.id);
      params.append("limit", val.itemsPerPage);
      params.append("page", val.page);
      params.append("sort", "created_at desc");
      await fetchPop(params);
    };

    return {
      headersPop,
      getListPop,
      expanded,
      singleExpand,
      changePage,
      popo,
      coordinate,
      show,
      showMenu1,
      activemenuinstance,
      toIDRWithDotFormat,
      role,
      openDialog,
      dataItem,
      totalRowsPop,
      read_only,
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
::v-deep
  .v-data-table
  > .v-data-table__wrapper
  tbody
  tr.v-data-table__expanded__content {
  box-shadow: none !important;
  background-color: #fbfbfb !important;
}

.bs-no {
  box-shadow: none !important;
}
</style>
