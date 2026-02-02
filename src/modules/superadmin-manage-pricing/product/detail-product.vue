<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-card flat outlined class="rounded-lg">
              <v-row
                ><v-col cols="12">
                  <v-card-text class="headline font-weight-bold font--text">Detail Product</v-card-text>
                  <v-divider></v-divider>
                  <v-card-text class="pb-0">
                    <v-row>
                      <v-col sm="12" md="6" class="pt-0 pb-0"
                        ><p>Name</p>
                        <span class="font-weight-bold font--text">{{ $route.params.name }}</span>
                      </v-col>
                      <v-col sm="12" md="6" class="pt-0 pb-0"
                        ><p>Status</p>
                        <span class="font-weight-bold font--text">{{ detailProduct.status == 1 ? "Active" : "Shutoff" }}</span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <br />
                  <br />
                  <v-card-text class="headline font-weight-bold font--text">Service</v-card-text>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-row class="d-flex justify-center"
                      ><v-col cols="9"> </v-col>
                      <v-col md="1"></v-col>
                      <v-col md="2">
                        <router-link :to="`/manage-pricing/create-service/${$route.params.name}/${$route.params.id}`" v-if="!read_only"
                          ><v-btn block color="secondary" dark depressed height="45" width="150" class="fz-14">Create Service</v-btn>
                        </router-link></v-col
                      ></v-row
                    >
                    <v-row>
                      <v-col md="12">
                        <v-data-table
                          :headers="headers"
                          :items="listServiceProduct"
                          item-key="id"
                          single-line
                          class="elevation-0"
                          hide-default-footer
                          :server-items-length="totalListServiceProduct"
                        >
                          <template #[`item.name`]="{ item }">
                            <v-row>
                              <v-col class="ml-2"
                                ><span>{{ item.name }}</span>
                              </v-col>
                            </v-row>
                          </template>
                          <template #[`item.created_at`]="{ item }">
                            <span>{{ $FormatDate(item.created_at) }}</span>
                          </template>

                          <template #[`item.status`]="{ item }">
                            <v-switch class="mt-0 mb-2" hide-details :true-value="1" :false-value="0" flat readonly v-model="item.status"></v-switch>
                          </template>

                          <template #[`item.service_tag`]="{ item }">
                            <span v-for="(row, index) in item.service_tag" :key="index">
                              {{ filterTag(row.tag_id) }} <span v-if="index != item.service_tag.length - 1">,</span>
                            </span>
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
                                          dialogDetail = true;
                                          dataService = item;
                                        }
                                      "
                                      >Detail</span
                                    ></v-list-item-title
                                  >
                                </v-list-item>
                                <v-list-item :disabled="read_only">
                                  <v-list-item-title
                                    ><router-link :to="`/manage-pricing/edit-service/${$route.params.name}/${$route.params.id}/${item.name}/${item.id}`"
                                      >Edit</router-link
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
                                          dataService = item;
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
                  </v-card-text>
                  <br />
                  <br />
                  <v-card-text class="pb-0">
                    <v-row>
                      <v-col cols="6">
                        <v-btn depressed color="#a5b3bf" class="white--text" block height="50" to="/manage-pricing/product">
                          <span class="fz-16">Back</span>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <DeleteService :dialog-closed.sync="openDialog" :data-service="dataService" v-if="openDialog"></DeleteService>
    <DetailService :dialog-detail.sync="dialogDetail" :data-service="dataService" v-if="dialogDetail"></DetailService>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";
import popupquote from "@/modules/customsharedcomponents/popupquote.vue";
import DeleteService from "../service/delete-service.vue";
import { AccessControl } from "@/lib/middleware";
import DetailService from "../service/detail-service.vue";

export default {
  components: {
    popupquote,
    DeleteService,
    DetailService,
  },
  setup(props, context) {
    const { getDetailProduct, getListTags, getListServiceProduct } = useNamespacedActions(SUPERADMINMANAGEPRICING, [
      "getDetailProduct",
      "getListTags",
      "getListServiceProduct",
    ]);
    const { detailProduct, listTags, listServiceProduct, totalListServiceProduct } = useNamespacedGetters(SUPERADMINMANAGEPRICING, [
      "detailProduct",
      "listTags",
      "listServiceProduct",
      "totalListServiceProduct",
    ]);
    onMounted(() => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      const payload = {
        id: context.root.$route.params.id,
        params: params,
      };
      getDetailProduct(context.root.$route.params.id);
      getListServiceProduct(payload);
      getListTags(params);
    });
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Manage Pricing"));

    const headers = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Slug", value: "slug", sortable: false },
      { text: "Tags", value: "service_tag", sortable: false },
      { text: "Created Date", value: "created_at", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Action", value: "action", sortable: false },
    ]);

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
    const filterTag = (row) => {
      const data = listTags.value.find((item) => {
        if (item.id == row) {
          return item;
        }
      });
      return data?.name;
    };
    const dataService = ref({});
    const changePage = (val) => {
      const params = new URLSearchParams();
      params.append("limit", val.itemsPerPage);
      params.append("page", val.page);
      const payload = {
        id: context.root.$route.params.id,
        params: params,
      };
      getListServiceProduct(payload);
    };

    return {
      detailProduct,
      headers,
      popo,
      coordinate,
      show,
      showMenu1,
      activemenuinstance,
      listTags,
      filterTag,
      dataService,
      openDialog,
      changePage,
      read_only,
      totalListServiceProduct,
      listServiceProduct,
      dialogDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
[role="menu"] {
  margin-top: 12px;
}

.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}

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
</style>
