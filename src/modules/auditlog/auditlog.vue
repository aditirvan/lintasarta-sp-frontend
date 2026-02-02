<template>
  <v-card flat class="pa-7 rounded-lg">
    <v-card-text class="d-flex flex-row align-center">
      <div class="table-title">Activity</div>
      <v-spacer />
      <div style="height: auto; width: 10px" />
      <v-autocomplete
        class="selectsproject"
        v-model="projectselected"
        :items="selectprojects"
        return-object
        placeholder="Select Project"
        flat
        outlined
        clearable
        hide-details=""
      >
      </v-autocomplete>
      <div style="height: auto; width: 10px" />
      <v-btn
        @click="
          () => {
            opendialogdownload = true;
          }
        "
        class="secondary--text"
        depressed
        height="50"
        width="150"
        style="border: 3px solid #2c94d2; background-color: white"
        ><span class="fz-14">Download</span></v-btn
      >
    </v-card-text>   

    <v-data-table
      :class="{ hidden: loading }"
      :headers="headers"
      :items="activities"
      :server-items-length="pagination.count"
      :options.sync="options"
      :items-per-page="10"
      class="elevation-0"
      hide-default-footer
    >
      <template v-slot:item.event="{ item }">
        <div class="d-flex">
          <div class="pa-2">
            <v-icon
              style="color: #db1313"
              class="name"
              v-if="item.level == 'ERROR'"
              >{{
                converServiceNameErorr(item.service_type.toLowerCase())
              }}</v-icon
            >

            <v-icon style="color: #1f60a8" class="name" v-else>{{
              converServiceName(item.service_type.toLowerCase())
            }}</v-icon>
          </div>

          <div>
            <div class="name" :style="converColorServiceName(item.level)">
              {{ item.service_name }}
            </div>
            <div v-if="item.role_id == 99">
              {{ item.action }} LA - {{ item.fullname }}
            </div>
            <div v-else>{{ item.action }} by {{ item.fullname }}</div>
          </div>
        </div>
      </template>

      <template v-slot:item.project="{ item }">
        <span v-if="item.project_name != ''">
          {{ item.project_name }}
        </span>

        <span v-else>-</span>
      </template>

      <template v-slot:item.date="{ item }">
        {{
          $moment(new Date(item.created_at))
            .locale("en")
            .format("DD/MM/YYYY hh:mm A")
        }}
      </template>

      <template v-slot:footer="{ props }">
        <custom-footer-datatable
          @input="
            (val) => {
              options = { ...options, ...val };
            }
          "
          :props="props"
        />
      </template>
    </v-data-table>
    <dialogDownload @okay="downloadauditlog" v-model="opendialogdownload" />
  </v-card>
</template>

<script>
import { onMounted, ref, watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { AUDITLOG } from "@/modules/auditlog/namespace";
import dialogDownload from "./dialogDownload";
import { useUser } from "@/modules/superadmin-manageuser/useUser";
import { useProjects } from "@/modules/project/useprojects";
import localstorage from "@/lib/localstorage";
import { useAuditlog } from "./useauditlog";
import { useNotif } from "../notifications/usenotif";

export default {
  components: { dialogDownload },
  created() {
    // this.getDataFromApi();
  },
  setup() {
    const Composable = {
      ...useUser(),
      ...useProjects(),
      ...useAuditlog(),
      ...useNotif(),
    };
    const user_role = localstorage.getItem("role");
    console.log(user_role);
    const { fetchactivities } = useNamespacedActions(AUDITLOG, [
      'fetchactivities',
    ]);
    const { activities, pagination } = useNamespacedState(AUDITLOG, [
      'activities',
      'pagination',
    ]);
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
    });
    const loading = ref(true);
    const getDataFromApi = async (val) => {
      loading.value = true;
      try {
        await fetchactivities(val);
      } finally {
        loading.value = false;
      }
    };
    onMounted(() => {
    });
    watch(
      options,
      (val) => {
        getDataFromApi(val);
      },
      { deep: true }
    );
    const { fetchprojects, projectselected } = Composable;
    const org = ref();

    watch(org, (val) => {
      if (val) {
        options.value.organization = val;
      } else {
        options.value.organization = ""
        options.value.project = ""

      }
     
      fetchprojects({page:1, limitPerpage:-1, id:val})
      fetchactivities(options.value);
    });

    watch(projectselected, (val) => {
      if (val) {
        options.value.project = val.value;
      }else {
        options.value.project = ""
      }
      console.log(options.value);
      options.value.page = 1;
      fetchactivities(options.value);
    });

    const { downloadauditlog, opendialogdownload } = useAuditlog();

    return {
      ...Composable,
      opendialogdownload,
      downloadauditlog,
      headers: [
        { text: "Event", value: "event", sortable: false },
        { text: "IP Address", value: "ip_address", sortable: false },
        { text: "Project", value: "project", sortable: true },
        { text: "Date", value: "date", sortable: false },
      ],
      activities,
      fetchactivities,
      pagination,
      options,
      getDataFromApi,
      loading,
    };
  },
};
</script>

<style scoped>
.name {
  color: #1f60a8;
  padding-right: 4px;
}

.table-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
  padding-top: 20px;
  padding-bottom: 30px;
}
</style>
