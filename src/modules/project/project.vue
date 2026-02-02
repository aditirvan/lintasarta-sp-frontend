<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container>
            <v-row>
              <v-col cols="1">
                <div
                  class="mx-2"
                  style="
                    padding-left: 30;
                    width: 50px;
                    height: 50px;
                    background: #f1f2f2;
                    border-radius: 50%;
                  "
                ></div>
              </v-col>
              <v-col cols="7" class="px-0">
                <p class="mb-0 fz-21 font-weight-bold">
                  {{ $route.params.project }}
                </p>
                <p class="mb-0">
                  Update your project information under Settings
                </p>
              </v-col>
              <v-col
                cols="4"
                class="text-center d-flex justify-end align-center"
              >
                <v-btn
                  to="/service-limit"
                  color="secondary"
                  style="height: 45px; width: 150px"
                  outlined
                  class="mr-3"
                  v-if="
                    currentProj &&
                    currentProj.payment_method == 'postpaid' &&
                    currentProj.postpaid_type == 'fixed' && 
                    currentProj.openstack_project_id != '' 
                  "
                >
                  List Service
                </v-btn>
                <v-btn
                  to="setting"
                  style="height: 45px; width: 150px"
                  depressed
                  class="secondary"
                  append
                  v-if="!read_only"
                  >Settings Project</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <resource :key="$route.params.project" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import resource from "./resource";
import Capacity from "./capacity.vue";
import { ref, watch, computed, onMounted } from "@vue/composition-api";
import { useNamespacedMutations, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { PROJECT } from "./namespace";
import findprojectbyname from "./findprojectbyname";
import { SUPERADMIN } from "../superadmin/namespace";
import { AccessControl } from "@/lib/middleware";


export default {
  components: { resource },
  setup(props, context) {

    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Project'));
    const { setprojectname } = useNamespacedMutations(PROJECT, [
      "setprojectname",
    ]);
    const { setCurrentProj } = useNamespacedMutations(SUPERADMIN, [
      "setCurrentProj",
    ]);
    const { currentProj } = useNamespacedState(SUPERADMIN, ["currentProj"])
    const storage = ref(localStorage.getItem("currentProj")|| "{}")
    const { loginPrime } = useNamespacedGetters("VDC", ["loginPrime"]);

    return {
      read_only,

      setprojectname,
      setCurrentProj,
      currentProj,
      storage
    };
  },

  // beforeRouteUpdate(to, from, next) {
  //   const projectname = to.params.project;
  //   findprojectbyname(projectname)
  //     .then((project) => {
  //       if (project) {
  //         this.setprojectname(projectname);
  //         next();
  //       } else {
  //         next("/notfound");
  //       }
  //     })
  //     .catch((e) => {
  //       next("/notfound");
  //     });
  // },

  beforeRouteUpdate: async (to, from, next) => {
    const projectname = to.params.project;
    const id = to.params.id;
    const project = await findprojectbyname(id);
    if (project) {
      next((vm) => {
        vm.setprojectname(projectname);
        vm.setCurrentProj(project);
      });
    } else {
      next("/project");
    }
  },

  beforeRouteDestroy: async (to, from, next) => {
    const projectname = to.params.project;
    const id = to.params.id;
    const project = await findprojectbyname(id);
    if (project) {
      next((vm) => {
        vm.setprojectname(projectname);
        vm.setCurrentProj(project);
      });
    } else {
      next("/project");
    }
  },

  beforeRouteEnter: async (to, from, next) => {
    const projectname = to.params.project;
    const id = to.params.id;
    const project = await findprojectbyname(id);
    if (project) {
      next((vm) => {
        vm.setprojectname(projectname);
        vm.setCurrentProj(project);
      });
    } else {
      next("/project");
    }
  },
};
</script>
<style lang="scss" scoped>
.v-tabs {
  ::v-deep .v-window {
    border-radius: 8px !important;
  }
}
</style>
