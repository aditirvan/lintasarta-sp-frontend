<template>
  <div>
    <superadmindashboard
      v-if="userpermissions && userpermissions.includes('superadmin-sidemenu')"
    />

    <superadmindashboard
      v-if="userpermissions && userpermissions.includes('godmod-sidemenu')"
    />
  
    <v-card v-if="userpermissions && userpermissions.includes('ticket-sidemenu')" flat class="rounded-lg">
    
    </v-card>

    <v-card v-else flat class="rounded-lg">
      <span  v-if="userpermissions && userpermissions.includes('godmod-sidemenu')"></span>

      <span v-else> <listproject v-if="loading || projects.length" ref="listproject" />
      <v-container v-else class="pa-8">
        <v-card class="rounded-lg" outlined flat>
          <v-container class="pa-16" :class="{ animate: loading }">
            <div class="text-center" :class="{ hidden: loading }">
              <div class="font-weight-bold font--text fz-16 pa-8">
                <span
                  >You are not in any project yet, choose project now to be able
                  to access all features!</span
                >
              </div>

              <v-row>
                <v-col cols="3"></v-col>
                <v-col cols="6">
                  <v-btn
                    class="primary px-16"
                    depressed
                    @click="
                      validateprivilages(['Project', 'editor'])
                        .then(() => {
                          return validatelimitcreateproject();
                        })
                        .then(() => {
                          openModal();
                        })
                    "
                  >
                    Create New Project
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-card>
      </v-container></span>
     
    </v-card>
  </div>
</template>

<script>
import { onMounted, ref } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import superadmindashboard from "@/modules/superadmin-dashboard/superadmin-dashboard";
import { useCreateProject } from "@/modules/project/useCreateProject";
import listproject from "@/modules/project/listproject";
import { PROJECT } from "../project/namespace";
import VueRouter from 'vue-router'
const { isNavigationFailure, NavigationFailureType } = VueRouter

export default {
  components: { superadmindashboard, listproject },
  setup(prop, context) {
    const { CrateModal } = useCreateProject();
    const openModal = () => {
      CrateModal.value = true;
    };
    const { userpermissions } = useNamespacedState("ROLEPERMISSION", [
      "userpermissions",
    ]);
    const { fetchprojects } = useNamespacedActions(PROJECT, ["fetchprojects"]);
    const projects = ref([]);
    const loading = ref(true);
    onMounted(async () => {
      const userrole =localStorage.getItem('role');
      // console.log(userpermissions);
      if(userrole=="Superadmin"){
        context.root.$router.push("/manage-organization");
      }else if(userrole=="GodMode"){
        context.root.$router.push("/manage-superadmin");
      }else {
        context.root.$router.push("/project").catch((e) => {
          if (!isNavigationFailure(e, NavigationFailureType.cancelled)) {
            Promise.reject(e)
          }
        });
      }

      if (userpermissions.value.includes("superadmin-sidemenu")) {
        [];
      }if (userpermissions.value.includes("godmod-sidemenu")) {
        [];
      } else if (projects.value.length > 0) {
        context.root.$router.push("/project").catch((e) => {
          if (!isNavigationFailure(e, NavigationFailureType.cancelled)) {
            Promise.reject(e)
          }
        });
      }
      loading.value = true;
      try {
        if (!userpermissions.value.includes("godmod-sidemenu")) {
          await fetchprojects();
        }
        
      } finally {
        if (context.refs.listproject) {
          projects.value = context.refs.listproject.projects;
        }
        loading.value = false;
      }
    });
const {
      validateprivilages,
      validateprivilagesync,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
    ]);
    const {validatelimitcreateproject} = useNamespacedActions(PROJECT,['validatelimitcreateproject'])
    return {
      validateprivilages,
      validateprivilagesync,
      validatelimitcreateproject,
      loading,
      projects,
      openModal,
      userpermissions,
    };
  },
};
</script>

<style scoped>
.v-btn {
  height: 50px !important;
}
</style>

