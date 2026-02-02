<template>
  <!-- <p>instance</p> -->
  <v-card class="rounded-lg elevation-0">
    <v-container fluid class="pa-7">
      <v-row justify="center">
        <v-col class="d-flex align-center" cols="8">
          <p class="mb-0 fz-21 font-weight-bold">List Project</p>
        </v-col>
        <v-col cols="4" class="d-flex justify-end align-center">
          <v-btn class="secondary mr-2" height="45" width="150" depressed v-if="isShowDekaPrime" to="/import">
            <span style="font-weight: 700">Import Deka Prime</span>
          </v-btn>

          <v-btn
            v-if="projects.length > 0"
            depressed
            height="45"
            width="150"
            @click="
              () => {
                validateprivilages(['Project', 'editor'])
                  .then(() => {
                    return validatelimitcreateproject();
                  })
                  .then(() => {
                    CrateModal = true;
                  });
              }
            "
            class="secondary"
          >
            <span style="font-weight: 700">Create New Project</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="isloading">
        <v-col class="text-center pa-15">
          <v-progress-circular :size="200" color="primary" indeterminate></v-progress-circular>
        </v-col>
      </v-row>

      <v-row v-if="!isloading && projects.length">
        <v-col cols="4" v-for="project in projects" :key="project.id">
          <v-card outlined class="rounded-lg" style="border-color: #2c94d2; height: 100%; min-height: 213px">
            <v-card-text>
              <v-row>
                <v-col class="py-0 pr-0">
                  <div class="d-flex flex-row align-center">
                    <v-icon style="width: 30px; height: 30px">$vuetify.icons.projectIcon</v-icon>
                    <div class="ml-3 cursor-pointer" @click="openProject(project)">
                      <span style="font-family: Fira Sans; font-style: normal; font-weight: 800; font-size: 14px; line-height: 120%" class="primary--text">{{
                        project.name
                      }}</span>
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="instanceinfo">
                  <v-row
                    ><v-col cols="4"><p>Project ID</p></v-col
                    ><v-col cols="8"
                      ><p>{{ project.id }}</p></v-col
                    ></v-row
                  >

                  <v-row v-if="project.openstack_project_id"
                    ><v-col cols="4"><p>Region</p></v-col
                    ><v-col cols="8"
                      ><p>{{ project.region }}</p></v-col
                    ></v-row
                  >
                  <v-row
                    ><v-col cols="4"><p>Status</p></v-col
                    ><v-col cols="8"
                      >
                      <span v-if="project.status === 1">
                        <v-chip class="mr-2 my-1" small color="green" outlined>
                          <b> {{ projectStatus(project.status) }} </b>
                        </v-chip>
                      </span>
                      <span v-else>
                        <v-chip class="mr-2 my-1" small color="red" outlined>
                          <b> {{ projectStatus(project.status) }} </b>
                        </v-chip>
                      </span>
                    </v-col></v-row
                  >

                  <v-row
                    ><v-col cols="4"><p>Activation Date</p></v-col
                    ><v-col cols="8"
                      ><p class="primary--text" style="text-align: justify">
                        <b>
                          {{ project.service_activation_date ? $moment(project.service_activation_date).format("DD MMMM YYYY") : "-" }}
                        </b>
                      </p></v-col
                    ></v-row
                  >

                  <v-row v-if="project.openstack_project_id"
                    ><v-col cols="4"><p>Payment Method</p></v-col
                    ><v-col cols="8"
                      ><p style="text-align: justify">
                        {{ project.payment_method === "postpaid" ? formatPostpaidType(project.postpaid_type) : uppercaseFirstLetter(project.payment_method) }}
                        <span v-if="project.postpaid_fixed_type">- {{ project.postpaid_fixed_type === "prorate" ? "Prorate" : "Full Cycle" }}</span>
                      </p></v-col
                    ></v-row
                  >

                  <v-row>
                    <v-col cols="4"><p>Type</p></v-col>
                    <v-col cols="8">
                      <v-chip outlined class="mr-2 my-1" color="primary" small v-if="project.openstack_project_id">
                        <strong>Dekaflexi</strong>
                      </v-chip>
                      <v-chip outlined class="mr-2 my-1" color="primary" small v-if="project.dekaprime_project_id">
                        <strong>Dekaprime</strong>
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="!isloading && !projects.length">
        <v-col>
          <v-card outlined flat class="pa-8 rounded-lg">
            <div class="text-center">
              <div class="font-weight-bold font--text fz-16">
                <span>It's look like You don't have any project</span>
              </div>
              <div style="height: 30px" />
              <v-row>
                <v-col cols="3"></v-col>
                <v-col cols="6">
                  <v-btn
                    class="primary px-16"
                    depressed
                    @click="
                      () => {
                        validatelimitcreateproject().then(() => {
                          CrateModal = true;
                        });
                      }
                    "
                  >
                    Create New Project
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-menu v-model="showMenu" :position-x="x - 10" :position-y="y" absolute allow-overflow>
        <v-list>
          <v-list-item>
            <v-list-item-title>Add Floating IP</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Access Console</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Resize Instance</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>View Usage</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Enable Backup</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Create Snapshot</v-list-item-title>
          </v-list-item>
          <v-list-item><v-divider /></v-list-item>
          <v-list-item>
            <v-list-item-title>Delete Instance</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-container>
  </v-card>
</template>

<script>
import { onMounted, ref } from "@vue/composition-api";
import { INSTANCE } from "../instance/namespace";
import { SUPERADMIN } from "../superadmin/namespace";
import { MANAGESERVICE } from "../manage-service/namespace";
import { useNamespacedActions, useNamespacedState, useNamespacedMutations } from "vuex-composition-helpers";
import { PROJECT } from "@/modules/project/namespace";
import createproject from "./createproject";
import { useCreateProject } from "./useCreateProject";
import localstorage from "@/lib/localstorage";
import { VDC } from "../deka-prime/vdc/namespace";
import { I3GIS } from "@/modules/sast/namespace";
import { projectStatus } from "@/lib/formatter";
import moment from "moment";

const isDevModePrepaid = true;

export default {
  setup(props, context) {
    const { openModal } = createproject();
    const { validateprivilages, validateprivilagesync } = useNamespacedActions("HOMEPAGE", ["validateprivilages", "validateprivilagesync"]);
    const { fetchprojects } = useNamespacedActions(PROJECT, ["fetchprojects"]);
    const { loginDns, loginDbaas, logoutDbaas, loginSsl } = useNamespacedActions(SUPERADMIN, ["loginDns", "loginDbaas", "logoutDbaas", "loginSsl"]);
    const { loginMS } = useNamespacedActions(MANAGESERVICE, ["loginMS"]);
    const { loginDP } = useNamespacedActions(VDC, ["loginDP"]);

    const privilages = JSON.parse(localStorage.getItem("privilages"));
    const isShowDekaPrime = ref(true);
    privilages.map((x) => {
      let is_creator = localStorage.getItem('is_creator')
      let currentOrg = JSON.parse(localStorage.getItem('currentOrg'))
      if (x.disable) {
        if (x.name.toLowerCase() == "dekaprime" && is_creator == 'true') {
          isShowDekaPrime.value = false;
        }
      }
      if(currentOrg.dekaprime_organization_id != ''){
          isShowDekaPrime.value = false;
        }
    });
    const { getquotalimitI3gis } = useNamespacedActions(I3GIS, ["getquotalimitI3gis"]);

    const isloading = ref(true);

    onMounted(() => {
      fetchprojects().then(() => {
        isloading.value = false;
      });
    });
    // const { instances } = useNamespacedState(INSTANCE, ['instances'])
    const { projects } = useNamespacedState(PROJECT, ["projects"]);
    const encodeUri = (val) => encodeURI(val);

    const { setCurrentProj } = useNamespacedMutations(SUPERADMIN, ["setCurrentProj"]);

    const selected = ref("grid");
    const { changeProjectTo } = useNamespacedActions(PROJECT, ["changeProjectTo"]);
    const openProject = async (project) => {
      setCurrentProj(project);
      changeProjectTo(project.id);
      const paramsDns = {
        organization_id: project.organization_id,
        project_id: project.id,
        user_id: localStorage.getItem("userId")?.replaceAll('"', ""),
      };
      const paramsMS = {
        organization_id: project.organization_id,
        project_id: project.id,
        user_id: localStorage.getItem("userId")?.replaceAll('"', ""),
      };
      const paramsDbaas = {
        organizationId: project.organization_id,
        projectId: project.id,
        userId: localStorage.getItem("userId")?.replaceAll('"', ""),
        username: localStorage.getItem("username"),
      };
      const paramsSsl = {
        user_id: localStorage.getItem("userId")?.replaceAll('"', ""),
        project_id: project.id,
        organization_id: project.organization_id,
      };

      // logout sebelum login
      const storageDbaas = localstorage.getItem("loginDbaas");
      const data = JSON.parse(storageDbaas);
      if (data) {
        logoutDbaas({ uniqueID: data.uniqueID });
      }

      const paramsDP = {
        organizationId: project.organization_id,
        organizationName: project.name,
        userId: localStorage.getItem("userId")?.replaceAll('"', ""),
        username: localStorage.getItem("username"),
        projectId: project.id,
        dekaprimeProjectId: project.dekaprime_project_id,
      };

      loginDns(paramsDns)
      loginDbaas(paramsDbaas)
      loginMS(paramsMS)
      loginSsl(paramsSsl)
      getquotalimitI3gis(paramsDns)
      let loginDPRes = await loginDP(paramsDP);
      context.root.$router.replace(`/project/${encodeUri(project.name)}/${project.id}`);

    };
    const { CrateModal } = useCreateProject();
    const { validatelimitcreateproject } = useNamespacedActions(PROJECT, ["validatelimitcreateproject"]);
    const getDate = (data) => {
      const date1 = moment(data).format("YYYY-MM-DD");
      const date2 = moment(new Date()).format("YYYY-MM-DD");
      if (date1 == date2) {
        return "Active";
      } else if (date1 < date2) {
        return "Active";
      } else if (date1 > date2) {
        return "Pending";
      }
    };
    return {
      validatelimitcreateproject,
      fetchprojects,
      CrateModal,
      openProject,
      projects,
      selected,
      openModal,
      isloading,
      loginDns,
      loginDbaas,
      loginMS,
      loginSsl,
      loginDP,
      validateprivilages,
      isShowDekaPrime,
      setCurrentProj,
      getDate,
      projectStatus,
    };
  },

  data() {
    return {
      isDevModePrepaid,
      showMenu: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "IP Address", value: "ipaddress" },
        { text: "Region", value: "region" },
        { text: "Created date", value: "createddate" },
        { text: "Tags", value: "tags" },
        { text: "Action", sortable: false, align: "center", value: "action" },
      ],

      x: 0,
      y: 0,
    };
  },
  methods: {
    show(e) {
      e.preventDefault();
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    uppercaseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    formatPostpaidType(type) {
      return type === "fixed" ? "Postpaid Fixed" : "Postpaid Usage Based";
    },
  },
};
</script>
<style lang="scss" scoped>
[role="menu"] {
  box-shadow: none;
  &::before {
    content: url("~@/assets/tri.png");
    position: relative;
    left: 5px;
  }
  .v-list {
    border-radius: 5px;
    margin: -8px 2px 2px 2px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
}
.v-icon {
  ::v-deep .v-icon__component {
    height: 30px;
    width: 30px;
  }
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
  &.col {
    padding-bottom: 0px;
  }
  .col:first-child {
    p {
      font-weight: 700;
    }
  }
  .col {
    padding: 0px 12px 0px 12px;
    font-size: 14px;
    margin-bottom: 15px;
  }
}
</style>
