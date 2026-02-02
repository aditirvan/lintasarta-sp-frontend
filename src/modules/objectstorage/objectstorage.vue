<template>
  <!-- <p>instance</p> -->
  <div>
    <!-- contoh template -->
    <v-row>
      <v-col cols="12">
        <v-card flat class="rounded-lg elevation-0">
          <v-container class="px-7 py-4" fluid>
            <v-row class="d-flex align-center">
              <v-col cols="8">
                <div class="headline mb-2 font-weight-bold font--text">
                  Deka Box 
                </div>
                <p style="color: #a5b3bf;">
                  each bucket is for you to store and serve files.
                </p>
              </v-col>
              <v-col
                cols="4"
                class="d-flex justify-end align-center"
                v-if="!read_only"
              >
                <v-btn
                  depressed
                  append
                  to="create"
                  class="secondary"
                  width="150"
                  height="45"
                  v-if="objectStorages.length > 0"
                >
                  Create Deka Box
                </v-btn>
              </v-col>
            </v-row>
            <v-row
              v-if="isLoading || (!isLoading && objectStorages.length > 0)"
            >
              <v-col cols="12">
                <v-data-table
                  hide-default-footer
                  :headers="headers"
                  :items="objectStorages"
                  :items-per-page="10"
                  class="elevation-0"
                >
                  <template v-slot:no-data>
                    {{ isLoading ? "Loading.." : "No data available" }}
                  </template>
                  <template v-slot:item.name="{ item }">
                    <div class="d-flex">
                      <v-icon color="primary" class="mr-3">mdi-circle</v-icon>
                      <div>
                        <router-link :to="'' + item.id" append>
                          <span class="primary--text">{{ item.name }}</span>
                        </router-link>
                        <p></p>
                      </div>
                    </div>
                  </template>

               
                  
                  <template v-slot:item.billing_type="{ item }">
                    <span class="v-badge v-badge--inline theme--light" v-if="item.billing_type == 'Trial' && item.trial_voucher_expired">
                      {{ item.billing_type }}
                      <span class="v-badge__wrapper">
                        <span aria-atomic="true" aria-label="Badge" aria-live="polite" role="status" class="v-badge__badge pink">
                          Expired
                        </span>
                      </span>
                    </span>
                    <span v-else-if="item.billing_type">
                      {{ getBillingTypeLabel(item.billing_type) }}
                    </span>
                    <span v-else>-</span>
                  </template>

                  <template v-slot:item.status="{ item }">
                    <v-progress-linear
                      v-if="item.is_deleting"
                      color="blue"
                      height="25"
                      striped
                      rounded
                      indeterminate
                    >
                      Deleting
                    </v-progress-linear>
                    <span v-else class="">Active</span>
                  </template>

                  <template v-slot:item.size="{ item }">
                    <p>
                      {{
                        item.package_object_storage && item.package_object_storage.object_storage_size
                          ? `${item.package_object_storage.object_storage_size} GB`
                          : "N/A"
                      }}
                    </p>
                  </template>

                  <template v-slot:item.createddate="{ item }">
                    {{ $moment(item.created_at).format("DD/MM/YYYY") }}
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
                              show($event, item);
                              selectedObjectStorage = item;
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
                      </template>
                      <v-list>
                        <v-list-item
                          :disabled="disabledField || item.is_deleting"
                          :to="selectedObjectStorage.id + '/overview'"
                          append
                        >
                          <v-list-item-title>Show Details</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="!read_only"
                          :disabled="disabledField || item.is_deleting"
                          :to="selectedObjectStorage.id + '/access-keys'"
                          append
                        >
                          <v-list-item-title
                            >Manage Access Keys</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item 
                          v-if="!read_only"
                          :disabled="disabledField || item.is_deleting" 
                          @click="
                                () => {
                                  dialogIncreaseVol = true;
                                }
                              ">
                          <v-list-item-title
                            >Increase Size</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item
                          v-if="!read_only"
                          :disabled="disabledField || item.is_deleting"
                          :to="selectedObjectStorage.id + '/settings'"
                          append
                        >
                          <v-list-item-title>Settings</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="!read_only"
                          :disabled="disabledField || item.is_deleting"
                          @click="
                            () => {
                              validateprivilages([
                                'Object Storage',
                                'editor',
                              ]).then(() => {
                                openDialogDestroy = true;
                                objectStorageToDelete = item;
                              });
                            }
                          "
                        >
                          <v-list-item-title :class="{'error--text': !disabledField || !item.is_deleting,'secondary--text':disabledField || item.is_deleting}"
                            >Delete</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </popupquote>
                  </template>
                  <template
                    v-if="objectStorages.length > 5"
                    v-slot:footer="{ props }"
                  >
                    <custom-footer-datatable :props="props" />
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="12">
                <v-card
                  flat
                  outlined
                  class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
                >
                  <v-card-text style="padding-top: 72px; padding-bottom: 78px">
                    <p
                      style="
                        font-size: 16px;
                        margin-bottom: 10px;
                        text-transform: capitalize;
                      "
                      class="font-weight-bold"
                    >
                      Looks like you don't have any Deka Box
                    </p>
                    <v-row>
                      <v-col>
                        <p
                          style="
                            font-size: 12px;
                            color: #a5b3bf;
                            margin-bottom: 20px;
                          "
                        >
                          Create unlimited deka box service that lets you
                          store and serve large amounts of data. Each bucket is
                          for you to store and serve files. The free, improves
                          performance, and reduces bandwidth and infrastructure
                          costs.
                        </p>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col v-if="!read_only">
                        <v-btn
                          width="100%"
                          append
                          max-width="300"
                          height="50"
                          depressed
                          class="secondary"
                          exact
                          to="/object-storage/create"
                        >
                          Create Deka Box
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-menu
              v-model="showMenu"
              :position-x="x - 10"
              :position-y="y"
              absolute
              allow-overflow
            >
            </v-menu>
            <dialogDestroyObjectStorage
              v-model="openDialogDestroy"
              @close="
                () => {
                  openDialogDestroy = false;
                }
              "
              @confirm="deleteS3"
            />
            <dialogMovetoProject
              v-model="dialogMoveto"
              @close="
                () => {
                  dialogMoveto = false;
                }
              "
            />
            <dialogIncreaseVolume 
              v-if="dialogIncreaseVol"
              v-model="dialogIncreaseVol"
              :objectStorage="selectedObjectStorage"
              @close="
                () => {
                  dialogIncreaseVol = false;
                }
              "
            />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { onMounted, ref } from "@vue/composition-api";
import { useNamespacedActions } from "vuex-composition-helpers";
import customFooterDatatable from "../customsharedcomponents/custom-footer-datatable.vue";
import { useObjectStorage } from "./composableapi/useobjectstorage";
import dialogDestroyObjectStorage from "./dialogDestroyObjectStorage";
import dialogMovetoProject from "./dialogMoveto";
import dialogIncreaseVolume from "./dialogIncreaseVolume";
import localstorage from "@/lib/localstorage";

import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    customFooterDatatable,
    dialogDestroyObjectStorage,
    dialogMovetoProject,
    dialogIncreaseVolume,
  },
  setup(props, context) {
    const Composable = {
      ...useObjectStorage(),
    };

    const {
      selectedObjectStorage,
      deleteObjectStorage,
      fetchObjectStorages,
      isLoading,
    } = Composable;

    onMounted(async () => {
      await fetchObjectStorages();
    });

    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Object Storage'));
    const selected = ref("list");

    function isSelected(val) {
      return selected.value == val;
    }

    const disabledField = ref(false);
    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);

    validateprivilagesyncnew(["Object Storage", "editor"]).then((res) => {
      disabledField.value = res;
    });

    const openDialogDestroy = ref(false);
    const objectStorageToDelete = ref(null);
    const deleteS3 = async () => {
      const response = await deleteObjectStorage({
        id: objectStorageToDelete.value.id,
      });
      if (response.status == 200) {
        openDialogDestroy.value = false;
      }
    };

    const getBillingTypeLabel = (type) => {
      if (type == 'PPU') return 'Pay Per Use'
      else return type
    }
    return {
      read_only,
      
      getBillingTypeLabel,
      validateprivilages,
      disabledField,
      validateprivilagesync,
      validateprivilagesyncnew,
      objectStorageToDelete,
      selectedObjectStorage,
      isLoading,
      deleteS3,
      dialogMoveto: ref(false),
      openDialogDestroy,
      ...Composable,
      selected,
      isSelected,
    };
  },
  computed: {
    userType() {
      return localstorage.getItem("type");
    },
    userRole() {
      return localstorage.getItem("role");
    },
  },
  data() {
    return {
      showMenu: false,
      dialogIncreaseVol: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Billing Type", value: "billing_type" },
        { text: "Status", value: "status" },
        { text: "Quota Size", value: "size" },
        { text: "Type", value: "object_storage_region.type_region" },
        { text: "Created Date", value: "createddate" },
        { text: "Action", sortable: false, value: "action" },
      ],
      x: 0,
      y: 0,
    };
  },
  methods: {
    selectpage(e, options) {
      options.itemsPerPage = e;
    },
    show(e, item) {
      this.selectedObjectStorage = item;
      e.preventDefault();
      
      this.showMenu = false;
      this.x = e.clientX - 20;
      this.y = e.clientY + 10;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
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
p {
  margin-bottom: 0px;
  .ipaddress {
    display: inline-block;
    width: 50px;
    position: relative;
    .tik {
      position: absolute;
      right: 10px;
      display: inline-block;
    }
  }
}
.select-view {
  border: 6px solid #f2f2f2;
  border-radius: 4px;
  background-color: #f2f2f2;
  opacity: 0.5;
  &.selected {
    opacity: 1;
  }
}

.instanceinfo {
  .col:first-child {
    p {
      font-weight: 700;
    }
  }
  .col {
    padding: 0px 0px 0px 12px;
    font-size: 10px;
  }
}
</style>
<style lang="scss">
#DataTableListObjectStorage {
  font-weight: 600;
  td {
    padding-top: 20px;
    padding-bottom: 14px;
  }
}
</style>
