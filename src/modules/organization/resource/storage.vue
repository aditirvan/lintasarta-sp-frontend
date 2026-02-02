<template>
  <div style="margin-bottom: 3rem;" :class="{ animate : true }">
    <v-data-table
      id="DataTableListStorage"
      @pagination="pagination"
      hide-default-footer
      :headers="headers"
      :items="storages"
      :items-per-page="5"
      class="elevation-0"
    >
      <template v-slot:item.name="{ item }">
        <div class="d-flex">
          <div class="dotblue"></div>
          <span>{{ item.name }}</span>
        </div>
      </template>
      <template v-slot:item.instance="{ item }">
        <div>
          <div v-if="item.instance" class="d-flex haveinstance">
            <div class="dotblue mt-2"></div>
            <div>
              <span class="primary--text">{{
                item.instance.instanceName
              }}</span>
              <p>
                {{ item.instance.instanceType }} /
                {{ item.instance.region.regionid }}
              </p>
            </div>
          </div>
          <div
            v-else
            :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
            class="linkpointer nothaveinstance"
            @click="
              () => {
                if(read_only){
                  return
                }
                selectedstorage = item;
                dialogAttachtoInstance = true;
              }
            "
          >
            Attach Instance
          </div>
        </div>
      </template>
      <template v-slot:item.ipaddress="{ item }">
        <p class="ip">
          <span class="ipaddress">Int <span class="tik">:</span></span
          ><span>{{ item.instance.ipv4 }}</span>
        </p>
        <p class="ip">
          <span class="ipaddress">Ext <span class="tik">:</span></span
          >{{ item.instance.ext }}
        </p>
      </template>
      <template v-slot:item.region="{ item }">
        {{ item.region.regionid.toUpperCase() }}
      </template>
      <template v-slot:item.createddate="{ item }">
        {{ $moment(new Date(item.createdate)).format("DD/MM/YYYY") }}
      </template>
      <template v-slot:item.action="{ item }">
        <popupquote
          v-model="showMenu"
          :offsetTop="20"
          offset-y
          allow-overflow
          :documentid="'popup' + item.id"
        >
          <template v-slot:activator="{ on, attrs }">
            <label
              v-bind="attrs"
              class="primary--text linkpointer"
              style="position: relative"
              @click="
                ($event) => {
                  on.click($event);
                  show($event, item);
                }
              "
              >More
              <v-icon
                :class="{
                  rotate: item.id == selectedstorage.id && showMenu,
                }"
                :id="'popup' + item.id"
                color="primary"
                >mdi-chevron-down</v-icon
              >
            </label>
          </template>
          <v-list>
            <v-list-item
              v-if="!selectedstorage.instance"
              @click="
                () => {
                  dialogAttachtoInstance = true;
                }
              "
            >
              <v-list-item-title>Attach to Instance</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="selectedstorage.instance"
              @click="
                () => {
                  dialogDetachStorage = true;
                }
              "
            >
              <v-list-item-title
                ><label>Detach from Instance</label></v-list-item-title
              >
            </v-list-item>
            <v-list-item
              @click="
                () => {
                  dialogIncreaseVol = true;
                }
              "
            >
              <v-list-item-title
                ><label>Increase Size</label></v-list-item-title
              >
            </v-list-item>
            <v-list-item
              style="border-bottom: 1px lightgrey solid"
              @click="
                () => {
                  dialogSnapshot = true;
                }
              "
            >
              <v-list-item-title
                ><label>Take Snapshot</label></v-list-item-title
              >
            </v-list-item>

            <v-list-item
              @click="
                () => {
                  dialogDeleteVol = true;
                }
              "
            >
              <v-list-item-title
                ><label class="error--text">Delete</label></v-list-item-title
              >
            </v-list-item>
          </v-list>
        </popupquote>
      </template>
      <template v-slot:footer="{ props }">
        <custom-footer-datatable
          :props="props"
          :style="{ visibility: storages.length > 5 ? 'visible' : 'hidden' }"
        />
      </template>
    </v-data-table>
    <v-dialog v-model="dialogDetachStorage" max-width="500">
      <v-card>
        <v-card-title>
          <div class="headline font-weight-bold font--text">
            Detach {{ selectedstorage.name }} from Instance?
          </div>
        </v-card-title>
        <v-card-text>
          <b>Warning:</b> Detaching a volume from a running Instance may cause
          data loss. Power off the Instance first, or make sure it isn’t
          currently writing to the volume before proceeding. You’ll be able to
          access your detached volume and data in the “Volumes" tab, and you
          will still be charged for it.
        </v-card-text>
        <v-card-text>
          <p class="font-weight-bold">Are you sure you want to proceed?</p>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn
                depressed
                height="50"
                color="accent"
                block
                @click="
                  () => {
                    dialogDetachStorage = false;
                  }
                "
              >
                <span style="font-size: 14px; font-weight: 700">Cancel</span>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                depressed
                height="50"
                color="error"
                block
                @click="
                  () => {
                    detachfrominstance();
                    dialogDetachStorage = false;
                  }
                "
              >
                <span style="font-size: 14px; font-weight: 700">Confirm</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <dialogAttachInstance
      v-model="dialogAttachtoInstance"
      @close="
        () => {
          dialogAttachtoInstance = false;
        }
      "
      @confirm="AttachStorageToInstance"
    />
    <dialogCreateSnapshot
      v-model="dialogSnapshot"
      @close="
        () => {
          dialogSnapshot = false;
        }
      "
    />
    <dialogIncreaseVolume
      v-model="dialogIncreaseVol"
      @close="
        () => {
          dialogIncreaseVol = false;
        }
      "
    />
    <dialogDeleteStorage
      v-model="dialogDeleteVol"
      :storage="selectedstorage"
      @close="
        () => {
          dialogDeleteVol = false;
        }
      "
      @confirm="
        () => {
          deleteStorage(selectedstorage.id);
        }
      "
    />
  </div>
</template>

<script>
// import { useActions } from "vuex-composition-helpers";
import dialogAttachInstance from "@/modules/storage/dialogAttachInstance";
import dialogCreateSnapshot from "@/modules/storage/dialogCreateSnapshot";
import dialogIncreaseVolume from "@/modules/storage/dialogIncreaseVolume";
import dialogDeleteStorage from "@/modules/storage/dialogDeleteStorage";
import { useCreateStorage } from "@/modules/storage/composableapi/usecreatestorage";
import { ref } from "@vue/composition-api";
import { AccessControl } from "@/lib/middleware";

export default {
  props: ["instanceid"],
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Storage'));
    const headers = ref([
        { text: "Name", value: "name" },
        { text: "Billing Type", value: "billing_type" },
        { text: "Region", value: "region" },
        { text: "Size", value: "size" },
        { text: "Instance Name", value: "instance" },

        { text: "Created Date", value: "createddate" },
        { text: "Action", sortable: false, align: "right", value: "action" },
    ]);
    const {
      deletestorage,
      storages,
      fetchstorages,
      selectedstorage,
      detachfrominstance: Detachfrominstance,
      updateStorage,
    } = useCreateStorage();
    function deleteStorage(storageid) {
      return deletestorage(storageid);
    }
    function detachfrominstance() {
      Detachfrominstance(selectedstorage.value);
    }
    function AttachStorageToInstance(instance) {
      (selectedstorage.value.instance = instance),
        updateStorage(selectedstorage.value);
    }
    if (read_only){
      headers.value.pop()
    }
    return {
      headers,
      read_only,
      loading: ref(true),
      fetchstorages,
      storages,
      selectedstorage,
      deletestorage,
      deleteStorage,
      dialogDeleteVol: ref(false),
      detachfrominstance,
      dialogAttachtoInstance: ref(false),
      AttachStorageToInstance,
    };
  },
  created() {
    const where = this.instanceid
      ? ["instance.id", "==", this.instanceid]
      : null;
    if (where) {
      this.fetchstorages({ where }).then(() => {
        this.loading = false;
      });
    } else {
      this.fetchstorages().then(() => {
        this.loading = false;
      });
    }
  },
  data() {
    const dialogSnapshot = false;

    return {
      dialogIncreaseVol: false,
      dialogSnapshot,
      dialogDetachStorage: false,
      showMenu: false,
      coordinate: {
        x: 0,
        y: 0,
      },
    };
  },
  methods: {
    show(e, storage) {
      this.selectedstorage = storage;
      e.preventDefault();
      this.showMenu = false;
      this.coordinate.x = e.clientX - 20;
      this.coordinate.y = e.clientY + 10;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    ondialogSnapshot() {},
    pagination() {},
  },
  components: {
    dialogCreateSnapshot,
    dialogIncreaseVolume,
    dialogDeleteStorage,
    dialogAttachInstance,
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
.v-list-item {
  min-height: 38px;
}
.v-list-item__title {
  font-weight: 600;
  label:hover {
    cursor: pointer;
  }
}
</style>
<style lang="scss">
#DataTableListStorage {
  font-weight: 600;
  td {
    padding-top: 20px;
    padding-bottom: 14px;
  }
}
</style>