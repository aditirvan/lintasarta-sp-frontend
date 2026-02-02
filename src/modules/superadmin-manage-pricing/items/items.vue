<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col>
                <p class="headline font-weight-bold font--text">Notes</p>
                <ul>
                  <li><p class="pa-0 ma-0">The Pricing for custom Deka Box & Deka Storage can be obtained from Modul Services.</p></li>
                  <li><p class="pa-0 ma-0">The Pricing for Deka Agent, Snaphost, Daily Backup & Floating IP can be obtained from Modul Services.</p></li>
                  <li><p class="pa-0 ma-0">The pricing for the Managed Services package and add-ons is independently managed.</p></li>
                  <li><p class="pa-0 ma-0">The pricing for the Paid OS is independently managed.</p></li>
                </ul>
              </v-col>
            </v-row>
          </v-container>

          <v-container fluid class="px-7">
            <v-row>
              <v-col cols="2" class="pt-0 pb-0 d-flex align-self-center">
                <div class="headline font-weight-bold font--text">List Items</div>
              </v-col>
              <v-col class="pt-0 pb-0">
                <v-row class="justify-end">
                  <v-col md="3">
                    <v-select
                      outlined
                      :items="listProduct"
                      item-text="name"
                      item-value="id"
                      v-model="inputProduct"
                      @change="filterProduct($event)"
                      placeholder="Filter By Product"
                      clearable
                    ></v-select>
                  </v-col>
                  <v-col md="3" v-if="inputProduct">
                    <v-select
                      outlined
                      :items="dataService"
                      item-text="name"
                      item-value="id"
                      v-model="inputService"
                      @change="filterService($event)"
                      placeholder="Filter By Service"
                      clearable
                    ></v-select>
                  </v-col>
                  <v-col md="3">
                    <v-text-field placeholder="Search" outlined @input="search($event)"></v-text-field>
                  </v-col>
                  <v-col md="3">
                    <router-link to="/manage-pricing/add-item"
                      ><v-btn block color="secondary" dark height="50" class="fz-14" depressed>Create Items</v-btn>
                    </router-link></v-col
                  >
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-data-table
                  :headers="headers"
                  :items="listItems"
                  item-key="id"
                  single-line
                  class="elevation-0"
                  :loading="loadingListItems"
                  hide-default-footer
                  :server-items-length="totalItems"
                >
                  <template #[`item.name`]="{ item }">
                    <v-row>
                      <v-col
                        ><span>{{ item.name }}</span>
                      </v-col>
                    </v-row>
                  </template>
                  <template #[`item.product`]="{ item }">
                    <span>{{ item.product.name || "-" }}</span>
                  </template>
                  <template #[`item.service_id`]="{ item }">
                    <span>{{ formatService(item.service_id) || "-" }}</span>
                  </template>
                  <template #[`item.created_at`]="{ item }">
                    <span>{{ $FormatDate(item.created_at) }}</span>
                  </template>
                  <template #[`item.status`]="{ item }">
                    <v-switch class="mt-0 mb-2" hide-details :true-value="1" :false-value="0" flat readonly v-model="item.status"></v-switch>
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
                              class="primary--text"
                              @click="
                                () => {
                                  dataItem = item;
                                  dialogDetail = true;
                                }
                              "
                              >Detail</span
                            ></v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title><router-link :to="`/manage-pricing/update-item/${item.name}/${item.id}`">Edit</router-link></v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title
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
                  <template v-slot:footer="{ props }" v-if="totalItems >= 5">
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
    <deleteItem :dialog-closed.sync="openDialog" :data-item="dataItem" v-if="openDialog"></deleteItem>
    <DialogDetail :dialog-detail.sync="dialogDetail" :data-item="dataItem" v-if="dialogDetail"></DialogDetail>
  </div>
</template>

<script>
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";
import popupquote from "@/modules/customsharedcomponents/popupquote.vue";
import deleteItem from "./delete-item.vue";
import DialogDetail from "./detail-item.vue";
// import { AccessControl } from "@/lib/middleware";
import ActivityItems from "./activity-items.vue";

export default {
  components: {
    popupquote,
    deleteItem,
    DialogDetail,
    ActivityItems,
  },
  setup(props, context) {
    const { getListItems, getListService, getListProduct } = useNamespacedActions(SUPERADMINMANAGEPRICING, [
      "getListItems",
      "getListService",
      "getListProduct",
    ]);
    const { listItems, loadingListItems, totalItems, listService, listProduct } = useNamespacedGetters(SUPERADMINMANAGEPRICING, [
      "listItems",
      "loadingListItems",
      "totalItems",
      "listService",
      "listProduct",
    ]);
    onMounted(() => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");

      const params1 = new URLSearchParams();
      params1.append("limit", "999");
      params1.append("page", "1");
      params1.append("status", "1");
      params1.append("allow_item", true);

      getListItems(params);
      getListService();
      getListProduct(params1);
    });
    // const access_control = new AccessControl(context.root.$store);
    // const read_only = ref(access_control.is_read_mode("Manage Pricing"));

    const headers = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Product", value: "product", sortable: false },
      { text: "Service", value: "service_id", sortable: false },
      { text: "Created", value: "created_at", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Action", value: "action", sortable: false, width: "12%" },
    ]);

    const tabItems = ref("");
    const dataService = ref([]);
    const inputService = ref("");
    const inputProduct = ref("");
    const dataItem = ref("");
    const openDialog = ref(false);
    const dialogDetail = ref(false);
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
      getListItems(params);
    };

    const formatService = (id) => {
      const data = listService.value.find((item) => item.id == id);
      return data?.name;
    };

    const filterProduct = async (val) => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      params.append("product_id", val ? val : "");

      let res = await getListItems(params);
      if (res.status == 200) {
        dataService.value = listItems.value.map((item) => {
          return { id: item.service_id, name: formatService(item.service_id) };
        });
      }
    };
    const filterService = (val) => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      params.append("product_id", inputProduct.value ? inputProduct.value : "");
      params.append("service_id", val ? val : "");
      getListItems(params);
    };

    const search = (val) => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      params.append("search", val);
      params.append("product_id", inputProduct.value ? inputProduct.value : "");
      params.append("service_id", inputService.value ? inputService.value : "");
      getListItems(params);
    };

    return {
      headers,
      popo,
      coordinate,
      show,
      showMenu1,
      activemenuinstance,
      listItems,
      loadingListItems,
      openDialog,
      dataItem,
      changePage,
      // read_only,
      totalItems,
      listService,
      formatService,
      search,
      listProduct,
      inputProduct,
      filterProduct,
      inputService,
      filterService,
      dataService,
      dialogDetail,
      tabItems,
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

// ::v-deep .v-text-field--outlined > .v-input__control > .v-input__slot {
//   min-height: 50px !important;
// }

.v-input--is-label-active {
  ::v-deep .v-input--switch__track {
    background-color: #27ae60;
    opacity: 1 !important;
  }

  ::v-deep .v-input--switch__thumb {
    background-color: white;
  }
}

.v-input--switch {
  ::v-deep .v-input--switch__track {
    height: 20px;
    width: 42px;
    border-radius: 10px;
  }

  ::v-deep .v-input--selection-controls__ripple {
    display: none;
  }

  ::v-deep .v-input--switch__thumb {
    left: 8px;
    top: 8.5px;
    height: 12px;
    width: 12px;
  }
}

::v-deep .v-item-group.theme--light.v-slide-group.v-tabs-bar.v-tabs-bar--is-mobile.primary--text {
  display: grid;
}
::v-deep .v-tabs-bar {
  height: 71px;
}
</style>
