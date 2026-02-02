<template>
  <v-card flat class="rounded-lg">
    <v-card-text class="px-0 pb-0 pt-2 rounded-lg">
      <v-tabs v-model="tab" slider-size="4">
        <v-tab>
          <span class="ml-4" style="font-size: 16px">Instance </span>
        </v-tab>
        <v-tab>
          <span style="font-size: 16px">
            {{ isDevModeStorageTiering ? "Storage" : "Volume" }}
          </span>
        </v-tab>
        <v-tab>
          <span style="font-size: 16px">Object Storage </span>
        </v-tab>
        <v-tab v-if="isDevMode">
          <span style="font-size: 16px">Restore</span>
        </v-tab>
        <v-tab v-if="isDevModeChargingForSnapshot">
          <span style="font-size: 16px">Snapshot</span>
        </v-tab>
        <v-tab v-if="isDevModeFloatingIP">
          <span style="font-size: 16px">Floating IP</span>
        </v-tab>

        <!-- <v-tab>
          <span style="font-size: 16px">Restore</span>
        </v-tab>

        <v-tab>
          <span style="font-size: 16px">Backup</span>
        </v-tab>

        <v-tab>
          <span style="font-size: 16px">Load Balancer</span>
        </v-tab> -->
      </v-tabs>
    </v-card-text>
    <v-tabs-items style="border-top: 0.5px solid #e0e0e0" v-model="tab">
      <!-- INSTANCE -->
      <v-tab-item>
        <v-card-text class="d-flex pa-8 flex-row align-center">
          <div class="headline font-weight-bold font--text">Default Instance Price</div>
        </v-card-text>
        <v-card-text class="px-8">
          <v-data-table
            :hide-default-footer="true"
            :headers="defaultPriceHeaders"
            :items-per-page="10"
            :items="[defaultcpu, defaultram, defaultgpu]"
            class="elevation-0"
          >
            <template v-slot:item.name="{ item }">
              <!-- <span v-if="item.name && item.name == 'ram'">
                {{ item.name && item.name == "ram" && "Memory" }}
              </span> -->
              <span v-if="item.name && item.name == 'memory'">
                {{ item.name == "ram" || item.name == "memory" ? " RAM" : "" }}
              </span>
              <span v-else>
                {{ item.name && (item.name == "cpu" || item.name == "gpu") ? item.name.toUpperCase() : $lodash.capitalize(item.name) }}
              </span>
            </template>
            <template v-slot:item.size="{ item }">
              {{ item.total }}
              {{ item.name == "cpu" ? " vCPU" : "" }}
              {{ item.name == "ram" || item.name == "memory" ? " RAM" : "" }}
              <!-- {{ item.name == "disk" ? " GB" : "" }} -->
              {{ item.name == "gpu" ? " GHz" : "" }}
            </template>
            <template v-slot:item.price="{ item }">
              <p>{{ toIDRWithDotFormat(item.price_per_month) }}/Month</p>
              <p>{{ toIDRWithDotFormat(item.price_per_hours) }}/Hour</p>
            </template>
            <template v-slot:item.action="{ item }">
              <div>
                <label
                  style="cursor: pointer"
                  @click="
                    () => {
                      if (read_only) {
                        return;
                      }
                      itemdefaultedited = item;
                      unit = item.name == 'cpu' ? 'vCPU' : 'GB';
                      opendialogeditdefault = true;
                    }
                  "
                  ><span class="primary--text" :style="[read_only ? { color: '#a9a9a9 !important' } : {}]">Edit</span>
                </label>
              </div>
            </template>
          </v-data-table>
          <v-divider />
        </v-card-text>

        <v-card-text class="pa-8 pb-0 d-flex flex-row align-center">
          <div class="headline font-weight-bold font--text">Manage Instance Flavors</div>
          <v-spacer />
          <v-btn
            to="/manage-pricing/manage-region"
            class="secondary--text mr-4"
            depressed
            height="50"
            width="150"
            style="border: 2px solid #2c94d2; background-color: white"
            ><span class="fz-14">Manage Region</span></v-btn
          >
          <v-btn
            to="/manage-pricing/manage-type"
            class="secondary--text mr-4"
            depressed
            height="50"
            width="150"
            style="border: 2px solid #2c94d2; background-color: white"
            ><span class="fz-14">Manage Type</span></v-btn
          >
          <v-btn v-if="!read_only" depressed height="50" width="200" class="secondary" to="/manage-pricing/create" append
            ><span style="font-size: 14px">Create Instance Flavors</span></v-btn
          >
        </v-card-text>
        <v-card-text class="px-8">
          <v-row>
            <v-col>
              <v-select placeholder="Type" v-model="plan" item-text="name" item-value="id" :items="selectplan" outlined> </v-select>
            </v-col>
            <v-col>
              <v-select placeholder="Region" v-model="region" :items="selectAllRegions" @change="getFlavorbyRegion($event)" outlined> </v-select>
            </v-col>
            <v-col>
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
            <v-col>
              <v-text-field maxlength="50" class="search" placeholder="Search" outlined v-model="searchinstancesize"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="px-8">
          <v-data-table
            :hide-default-footer="true"
            :headers="headers"
            :items="flavors"
            :items-per-page="10"
            :options.sync="options"
            :server-items-length="pagination.count"
            class="elevation-0"
          >
            <template v-slot:item.name="{ item }">
              <span
                @click="
                  () => {
                    selectedinstance = item;
                    opendialogfalvordetails = true;
                  }
                "
                class="linkpointer"
              >
                {{ item.flavor_name }}</span
              >
            </template>
            <template v-slot:item.type="{ item }">
              {{ item.type ? item.type.name : "-" }}
            </template>
            <template v-slot:item.cpu="{ item }"> {{ item.vcpu }} vCPU </template>
            <template v-slot:item.usage_limit="{ item }">
              {{ item.usage_limit == -1 ? "Unlimited" : item.usage_limit ? `${item.usage} / ${item.usage_limit}` : "-" }}
            </template>
            <template v-slot:item.region="{ item }">
              {{ item.region ? item.region : "-" }}
            </template>
            <template v-slot:item.ram="{ item }"> {{ item.ram }} GB </template>
            <!-- <template v-slot:item.rootdisk="{ item }">
              {{ item.root_disk }} GB
            </template> -->
            <template v-slot:item.gpu="{ item }">
              {{ !item.gpu ? "-" : item.gpu > 1 ? `${item.gpu} Units` : `${item.gpu} Unit` }}
            </template>
            <template v-slot:item.status="{ item }">
              <v-switch
                @click="
                  () => {
                    if (read_only) {
                      return;
                    }
                    flavorSelected = item;
                    opendialogFlavorSwitch = true;
                  }
                "
                :disabled="read_only"
                readonly
                class="mt-0 mb-2"
                hide-details
                flat
                :false-value="'deactive'"
                :true-value="'active'"
                v-model="item.status"
              ></v-switch>
            </template>
            <template v-slot:item.pricepermonth="{ item }">
              <p>{{ toIDRWithDotFormat(item.price_per_month) }}/month</p>
              <p>{{ toIDRWithDotFormat(item.price_per_hours) }}/jam</p>
            </template>

            <template v-slot:item.action="{ item }">
              <div>
                <label
                  style="cursor: pointer"
                  @click="
                    () => {
                      if (read_only) {
                        return;
                      }
                      deleteinstance(item);
                    }
                  "
                  ><span class="error--text" :style="[read_only ? { color: '#a9a9a9 !important' } : {}]">Delete</span></label
                >
              </div>
            </template>
            <template v-slot:footer="{ props }">
              <custom-footer-datatable
                v-if="pagination.count > 5"
                @input="
                  (val) => {
                    options = { ...options, ...val };
                  }
                "
                :hidden="true"
                :props="props"
              />
            </template>
          </v-data-table>
        </v-card-text>
      </v-tab-item>

      <!-- VOLUME -->
      <v-tab-item>
        <!-- DEFAULT STANDARD VOLUME TITLE -->
        <v-card-text class="d-flex pa-8 flex-row align-center">
          <div class="headline font-weight-bold font--text">
            Default Standard Storage
            <!-- Default Volume Storage -->
          </div>
        </v-card-text>

        <!-- DEFAULT STANDARD VOLUME TABLE -->
        <v-card-text class="px-8">
          <!-- <v-data-table
            :hide-default-footer="true"
            :headers="defaultVolumeHeaders"
            :items-per-page="10"
            :items="defaultstoragesize"
            class="elevation-0"
          > -->
          <v-data-table :hide-default-footer="true" :headers="defaultVolumeHeaders" :items-per-page="10" :items="defaultstoragesize" class="elevation-0">
            <!-- :items="
              defaultstoragesize.filter((size) => size.type.name === 'Standard')
            " -->
            <template v-slot:item.size="{ item }"> {{ item.volume_size }} GB </template>
            <template v-slot:item.price="{ item }">
              <p>{{ toIDRWithDotFormat(item.price_per_month) }}/Month</p>
              <p>{{ toIDRWithDotFormat(item.price_per_hours) }}/Hour</p>
            </template>
            <template v-slot:item.action="{ item }">
              <div>
                <label
                  style="cursor: pointer"
                  @click="
                    () => {
                      if (read_only) {
                        return;
                      }
                      selectedvolume = item;
                      opendialogeditvol = true;
                    }
                  "
                  ><span class="primary--text" :style="[read_only ? { color: '#a9a9a9 !important' } : {}]">Edit</span>
                </label>
              </div>
            </template>
          </v-data-table>
          <v-divider />
        </v-card-text>

        <!-- DEFAULT PREMIUM VOLUME TITLE -->
        <!-- <v-card-text
          v-if="isDevModeStorageTiering"
          class="d-flex pa-8 flex-row align-center"
        >
          <div class="headline font-weight-bold font--text">
            Default Premium Storage
          </div>
        </v-card-text> -->

        <!-- DEFAULT PREMIUM VOLUME TABLE -->
        <!-- <v-card-text v-if="isDevModeStorageTiering" class="px-8">
          <v-data-table
            :hide-default-footer="true"
            :headers="defaultVolumeHeaders"
            :items-per-page="5"
            :items="
              defaultstoragesize.filter((size) => size.type.name === 'Premium')
            "
            class="elevation-0"
          >
            <template v-slot:item.size="{ item }">
              {{ item.volume_size }}
            </template>
            <template v-slot:item.price="{ item }">
              {{ toIDRWithDotFormat(item.price_per_month) }}/month
            </template>
            <template v-slot:item.action="{ item }">
              <div>
                <label
                  style="cursor: pointer"
                  @click="
                    () => {
                      selectedvolume = item;
                      opendialogeditvol = true;
                    }
                  "
                  ><span class="primary--text">Edit</span>
                </label>
              </div>
            </template>
          </v-data-table>
          <v-divider />
        </v-card-text> -->

        <!-- VOLUME TABLE HEADER -->
        <v-card-text class="d-flex pa-8 align-center">
          <div class="headline font-weight-bold font--text">
            {{ isDevModeStorageTiering ? "Manage Storage Flavor" : "Manage Volume" }}
          </div>
          <v-spacer />
          <!-- <v-btn
            height="50"
            depressed
            outlined
            color="secondary"
            class="ml-4"
            to="/manage-pricing/manage-volume-type"
          >
            <span style="font-size: 14px"> Manage Type</span>
          </v-btn> -->
          <v-btn
            v-if="!read_only"
            height="50"
            depressed
            class="secondary ml-6"
            @click="
              () => {
                opendialogcreatevol = true;
              }
            "
          >
            <span style="font-size: 14px"> Create Storage Flavor</span>
          </v-btn>
        </v-card-text>

        <!-- SEARCH OPTIONS & SEARCH BOX -->
        <v-card-text v-if="isDevModeStorageTiering" class="py-0 px-8">
          <v-row>
            <v-col>
              <v-select placeholder="Type" v-model="searchVolumeType" item-text="name" item-value="id" :items="volumeTypes" outlined />
            </v-col>
            <v-col>
              <v-text-field
                maxlength="50"
                class="search"
                :placeholder="isDevModeStorageTiering ? 'Search Storage (GB)' : 'Search Volume (GB)'"
                outlined
                v-model="searchstoragesize"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="px-8">
          <v-data-table
            :hide-default-footer="true"
            :headers="VolumeHeaders"
            :items-per-page="10"
            :server-items-length="paginationstorage.count"
            :items="storagesizes"
            :search="searchstoragesize"
            :options.sync="optionsstorage"
            class="elevation-0"
          >
            <template v-slot:item.size="{ item }"> {{ item.volume_size }} GB </template>
            <template v-slot:item.type="{ item }">
              <span v-if="item.type && item.type.name">
                {{ item.type.name }}
              </span>
            </template>
            <template v-slot:item.price="{ item }">
              <span>{{ toIDRWithDotFormat(item.price_per_month) }}/month</span>
            </template>
            <template v-slot:item.status="{ item }">
              <v-switch
                class="mt-0 mb-2"
                hide-details
                flat
                readonly
                :disabled="read_only"
                @click="
                  () => {
                    if (read_only) {
                      return;
                    }
                    opendialogStorageSwitch = true;
                    storageSelected = item;
                  }
                "
                v-model="item.status"
                true-value="active"
                false-value="deactive"
              ></v-switch>
            </template>
            <template v-slot:item.action="{ item }">
              <div>
                <label
                  @click="
                    () => {
                      if (read_only) {
                        return;
                      }
                      selectedvolume = item;
                      opendialogdeletevol = true;
                    }
                  "
                  style="cursor: pointer"
                  ><span class="error--text" :style="[read_only ? { color: '#a9a9a9 !important' } : {}]">Delete</span></label
                >
              </div>
            </template>
            <template v-slot:footer="{ props }">
              <custom-footer-datatable
                v-if="paginationstorage.count > 5"
                @input="
                  (val) => {
                    optionsstorage = { ...optionsstorage, ...val };
                  }
                "
                :props="props"
              />
            </template>
          </v-data-table>
        </v-card-text>
      </v-tab-item>

      <!-- OBJECT STORAGE FLAVORS -->
      <v-tab-item>
        <v-card-text class="d-flex pa-8 flex-row align-center">
          <div class="headline font-weight-bold font--text">Default Object Storage Flavor</div>
        </v-card-text>
        <v-card-text class="px-8">
          <v-data-table :hide-default-footer="true" :headers="defaultObjectStorageHeaders" :items-per-page="10" :items="s3Default" class="elevation-0">
            <template v-slot:item.size="{ item }"> {{ item.object_storage_size }} GB </template>
            <template v-slot:item.price="{ item }">
              <p>{{ toIDRWithDotFormat(item.price_per_month) }}/Month</p>
              <p>{{ toIDRWithDotFormat(item.price_per_hours) }}/Hour</p>
            </template>
            <template v-slot:item.action="{ item }">
              <div>
                <label
                  style="cursor: pointer"
                  @click="
                    () => {
                      if (read_only) {
                        return;
                      }
                      selectedObjectStorage = item;
                      openDialogEditObjectStorage = true;
                    }
                  "
                  ><span class="primary--text" :style="[read_only ? { color: '#a9a9a9 !important' } : {}]">Edit</span>
                </label>
              </div>
            </template>
          </v-data-table>
          <v-divider />
        </v-card-text>
        <v-card-text class="d-flex pa-8 align-center">
          <div class="headline font-weight-bold font--text">Manage Object Storage Flavors</div>
          <v-spacer />
          <v-text-field maxlength="50" style="max-width: 233px" outlined placeholder="Search" hide-details="" v-model="objectStorageSearch"></v-text-field>
          <v-spacer />
          <v-btn
            to="/manage-pricing/manage-object-storage-region"
            class="secondary--text mr-4"
            depressed
            height="50"
            width="150"
            style="border: 2px solid #2c94d2; background-color: white"
            ><span class="fz-14">Manage Region</span></v-btn
          >
          <v-btn
            v-if="!read_only"
            height="50"
            width="200"
            depressed
            class="secondary ml-8"
            @click="
              () => {
                openDialogCreateObjectStorage = true;
              }
            "
          >
            <span style="font-size: 14px"> Create Object Storage Flavor</span>
          </v-btn>
        </v-card-text>
        <v-card-text class="px-8">
          <v-data-table
            :hide-default-footer="true"
            :headers="ObjectStorageHeaders"
            :items-per-page="10"
            :server-items-length="s3Pagination.count"
            :items="s3Flavors"
            :search="objectStorageSearch"
            :options.sync="s3Options"
            class="elevation-0"
          >
            <template v-slot:item.size="{ item }">
              <span v-if="item.object_storage_size">{{ toThousands(item.object_storage_size) }} GB</span>
              <span v-else>-</span>
            </template>
            <template v-slot:item.price="{ item }">
              <p v-if="item.price_per_month">{{ toIDRWithDotFormat(item.price_per_month) }}/month</p>
              <span v-else>-</span>
            </template>
            <template v-slot:item.status="{ item }">
              <v-switch
                class="mt-0 mb-2"
                hide-details
                flat
                readonly
                :disabled="read_only"
                @click="
                  () => {
                    if (read_only) {
                      return;
                    }
                    s3Switch = true;
                    selectedObjectStorage = item;
                  }
                "
                v-model="item.status"
                true-value="active"
                false-value="deactive"
              ></v-switch>
            </template>
            <template v-slot:item.action="{ item }">
              <div>
                <label
                  @click="
                    () => {
                      if (read_only) {
                        return;
                      }
                      selectedObjectStorage = item;
                      openDialogDeleteObjectStorage = true;
                    }
                  "
                  style="cursor: pointer"
                  ><span class="error--text" :style="[read_only ? { color: '#a9a9a9 !important' } : {}]">Delete</span></label
                >
              </div>
            </template>
            <template v-slot:footer="{ props }">
              <custom-footer-datatable
                v-if="s3Pagination.count > 5"
                @input="
                  (val) => {
                    s3Options = val;
                  }
                "
                :props="props"
              />
            </template>
          </v-data-table>
        </v-card-text>
      </v-tab-item>

      <!-- RESTORE -->
      <restore v-if="isDevMode" />

      <!-- SNAPSHOT -->
      <snapshot v-if="isDevModeChargingForSnapshot" />

      <!-- FLOATING IP -->
      <floatingip v-if="isDevModeFloatingIP" />
    </v-tabs-items>

    <dialogCreateObjectStorage v-if="openDialogCreateObjectStorage" v-model="openDialogCreateObjectStorage" />
    <dialogEditObjectStorage
      v-if="selectedObjectStorage && openDialogEditObjectStorage"
      :objectStorage="selectedObjectStorage"
      v-model="openDialogEditObjectStorage"
    />
    <dialogDeleteObjectStorage
      v-if="selectedObjectStorage && openDialogDeleteObjectStorage"
      v-model="openDialogDeleteObjectStorage"
      :objectStorage="selectedObjectStorage"
    />
    <dialogCreateVol v-if="opendialogcreatevol" v-model="opendialogcreatevol" />
    <dialogEditVol
      v-if="selectedvolume && opendialogeditvol"
      :volume="selectedvolume"
      v-model="opendialogeditvol"
      @edited="
        () => {
          fetchstoragesizes();
        }
      "
    />
    <dialogDelVol
      v-if="selectedvolume && opendialogdeletevol"
      v-model="opendialogdeletevol"
      :volume="selectedvolume"
      @deleted="
        () => {
          fetchstoragesizes();
        }
      "
    />
    <dialogDelIns
      v-if="opendialogdeleteins && selectedinstance"
      v-model="opendialogdeleteins"
      :instance="selectedinstance"
      @deleted="
        () => {
          fetchflavors();
        }
      "
    />
    <dialogEditDefault v-if="opendialogeditdefault && itemdefaultedited" v-model="opendialogeditdefault" :item="itemdefaultedited" :unit="unit" />
    <dialogActivateFlavor
      v-if="selectedObjectStorage && s3Switch"
      :onoff="selectedObjectStorage.status == 'active' ? 'off' : 'on'"
      v-model="s3Switch"
      @confirm="s3FlavorSwitchStatus(selectedObjectStorage)"
    />
    <dialogActivateFlavor
      v-if="flavorSelected && opendialogFlavorSwitch"
      instancetype="Flavor"
      :onoff="flavorSelected.status == 'active' ? 'off' : 'on'"
      v-model="opendialogFlavorSwitch"
      @confirm="
        () => {
          activate(flavorSelected).then(() => {
            opendialogFlavorSwitch = false;
          });
        }
      "
    />
    <dialogActivateFlavor
      v-if="storageSelected && opendialogStorageSwitch"
      instancetype="Volume"
      :onoff="storageSelected.status == 'active' ? 'off' : 'on'"
      v-model="opendialogStorageSwitch"
      @confirm="
        () => {
          switchstorage(storageSelected).then(() => {
            storageSelected.status = storageSelected.status == 'active' ? 'deactive' : 'active';
            opendialogStorageSwitch = false;
          });
        }
      "
    />
    <dialogOpenFlavorDetails v-if="selectedinstance && opendialogfalvordetails" :item="selectedinstance" v-model="opendialogfalvordetails" />
  </v-card>
</template>

<script>
import { computed, ref, watch, onMounted } from "@vue/composition-api";
import { useFlavor } from "./useflavor";
import { toIDRWithDotFormat, toThousands } from "@/lib/formatter";
import dialogCreateVol from "./dialogCreateVol.vue";
import dialogEditVol from "./dialogEditVol";
import dialogDelVol from "./dialogDelVol";
import dialogCreateObjectStorage from "./dialogCreateObjectStorage.vue";
import dialogEditObjectStorage from "./dialogEditObjectStorage";
import dialogDeleteObjectStorage from "./dialogDeleteObjectStorage";
import dialogDelIns from "./dialogDelIns";
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from "vuex-composition-helpers";
import { MANAGEFLAVOR } from "./namespace";
import dialogEditDefault from "./dialogEditDefault";
import dialogActivateFlavor from "./dialogActivateFlavor";
import dialogOpenFlavorDetails from "./dialogFlavorDetails";
import restore from "./restore.vue";
import snapshot from "./snapshot.vue";
import floatingip from "./floatingip.vue";
import api from "@/lib/api";
import { useRegion } from "@/modules/instance/compositionapi/useregion";

const isDevMode = process.env.VUE_APP_DEV_MODE === "fase-1.3";
// const isDevMode = false;
const isDevModeStorageTiering = true;
const isDevModeChargingForSnapshot = true;
const isDevModeFloatingIP = true;

import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    dialogCreateVol,
    dialogEditVol,
    dialogDelVol,
    dialogDelIns,
    dialogEditDefault,
    dialogActivateFlavor,
    dialogOpenFlavorDetails,
    dialogDeleteObjectStorage,
    dialogEditObjectStorage,
    dialogCreateObjectStorage,
    restore,
    snapshot,
    floatingip,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Manage Pricing"));
    const {
      flavors,
      fetchflavors,
      storagesizes,
      fetchdefaultstoragesize,
      defaultstoragesize,
      fetchstoragesizes,
      paginationstorage,
      optionsstorage,
      defaultcpu,
      defaultram,
      defaultdisk,
      defaultgpu,
      fetchS3DefaultPrice,
      fetchS3Flavors,
      deleteS3Flavor,
      createS3Flavor,
      s3Options,
      s3Flavors,
      s3Pagination,
      s3Default,
    } = useFlavor();
    const headers = ref([
      { text: "Flavor Name", value: "name" },
      { text: "Type", value: "type", sortable: false },
      { text: "Region", value: "region" },
      { text: "vCPU", value: "cpu" },
      { text: "RAM", value: "ram" },
      // { text: "Root Disk", value: "rootdisk" },
      // { text: "GPU", value: "gpu" },
      { text: "Status", value: "status" },
      // { text: "Price", value: "pricepermonth" },
      { text: "Action", sortable: false, align: "right", value: "action" },
    ]);
    const defaultVolumeHeaders = ref([
      { text: "Size", value: "size" },
      { text: "Type", value: "type.name", sortable: false },
      { text: "Price", value: "price" },
      { text: "Action", value: "action", align: "center" },
    ]);
    const defaultObjectStorageHeaders = ref([
      { text: "Default Volume (GB)", value: "size" },
      { text: "Price", value: "price" },
      { text: "Action", value: "action", align: "center" },
    ]);
    const defaultPriceHeaders = ref([
      { text: "Default", value: "size", sortable: false },
      { text: "Parameter", value: "name", sortable: false },
      { text: "Price", value: "price", sortable: false },
      { text: "Action", value: "action", align: "center", sortable: false },
    ]);
    const VolumeHeaders = ref([
      { text: "Storage (GB)", value: "size", sortable: false },
      { text: "Type", value: "type", sortable: false },
      // { text: "Price", value: "price", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Action", sortable: false, value: "action", align: "right" },
    ]);
    const ObjectStorageHeaders = ref([
      { text: "Volume (GB)", value: "size", sortable: false },
      // { text: "Type", value: "type", sortable: false },
      // { text: "Price", value: "price", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Action", sortable: false, value: "action", align: "right" },
    ]);
    const processorType = ref([
      { name: "Intel", value: "intel" },
      { name: "AMD High Core", value: "amd_high_core" },
      { name: "AMD High CPU", value: "amd_high_cpu" },
    ]);
    const processor = ref("");
    const selectedinstance = ref("");
    const opendialogdeleteins = ref(false);
    const { plans } = useFlavor(props, context);
    const plan = ref("");
    onMounted(() => {
      fetchregions();
    });

    const { fetchinstancetype, activateFlavor, switchstorage, activateS3Flavor, deactivateS3Flavor } = useNamespacedActions(MANAGEFLAVOR, [
      "fetchinstancetype",
      "activateFlavor",
      "switchstorage",
      "activateS3Flavor",
      "deactivateS3Flavor",
    ]);

    const { instancetype, pagination } = useNamespacedState(MANAGEFLAVOR, ["instancetype", "pagination"]);

    const { setflavorbeingedit } = useNamespacedMutations(MANAGEFLAVOR, ["setflavorbeingedit"]);

    const { selectregions: selectRegions, fetchregions } = useRegion();

    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
    });
    const loading = ref(true);
    const searchinstancesize = ref("");
    let search = null;
    watch(plan, (val) => {
      options.value = { ...options.value, type_id: val };
    });

    watch(searchinstancesize, (val) => {
      if (search) {
        clearTimeout(search);
        search = setTimeout(function () {
          options.value = { ...options.value, search: val };
        }, 1000);
      } else {
        search = setTimeout(function () {}, 1000);
      }
    });
    watch(
      options,
      async (val) => {
        try {
          await fetchflavors(val);
        } finally {
          loading.value = false;
        }
      },
      { deep: true }
    );
    const editFlavor = (item) => {
      setflavorbeingedit(item);
      context.root.$router.push({ path: "edit", append: true });
    };
    const checkstatus = (status) => {
      return true;
    };
    const activate = async (item) => {
      return activateFlavor(item).then(() => {
        item.status = item.status == "active" ? "deactive" : "active";
      });
    };

    const searchstoragesize = ref("");

    watch(searchstoragesize, (val) => {
      if (search) {
        clearTimeout(search);
        search = setTimeout(function () {
          optionsstorage.value = { ...optionsstorage.value, search: val };
        }, 1000);
      } else {
        search = setTimeout(function () {}, 1000);
      }
    });

    const searchVolumeType = ref("");

    watch(searchVolumeType, (val) => {
      optionsstorage.value = { ...optionsstorage.value, type_id: val };
    });

    const objectStorageSearch = ref("");
    watch(objectStorageSearch, (val) => {
      if (search) {
        clearTimeout(search);
        search = setTimeout(function () {
          s3Options.value = { ...s3Options.value, search: val };
        }, 500);
      } else {
        search = setTimeout(function () {}, 500);
      }
    });
    const selectplan = computed(() => {
      const all = [{ name: "All", id: "" }];
      return all.concat(instancetype.value);
    });
    const selectAllRegions = computed(() => {
      const all = [{ text: "All", value: { name: "", ID: "" } }];
      return all.concat(selectRegions.value);
    });
    const processorAllType = computed(() => {
      const all = [{ name: "All", value: "" },];
      return all.concat(processorType.value);
    });
    const itemdefaultedited = ref();
    const unit = ref();
    const opendialogeditdefault = ref(false);
    const opendialogFlavorSwitch = ref(false);
    const flavorSelected = ref();
    const opendialogStorageSwitch = ref(false);
    const storageSelected = ref();
    const opendialogfalvordetails = ref(false);
    const region = ref({ text: "All", value: { name: "", ID: "" } });

    const s3Switch = ref(false);
    const s3FlavorSwitchStatus = async (objectStorage) => {
      const { status, id } = objectStorage;
      const response = status === "active" ? await deactivateS3Flavor({ id }) : await activateS3Flavor({ id });
      if (response.status === 200) s3Switch.value = false;
    };
    const s3FlavorDelete = async (objectStorage) => {
      const { id } = objectStorage;
      const response = await deleteS3Flavor({ id });
      if (response.status === 200) s3Switch.value = false;
    };
    const getFlavorbyRegion = (event) => {
      options.value = { ...options.value, region: event.name };
    };
    const getFlavorbyProcessor = (event) => {
      options.value = { ...options.value, processor: event };
    };

    return {
      read_only,

      s3FlavorSwitchStatus,
      opendialogfalvordetails,
      opendialogStorageSwitch,
      storageSelected,
      flavorSelected,
      opendialogFlavorSwitch,
      defaultPriceHeaders,
      switchstorage,
      itemdefaultedited,
      opendialogeditdefault,
      unit,
      selectplan,
      activate,
      checkstatus,
      editFlavor,
      options,
      pagination,
      fetchinstancetype,
      instancetype,
      plans,
      plan,
      searchinstancesize,
      searchstoragesize,
      searchVolumeType,
      objectStorageSearch,
      VolumeHeaders,
      ObjectStorageHeaders,
      storagesizes,
      fetchstoragesizes,
      opendialogcreatevol: ref(false),
      opendialogeditvol: ref(false),
      opendialogdeletevol: ref(false),
      openDialogCreateObjectStorage: ref(false),
      openDialogEditObjectStorage: ref(false),
      openDialogDeleteObjectStorage: ref(false),
      opendialogdeleteins,
      defaultVolumeHeaders,
      defaultObjectStorageHeaders,
      toIDRWithDotFormat,
      toThousands,
      tab: ref(""),
      tab1: ref(""),
      flavors,
      headers,
      fetchflavors,
      paginationstorage,
      optionsstorage,
      fetchdefaultstoragesize,
      defaultstoragesize,
      selectedvolume: ref(""),
      selectedObjectStorage: ref(""),
      selectedinstance,
      deleteinstance(item) {
        selectedinstance.value = item;
        opendialogdeleteins.value = true;
      },
      defaultcpu,
      defaultram,
      defaultdisk,
      defaultgpu,
      fetchS3Flavors,
      fetchS3DefaultPrice,
      deleteS3Flavor,
      createS3Flavor,
      s3Flavors,
      s3Pagination,
      s3Default,
      s3Options,
      s3Switch,
      selectRegions,
      region,
      processorType,
      processor,
      getFlavorbyRegion,
      getFlavorbyProcessor,
      selectAllRegions,
      processorAllType,
    };
  },
  data() {
    return {
      isDevMode,
      isDevModeStorageTiering,
      isDevModeChargingForSnapshot,
      isDevModeFloatingIP,
      volumeTypes: [
        // {name: 'Standard',
        // id: 'standard'},
        // {name: 'Premium',
        // id: 'premium'},
      ],
    };
  },
  methods: {
    async getVolumeTypes() {
      try {
        const res = await api.GET("/flavor/storage/type");
        if (res.data.length) {
          const newArr = res.data.map((type) => {
            const { name, id } = type;

            return {
              name,
              id,
            };
          });
          this.volumeTypes = [{ name: "All", id: "" }, ...newArr];
        }
      } catch {
        this.$store.dispatch("HOMEPAGE/showErrorToast", "Sorry, an error occurred while displaying volume types");
      }
    },
  },
  created() {
    this.fetchinstancetype();
    this.fetchflavors();
    this.fetchdefaultstoragesize();
    this.fetchstoragesizes();
    this.fetchS3DefaultPrice();
    this.getVolumeTypes();
  },
};
</script>
<style lang="scss" scoped>
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
