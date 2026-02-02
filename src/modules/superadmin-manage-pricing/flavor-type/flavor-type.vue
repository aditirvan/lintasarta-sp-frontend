<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4" v-if="listFlavor.length == 0">
            <v-card flat outlined class="rounded-lg">
              <v-col md="12">
                <v-card flat class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto">
                  <v-card-text class="pb-10 pt-10">
                    <p class="font-weight-bold title fz-16">Looks like you don’t have any Flavor</p>
                    <v-row>
                      <v-col>
                        <p class="fz-12 mb-5 cl">Create firts your flavor</p>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-btn
                          width="100%"
                          append
                          max-width="300"
                          height="50"
                          depressed
                          class="secondary fz-14"
                          exact
                          to="/manage-pricing/create-flavor"
                          v-if="!read_only"
                        >
                          Create Flavor
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-card>
          </v-container>
          <v-container fluid class="px-7 py-4" v-else>
            <v-row class="d-flex justify-center"
              ><v-col cols="9">
                <div class="headline font-weight-bold font--text">List Flavor</div>
              </v-col>
              <v-col md="1"></v-col>
              <v-col md="2">
                <router-link to="/manage-pricing/create-flavor" v-if="!read_only"
                  ><v-btn block color="secondary" dark height="45" width="150" class="fz-14">Create Flavor</v-btn>
                </router-link></v-col
              ></v-row
            >
            <v-row>
              <v-col md="12">
                <v-data-table
                  :headers="headers"
                  :items="listFlavor"
                  item-key="id"
                  single-line
                  class="elevation-0"
                  hide-default-footer
                  :loading="loadingGet"
                  :server-items-length="totalFlavor"
                >
                  <template #[`item.name`]="{ item }">
                    <v-row>
                      <v-col cols="1" class="d-flex pa-2"
                        ><v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon :color="item.status == 0 ? 'error' : 'primary'" v-bind="attrs" v-on="on" size="30">mdi-circle</v-icon>
                          </template>
                          <span>{{ item.status == 0 ? "Shutoff" : "Active" }}</span>
                        </v-tooltip></v-col
                      >
                      <v-col class="ml-4"
                        ><span>{{ item.name }}</span>
                      </v-col>
                    </v-row>
                  </template>
                  <template #[`item.created_at`]="{ item }">
                    <span>{{ $FormatDate(item.created_at) }}</span>
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
                          <v-list-item-title><router-link :to="`/manage-pricing/detail-flavor/${item.name}/${item.id}`">Detail</router-link></v-list-item-title>
                        </v-list-item>
                        <v-list-item :disabled="read_only">
                          <v-list-item-title><router-link :to="`/manage-pricing/edit-flavor/${item.name}/${item.id}`">Edit </router-link></v-list-item-title>
                        </v-list-item>
                        <v-list-item :disabled="read_only">
                          <v-list-item-title
                            ><span
                              class="red--text"
                              @click="
                                () => {
                                  openDialog = true;
                                  dataFlavor = item;
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
    <deleteFlavor :dialog-closed.sync="openDialog" :data-flavor="dataFlavor" v-if="openDialog"></deleteFlavor>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import popupquote from "@/modules/customsharedcomponents/popupquote.vue";
import deleteFlavor from "./delete-flavor";
import { AccessControl } from "@/lib/middleware";
import { SUPERADMINMANAGEPRICING } from "../namespace";

export default {
  components: {
    popupquote,
    deleteFlavor,
  },
  setup(props, context) {
    const { getListFlavor } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["getListFlavor"]);
    const { listFlavor, loadingGet, totalFlavor } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["listFlavor", "loadingGet", "totalFlavor"]);
    onMounted(() => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      getListFlavor(params);
    });
    const headers = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Description", value: "description", sortable: false },
      { text: "Created", value: "created_at", sortable: false },
      { text: "Action", value: "action", sortable: false, width: "15%" },
    ]);
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Manage Pricing"));

    const options = ref({});
    const dataFlavor = ref({});
    const popo = ref(false);
    const openDialog = ref(false);
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
      getListFlavor(params);
    };

    return {
      headers,
      popo,
      coordinate,
      show,
      showMenu1,
      activemenuinstance,
      openDialog,
      dataFlavor,
      changePage,
      options,
      read_only,
      listFlavor,
      totalFlavor,
      loadingGet,
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
