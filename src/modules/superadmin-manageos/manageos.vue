<template>
  <v-container fluid class="px-0 pt-3">
    <v-card flat class="rounded-lg pa-7">
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="fz-21 font-weight-bold mb-0">Manage Image</p>
          <v-spacer />
          <div style="width:200px">
          <v-select
            :items="chooseos"
            v-model="osselected"
            item-value="id"
            item-text="text"
            outlined
            hide-details
            placeholder="Operating System"
          ></v-select>
          </div>
          <div style="height:auto;width:30px" />
           <v-btn
            v-if="!read_only"
            to="/manage-os/manage-type-os"
            class="secondary--text"
            depressed
            height="50"
            width="150"
            style="border: 2px solid #2c94d2; background-color: white"
            ><span class="fz-14">Manage Type</span></v-btn
          >
          <div style="height:auto;width:30px" />
          <v-btn
            v-if="!read_only"
            @click="
              () => {
                openDialogAdd = true;
              }
            "
            depressed
            height="45"
            width="200"
            class="secondary"
          >
            <span class="fz-14"> Create New Version </span>
          </v-btn>
        </v-col>
      </v-row>
     
      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            hide-default-footer
            :server-items-length="pagination.count"
            :items-per-page="10"
            :rows-per-page="10"
            :items="osversions"
            :search="search"
            :options.sync="options"
          >
            <template v-slot:item.os="{ item }">{{ item.os_name }}</template>
           
            <template v-slot:item.bitversion="{ item }">{{
              item.version_name
            }}</template>
            <template v-slot:item.versionnumber="{ item }">{{
              item.version_number
            }}</template>
            <template v-slot:item.status="{ item }">
              <!-- <div v-if="item.is_upload_success==1" >Success</div>
              <div v-else >Failed</div>
               -->
                <span
                  v-if="
                    !item.is_upload_success && !item.is_upload_failed
                  "
                >
                  Not Ready Yet
                </span>
                <span
                  v-else-if="item.is_upload_success"
                  class="primary--text mb-0"
                >
                  Active
                </span>
                <span
                  v-else-if="item.is_upload_failed"
                  class="error--text mb-0"
                >
                  Failed
                </span>
                <span v-else>N/A</span>

            </template>
            <template v-slot:item.action="{ item }">

              <span
                @click="
                  () => {
                    if(read_only){
                      return
                    }
                    versionselected = item;
                    openDialogDelete = true;
                  }
                "
                class="error--text pr-3 delete ml-4"
                :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
                >Delete</span
              >
            </template>
            <template v-slot:footer="{ props }">
              <custom-footer-datatable
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
        </v-col>
      </v-row>
    </v-card>
    <dialogAddNewVersion v-model="openDialogAdd" 
      @added="
        () => {
          openDialogAdd=false;
          resetSelect()
        }
      " 
    />
    <dialogAddNewVersion
      v-if="openDialogEdit && versionselected"
      v-model="openDialogEdit"
      :versionedit="versionselected"
      @updated="
        () => {
          fetchosversions(options);
        }
      "
    />
    <dialogDeleteVersion
      v-if="openDialogDelete && versionselected"
      :item="versionselected"
      v-model="openDialogDelete"
      @deleted="
        () => {
          fetchosversions(options).then((data) => {
            if (options.page > 1 && data.image.length < 1) {
              options.page = options.page - 1;
              fetchosversions(options);
            }
          });
        }
      "
    />
  </v-container>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted, Ref,
  ref,
  watch,
} from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import dialogAddNewVersion from "./dialogAddNewVersion.vue";
import { SUPERADMINMANAGEOS } from "./namespace";
import dialogDeleteVersion from "./dialogDeleteVersion.vue";

import { AccessControl } from "@/lib/middleware";

export default defineComponent({
  components: { dialogAddNewVersion, dialogDeleteVersion },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Image'));
    const headers = ref([
      { text: "Region", value: "region", sortable: true },
      { text: "Operating System", value: "os", sortable: true },
      { text: "Bit Version", value: "bitversion", sortable: true },
      { text: "Version Number", value: "versionnumber", sortable: true },
      { text: "Status", value: "status", sortable: true },
      { text: "Action", sortable:false, value: "action", align: "center" },
    ]);
    const { fetchosversions } = useNamespacedActions(SUPERADMINMANAGEOS, [
      "fetchosversions",
    ]);
    const {
      osversions,
      pagination,
      selectos,
    } = useNamespacedState(SUPERADMINMANAGEOS, [
      "osversions",
      "pagination",
      "selectos",
    ]);
    onMounted(() => {
      fetchosversions();
    });

    const resetSelect = () => {
      osselected.value = ''
      setTimeout(fetchosversions, 9000);
      // clearInterval(setload);
    }

    const chooseos = computed(() => {
      const all = [{ text: "All", id: "" }];
      const others = selectos as any;
      return all.concat(
        others.value.map((x: any) => ({ text: x.name, id: x.id }))
      );
    });

    const osselected = ref("");
    const versionselected = ref();
    const openDialogDelete = ref(false);

    const Delete = () => {
      versionselected.value.ref.delete().then(() => {
        openDialogDelete.value = false;
        fetchosversions();
      });
    };
    const options: Ref = ref({});
    watch(osselected, (val) => {
      options.value = { ...options.value, os_id: val, page: 1  };
    });
    watch(options, (val) => {
      console.log(val);
      fetchosversions(val);
    });
    const search = ref("");
    let timesearch: any = null;
    watch(search, (val) => {
      if (timesearch) {
        clearTimeout(timesearch);
        timesearch = setTimeout(() => {
          options.value = { ...options.value, search: val, page: 1  };
        }, 500);
      } else {
        timesearch = setTimeout(() => {
          options.value = { ...options.value, search: val, page: 1  };
        }, 500);
      }
    });
    return {
      read_only,

      chooseos,
      options,
      pagination,
      openDialogAdd: ref(false),
      openDialogEdit: ref(false),
      headers,
      osversions,
      openDialogDelete,
      search,
      selectos,
      osselected,
      Delete,
      versionselected,
      fetchosversions,
      resetSelect,
    };
  },
});
</script>