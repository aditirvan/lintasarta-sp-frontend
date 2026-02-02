<template>
  <v-dialog v-model="SelectModal" width="800">
    <v-card v-if="projects.length == 0 && !loading" flat class="rounded-lg">
      <v-container class="pa-8">
        <h3>Select Project</h3>
        <br />
        <v-card class="rounded-lg" outlined flat>
          <v-container class="pa-8">
            <div
              class="text-center"
              style="padding-top: 70px; padding-bottom: 70px"
            >
              <div class="empty-title">
                Looks like you don’t have any project
              </div>
              <div class="empty-content">
                Project organize your resources into gropus that fit the way you
                work
              </div>

              <v-btn
                style="width: 300px; height: 50px"
                class="secondary"
                depressed
                @click="
                  () => {
                    validateprivilages(['Project', 'editor'])
                      .then(() => {
                        return validatelimitcreateproject();
                      })
                      .then(() => {
                        newProject();
                      });
                  }
                "
              >
                Create New Project
              </v-btn>
            </div>
          </v-container>
        </v-card>
        <div class="text-center pt-8">
          <v-btn
            depressed
            style="width: 150px; height: 50px"
            dark
            class="accent"
            @click="()=>{SelectModal = false}"
          >
            CLOSE
          </v-btn>
        </div>
      </v-container>
    </v-card>
    <v-card v-else flat class="rounded-lg">
      <v-card-title>
        <v-row>
          <v-col cols="8" class="d-flex flex-row align-center"
            ><h3 :class="{ animate: loading }">
              <span :class="{ hidden: loading }">Project</span>
            </h3></v-col
          >
          <v-col cols="4 text-right" :class="{ animate: loading }"
            >
            <!-- <v-btn
              :class="{ hidden: loading }"
              class="secondary"
              style="width: 150px"
              depressed
              @click="
                () => {
                  validatelimitcreateproject().then(() => {
                    newProject();
                  });
                }
              "
            >
              NEW PROJECT
            </v-btn> -->
          </v-col>
        </v-row>
      </v-card-title>

      <div
        :class="{ animate: loading }"
        style="max-width: 775px; padding-left: 25px; padding-bottom: 15px"
      >
        <v-text-field
          maxlength="30"
          :class="{ hidden: loading }"
          label="Enter Name"
          prepend-inner-icon="mdi-magnify"
          single-line
          outlined
          v-model="project_name"
        ></v-text-field>
      </div>

      <v-card-text
        :class="{ animate: loading }"
        style="height: 300px; overflow: auto"
      >
        <v-data-table
          :class="{ hidden: loading }"
          style="position: sticky; top: 0; z-index: 10"
          id="headeronly"
          :headers="headers"
          hide-default-footer
          hide-default-header
          :items-per-page="-1"
          :items="projects"
          :search="project_name"
          :sort-by.sync="sortby"
          :sort-desc.sync="sortdesc"
        >
          <template v-slot:header="{ props, on }">
            <v-data-table-header
              v-on="on"
              v-bind="props"
              sort-icon="mdi-menu-down"
            >
            </v-data-table-header>
          </template>
          <template v-slot:item.name="{ item }">
            <div class="d-flex flex-row">
              <v-icon>$vuetify.icons.targetIcon</v-icon>
              <router-link
                style="white-space: nowrap"
                :to="`/project/${item.name}`"
              >
                <span class="font-weight-bold ml-2">
                  {{ $lodash.truncate(item.name) }}</span
                >
              </router-link>
            </div>
          </template>
          <template v-slot:item.datecreated="{ item }">
            {{ $moment(new Date(item.datecreated)).format("DD/MM/YYYY") }}
          </template>
        </v-data-table>
        <v-data-table
          :class="{ hidden: loading }"
          id="hideheader"
          :headers="headers"
          hide-default-footer
          hide-default-header
          :items="projects"
          :items-per-page="-1"
          :search="project_name"
          :sort-by.sync="sortby"
          :sort-desc.sync="sortdesc"
        >
          <template v-slot:header="{ props, on }">
            <v-data-table-header
              v-on="on"
              v-bind="props"
              sort-icon="mdi-menu-down"
            >
            </v-data-table-header>
          </template>
          <template v-slot:item.name="{ item }">
            <div class="d-flex flex-row">
              <v-icon>$vuetify.icons.targetIcon</v-icon>
              <div
                class="cursor-pointer primary--text"
                @click="
                  () => {
                    SelectModal = false;
                    changeProjectNameTo(item.name)
                    updateCurrentProj(item)
                  }
                "
                style="white-space: nowrap"
              >
                <span
                  class="font-weight-bold ml-2"
                  @click="openProject(item)"
                >
                  {{ $lodash.truncate(item.name) }}</span
                >
              </div>
            </div>
          </template>
          <template v-slot:item.datecreated="{ item }">
            {{ $moment(new Date(item.created_at)).format("DD/MM/YYYY") }}
          </template>
        </v-data-table>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>

<script>
import { useCreateProject } from "./useCreateProject";
import { useProjects } from "./useprojects";

import {
  ref,
  defineComponent,
  watch,
  computed,
  onMounted,
} from "@vue/composition-api";
import { PROJECT } from "@/modules/project/namespace";
import { SUPERADMIN } from '@/modules/superadmin/namespace'
import { MANAGESERVICE } from '../manage-service/namespace'
import {
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import localstorage from "@/lib/localstorage";
import { VDC } from "../deka-prime/vdc/namespace";
import { I3GIS } from '@/modules/sast/namespace';


export default defineComponent({
  setup(props, context) {
    const { CrateModal } = useCreateProject();
    const { projects } = useNamespacedState(PROJECT, ["projects"]);
    const search_project = ref(projects.value);
    const project_name = ref("");

    function newProject() {
      SelectModal.value = false;
      CrateModal.value = true;
    }

    const findProject = (project_name) => {
      const name = project_name.toLowerCase();
      search_project.value = projects.value.filter(
        (item) => item.value.name.toLowerCase().indexOf(name) >= 0
      );
    };
    const { fetchprojects, changeProjectNameTo } = useNamespacedActions(PROJECT, ["fetchprojects", 'changeProjectNameTo']);
    const { updateCurrentProj } = useNamespacedActions(SUPERADMIN, ["updateCurrentProj", ]);
    const { SelectModal } = useProjects();
    const loading = ref(true);
    const encodeUri = (val) => encodeURI(val);
    watch(SelectModal, async (val) => {
      if (val) {
        loading.value = true;
        await fetchprojects();
        loading.value = false;
      }
    });
    onMounted(async () => {
      loading.value = true;
      await fetchprojects();
      loading.value = false;
    });
    const headers = ref([
      {
        text: "Project Name",
        value: "name",
      },
      {
        text: "ID",
        value: "id",
      },
      {
        text: "Date Created",
        value: "datecreated",
        align: "center",
        width: 150,
      },
    ]);
    const { setprojectid } = useNamespacedMutations(PROJECT, ["setprojectid"]); 
    const { loginDns, loginDbaas, logoutDbaas, loginSsl } = useNamespacedActions(SUPERADMIN, ["loginDns", "loginDbaas", "logoutDbaas", "loginSsl"]);
    const { loginMS } = useNamespacedActions(MANAGESERVICE, ["loginMS"])
    const { loginDP } = useNamespacedActions(VDC, ["loginDP"]);
    const { getquotalimitI3gis } = useNamespacedActions(I3GIS,["getquotalimitI3gis"]);
    
    
    const openProject = async (item) => {
      setprojectid(item.id);
      const paramsDns = {
        organization_id: item.organization_id,
        project_id: item.id,
        user_id: localStorage.getItem("userId")?.replaceAll('"', "")
      }
      const paramsMS = {
        organization_id: item.organization_id,
        project_id: item.id,
        user_id: localStorage.getItem("userId")?.replaceAll('"', "")
      }
      const paramsDbaas = {
        organizationId: item.organization_id,
        projectId: item.id,
        userId: localStorage.getItem("userId")?.replaceAll('"', ""),
        username: localStorage.getItem("username"),
      }
      const paramsSsl = {
        user_id: localStorage.getItem("userId")?.replaceAll('"', ""),
        project_id: item.id,
        organization_id: item.organization_id,
      }

      // logout sebelum login
      const storageDbaas = localstorage.getItem('loginDbaas')
      const data = JSON.parse(storageDbaas)
      if (data) {
        logoutDbaas({uniqueID: data.uniqueID})
      }
      
      const paramsDP = {
        organizationId: item.organization_id,
        organizationName: item.name,
        userId: localStorage.getItem("userId")?.replaceAll('"', ""),
        username: localStorage.getItem("username"),
        projectId: item.id,
        dekaprimeProjectId: item.dekaprime_project_id,
      } 
      loginDns(paramsDns)
      loginDbaas(paramsDbaas)
      loginMS(paramsMS)
      loginSsl(paramsSsl)
      let loginDPRes = await loginDP(paramsDP)

      context.root.$router.replace(`/project/${encodeUri(item.name)}/${item.id}`);
    };
    const { validatelimitcreateproject } = useNamespacedActions(PROJECT, [
      "validatelimitcreateproject",
    ]);
    const {
      validateprivilages,
      validateprivilagesync,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
    ]);
    return {
      updateCurrentProj,
      changeProjectNameTo,
      validateprivilages,
      validatelimitcreateproject,
      openProject,
      loading,
      SelectModal,
      headers,
      CrateModal,
      newProject,
      project_name,
      findProject,
      fetchprojects,
      projects,
      sortby: ref(""),
      sortdesc: ref(""),
    };
  },
});
</script>

<style lang="scss" scoped>
.v-btn {
  height: 50px !important;
}
#headeronly {
  tbody {
    visibility: collapse;
  }
}
#hideheader {
  thead {
    visibility: collapse;
  }
}
.hidden {
  visibility: hidden;
}
</style>

<style>
.empty-title {
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 140%;
  /* or 22px */
  text-transform: capitalize;
  color: #556272;
}

.empty-content {
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 140%;
  /* identical to box height, or 17px */
  padding-top: 12px;
  padding-bottom: 20px;
  text-align: center;
  color: #a5b3bf;
}
</style>