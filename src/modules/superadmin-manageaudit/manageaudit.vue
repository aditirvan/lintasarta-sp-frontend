<template>
  <v-card flat class="pa-7 rounded-lg">
    <v-card-text class="d-flex flex-row align-center">
      <div class="table-title">Manage Audit</div>
      <v-spacer />
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
    <v-card-text>
      <v-row>
        <v-col>
          <v-autocomplete
            :search-input.sync="searchorganizationselectoption"
            @change="changeValueOrg"
            v-model="org"
            :items="organizationsall"
            outlined
            item-text="name"
            item-value="id"
            placeholder="Select Organization"
            attach="#SelectOrgAttach"
            clearable
            hide-details=""
          >
            <template v-slot:append-outer>
              <div id="SelectOrgAttach"></div>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col>
          <v-autocomplete
            class="selectsproject"
            @change="changeValueProject"
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
        </v-col>
      </v-row>
    </v-card-text>

    <v-data-table
      :class="{ hidden: loading }"
      :headers="headers"
      :items="activities"
      :items-per-page="10"
      :server-items-length="pagination.count"
      :options.sync="options"
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
            <div v-if="item.user.role_id == 99">
              {{ item.action }} LA - {{ item.user.fullname }}
            </div>
            <div v-else>{{ item.action }} by {{ item.user.fullname }}</div>
          </div>
        </div>
      </template>
      <template v-slot:item.organization="{ item }">
        <span v-if="item.organization.name != ''">
          {{ item.organization.name }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-slot:item.project="{ item }">
        <span v-if="item.project.name != ''">
          {{ item.project.name }}
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
          :hidden="true"
          :props="props"
        />
      </template>
    </v-data-table>
    <dialogDownload @okay="downloadauditlog" v-model="opendialogdownload" />
  </v-card>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import { useUser } from "@/modules/superadmin-manageuser/useUser";
import { useProjects } from "@/modules/project/useprojects";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { MANAGEAUDITLOG } from "@/modules/superadmin-manageaudit/namespace";
import { useAuditlog } from "@/modules/auditlog/useauditlog";
import dialogDownload from "@/modules/auditlog/dialogDownload.vue";
import { useNotif } from "../notifications/usenotif";

export default defineComponent({
  components: { dialogDownload },
  created() {},
  setup() {
    const Composable = {
      ...useUser(),
      ...useProjects(),
      ...useAuditlog(),
      ...useNotif(),
    };
    const { activities, pagination } = useNamespacedState(MANAGEAUDITLOG, [
      "activities",
      "pagination",
    ]);
    const { fetchactivities } = useNamespacedActions(MANAGEAUDITLOG, [
      "fetchactivities",
    ]);
    const loading = ref(false);
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
    });
    const { fetchprojectsSelectOption, projectselected } = Composable;
    const org = ref();

    const changeValueOrg = (val) => {
      if (val) {
        options.value.organization = val;
      } else {
        options.value.organization = "";
        options.value.project = "";
      }

      fetchprojectsSelectOption({ page: 1, limitPerpage: -1, id: val });
      options.value.page = 1;
      fetchactivities(options.value);
    }

    const changeValueProject = (val) => {
      if (val) {
        options.value.project = val.value;
      } else {
        options.value.project = "";
      }

      options.value.page = 1;
      fetchactivities(options.value);
    }

    onMounted(() => {
    });

    watch(options, async (val) => {
      loading.value = true;
      try {
        fetchactivities(val);
      } finally {
        loading.value = false;
      }
    });

    // watch(org, (val) => {
    //   // console.log(org);
    //   if (val) {
    //     options.value.organization = val;
    //   } else {
    //     options.value.organization = "";
    //     options.value.project = "";
    //   }

    //   fetchprojects({ page: 1, limitPerpage: -1, id: val });
    //   fetchactivities(options.value);
    // });

    // watch(projectselected, (val) => {
    //   if (val) {
    //     options.value.project = val.value;
    //   } else {
    //     options.value.project = "";
    //   }

    //   fetchactivities(options.value);
    // });

    return {
      ...Composable,
      loading: ref(false),
      headers: [
        { text: "Event", value: "event", sortable: false },
        { text: "Organization", value: "organization", sortable: false },
        { text: "Project", value: "project", sortable: false },
        { text: "IP Address", value: "ip_address", sortable: false },
        { text: "Date", value: "date", sortable: false },
      ],
      activities,
      pagination,
      options,
      org,
      changeValueOrg,
      changeValueProject,
    };
  },
});
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
  padding-bottom: 20px;
}
</style>
