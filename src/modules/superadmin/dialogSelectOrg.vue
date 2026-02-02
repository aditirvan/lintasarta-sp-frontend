<template>
  <v-dialog v-model="dialog" width="800" :retain-focus="false">
    <v-card flat class="rounded-lg">
      <v-card-title>
        <v-row>
          <v-col cols="8">
            <div class="headline font-weight-bold font--text">
              Select Organization or Project
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <div
        id="SearchProject"
        style="max-width: 775px; padding-left: 25px; padding-bottom: 15px"
      >
        <v-text-field
          maxlength="50"
          placeholder="Search Organization or Project"
          prepend-inner-icon="mdi-magnify"
          single-line
          outlined
          v-model="searchProject"
        >
        </v-text-field>
      </div>
      <v-card-text>
        <v-data-table
          :search="searchProject"
          id="hideheader"
          :hide-default-footer="true"
          :headers="headersProject"
          :items="organizationprojects"
          :items-per-page="10"
          :options.sync="options"
          :server-items-length="organizationprojectpagination.count"
          height="290"
        >
          <template v-slot:item="{ item }">
            <tr :key="item.project_id">
              <td>
                <v-icon left>$vuetify.icons.gg_organizationIcon</v-icon>
                <span>{{ item.org_name }}</span>
              </td>
              <td>
                <div class="d-flex">
                  <v-icon left>$vuetify.icons.targetIcon</v-icon>
                  <div
                    v-if="item.project_name !== ''"
                    class="linkpointer"
                    @click="SetCurrentOrgAndProj(item.project_id)"
                  >
                    {{ item.project_name }}
                  </div>
                  <div v-else>-</div>
                </div>
              </td>
            </tr>
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
      </v-card-text>

      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import project from "@/lib/project";
import {
  computed,
  defineComponent,
  ref,
  onMounted,
  watch,
} from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import { State } from "../organization/organization.store";
import { PROJECT } from "../project/namespace";
import { SUPERADMIN } from "./namespace";
import { MANAGESERVICE } from '../manage-service/namespace'
import localstorage from "@/lib/localstorage";
import { VDC } from "../deka-prime/vdc/namespace";
import { I3GIS } from '@/modules/sast/namespace';



interface Project {
  name: string;
  id: string;
}
interface Organization {
  name: string;
  id: string;
  open: boolean;
  projects: Array<Project>;
}
export default defineComponent({
  props: ["value"],
  methods: {},

  setup(props, context) {
    const { fetchorganizationprojects, fetchprojectwithorganization, loginDns, loginDbaas, logoutDbaas, loginSsl } = useNamespacedActions(SUPERADMIN, [
      "fetchorganizationprojects", "fetchprojectwithorganization", "loginDns", "loginDbaas", "logoutDbaas", "loginSsl"
    ]);
    const { loginMS } = useNamespacedActions(MANAGESERVICE, ["loginMS"])
    const { organizationprojects, organizationprojectpagination } = useNamespacedState(SUPERADMIN, [
      "organizationprojects", "organizationprojectpagination"]);
    const { loginDP } = useNamespacedActions(VDC, ["loginDP"]);
    const { organizations } = useNamespacedState<State>(SUPERADMIN, [
      "organizations",
    ]);
    const T = ref();

    const { setCurrentOrg, setCurrentProj } = useNamespacedMutations(
      SUPERADMIN,
      ["setCurrentOrg", "setCurrentProj"]
    );
    const { selectModal } = useNamespacedState(PROJECT, ["selectModal"]);
    const { setselectmodal } = useNamespacedMutations(PROJECT, [
      "setselectmodal",
    ]);
    const { getquotalimitI3gis } = useNamespacedActions(I3GIS,["getquotalimitI3gis"]);
    const dialog = computed({
      get:() => selectModal.value,
      set: (val) => setselectmodal(val)
    })
    async function onSelect(a: any , b: any) {
      const paramsDns = {
        organization_id: b.organization_id,
        project_id: b.id,
        user_id: localStorage.getItem("userId")?.replaceAll('"', "")
      }
      const paramsMS = {
        organization_id: b.organization_id,
        project_id: b.id,
        user_id: localStorage.getItem("userId")?.replaceAll('"', "")
      }
      const paramsDbaas = {
        organizationId: b.organization_id,
        projectId: b.id,
        userId: localStorage.getItem("userId")?.replaceAll('"', ""),
        username: localStorage.getItem("username")
      }
      const paramsSsl = {
        user_id: localStorage.getItem("userId")?.replaceAll('"', ""),
        project_id: b.id,
        organization_id: b.organization_id,
      }

      // logout sebelum login
      const storageDbaas = localstorage.getItem('loginDbaas')
      const data = JSON.parse(storageDbaas)
      if (data) {
        logoutDbaas({uniqueID: data.uniqueID})
      }

      const paramsDP = {
        organizationId: b.organization_id,
        organizationName: b.name,
        userId: localStorage.getItem("userId")?.replaceAll('"', ""),
        username: localStorage.getItem("username"),
        projectId: b.id,
        dekaprimeProjectId: b.dekaprime_project_id,
      } 

      loginDns(paramsDns)
      loginDbaas(paramsDbaas)
      loginMS(paramsMS)
      loginSsl(paramsSsl)
      let loginDPRes = await loginDP(paramsDP)
    }

    const options = ref({ page: 1, itemsPerPage: 10, search: "", sortBy: [], sortDesc: [] });
    const loading = ref(false);
    
    // watch pagination
    watch(
      options,
      async (val) => {
        loading.value = true
        try {
          await fetchorganizationprojects(val)
        } finally {
          loading.value = false
        }
      },
      { deep: true }
    );

    // watch search field
    const searchProject = ref("")
    let searchtimeout = setTimeout(() => {}, 500)
    watch(searchProject, (val) => {
      clearTimeout(searchtimeout);
      searchtimeout = setTimeout(() => {
        options.value.page = 1
        options.value.search = val
      }, 500);
    });

    const SetCurrentOrgAndProj = async (projId: string) => {
      const res = await fetchprojectwithorganization(projId)
      if (res.status !== 200) return
      const { organization, project } = res.data.data
      dialog.value = false;
      setCurrentOrg(organization);
      setCurrentProj(project);
      let onSelectRes = await onSelect(organization, project);
      context.root.$router
        .replace('/project/' + encodeURI(project.name)+'/'+project.id)
        .catch(() => {});
    }

    return {
      searchProject,
      dialog,
      setCurrentOrg,
      setCurrentProj,
      organizationprojects,
      organizationprojectpagination,
      SetCurrentOrgAndProj,
      T,
      onSelect,
      loginDns,
      loginMS,
      options,
    };
  },
  watch: {
  },
  updated() {},
  data() {
    return {
      headersProject: [
        { text: "Organization", value: "organizationName", sortable: false },
        { text: "Project", value: "projectName", sortable: false },
      ],
    };
  },
});
</script>
<style lang="scss">
#SearchOrg {
  .v-input__prepend-inner {
    margin-top: 12px;
  }
}
#SearchProject {
  .v-input__prepend-inner {
    margin-top: 12px;
  }
}
#headeronly {
  tbody {
    visibility: collapse;
  }
}
</style>
