<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4" v-if="listTags.length == 0">
            <v-card flat outlined class="rounded-lg">
              <v-col md="12">
                <v-card flat class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto">
                  <v-card-text class="pb-10 pt-10">
                    <p class="font-weight-bold title fz-16">Looks like you don’t have any Tags</p>
                    <v-row>
                      <v-col>
                        <p class="fz-12 mb-5 cl">Create firts your Tags</p>
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
                          to="/manage-pricing/create-tags"
                          v-if="!read_only"
                        >
                          Create Tags
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
                <div class="headline font-weight-bold font--text">List Tags</div>
              </v-col>
              <v-col md="1"></v-col>
              <v-col md="2">
                <router-link to="/manage-pricing/create-tags" v-if="!read_only"
                  ><v-btn block color="secondary" dark depressed height="45" width="150" class="fz-14">Create Tags</v-btn>
                </router-link></v-col
              ></v-row
            >
            <v-row>
              <v-col md="12">
                <v-data-table
                  :headers="headers"
                  :items="listTags"
                  item-key="id"
                  single-line
                  class="elevation-0"
                  :loading="loadingListTags"
                  hide-default-footer
                  :server-items-length="totalTags"
                >
                  <template #[`item.name`]="{ item }">
                    <v-row>
                      <v-col
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
                        <v-list-item :disabled="read_only">
                          <v-list-item-title
                            ><span
                              class="primary--text"
                              @click="
                                () => {
                                  dialogEdit = true;
                                  dataTags = item;
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
                                  dataTags = item;
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
    <deleteTags :dialog-closed.sync="openDialog" :data-tags="dataTags" v-if="openDialog"></deleteTags>
    <EditTags :dialog-edit.sync="dialogEdit" :data-tags="dataTags" v-if="dialogEdit"></EditTags>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";
import popupquote from "@/modules/customsharedcomponents/popupquote.vue";
import deleteTags from "./delete-tags.vue";
import EditTags from "./edit-tags.vue";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    popupquote,
    deleteTags,
    EditTags,
  },
  setup(props, context) {
    const { getListTags } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["getListTags"]);
    const { listTags, loadingListTags, totalTags } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["listTags", "loadingListTags", "totalTags"]);
    onMounted(() => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      getListTags(params);
    });

    const headers = ref([
      // { text: "ID", value: "id", sortable: false },
      { text: "Name", value: "name", sortable: false },
      { text: "Unit", value: "unit", sortable: false },
      { text: "Created", value: "created_at", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Action", value: "action", sortable: false, width: "15%" },
    ]);
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Manage Pricing"));

    const dataTags = ref({});
    const openDialog = ref(false);
    const dialogEdit = ref(false);
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
    const options = ref({});
    const changePage = (val) => {
      const params = new URLSearchParams();
      params.append("limit", val.itemsPerPage);
      params.append("page", val.page);
      getListTags(params);
    };

    return {
      headers,
      popo,
      coordinate,
      show,
      showMenu1,
      activemenuinstance,
      loadingListTags,
      listTags,
      openDialog,
      dataTags,
      options,
      changePage,
      read_only,
      totalTags,
      dialogEdit,
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
