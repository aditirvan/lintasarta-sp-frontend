<template>
  <v-row>
    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-container class="px-4">
          <v-row>
            <v-col cols="5">
              <h3>Select Project</h3>
            </v-col>
            <v-col cols="7" class="text-right"
              ><v-btn
                class="secondary"
                depressed
                @click="
                  () => {
                    validatelimitcreateproject().then(()=>{
						CrateModal = true;
					})
                  }
                "
              >
                Create New Project
              </v-btn>
            </v-col>
          </v-row>

          <div class="text-center pa-15" v-if="isloading">
            <v-progress-circular
              :size="200"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
          <v-row v-if="!isloading">
            <v-col cols="4" v-for="project in projects" :key="project.id">
              <v-card
                min-height="191"
                flat
                class="rounded-lg"
                style="height: 100%; background-color: rgba(44, 148, 210, 0.02)"
                :to="{ path: `/project/${project.name}` }"
              >
                <v-alert outlined color="primary" class="pb-0">
                  <v-icon>$vuetify.icons.listprojectIcon</v-icon>
                  <span class="project-card-title pl-3">
                    {{ project.name }}
                  </span>

                  <v-card-text>
                    <table>
                      <tr>
                        <td><span class="project-title">Project ID </span></td>
                        <td>
                          <span class="project-item">
                            lintasarta-development-apps</span
                          >
                        </td>
                      </tr>

                      <tr>
                        <td class="project-title">Description</td>
                        <td class="project-item">
                          {{ project.description }}
                        </td>
                      </tr>
                    </table>
                  </v-card-text>
                </v-alert>
              </v-card>
            </v-col>
            <v-col cols="4"> </v-col>
            <v-col cols="4"></v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import createproject from "./createproject";

import { ref, onMounted } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { PROJECT } from "./namespace";
import { useCreateProject } from "./useCreateProject";

export default {
  setup() {
    const { openModal } = createproject();

    const isloading = ref(true);

    const { projects } = useNamespacedState(PROJECT, ["projects"]);
    const { fetchprojects } = useNamespacedActions(PROJECT, ["fetchprojects"]);
    onMounted(() => {
      fetchprojects().then(() => {
        isloading.value = false;
      });
    });
    function newProject() {
      openModal();
    }
    const { CrateModal } = useCreateProject();
    const { validatelimitcreateproject } = useNamespacedActions(PROJECT, [
      "validatelimitcreateproject",
    ]);
    return {
      validatelimitcreateproject,
      CrateModal,
      newProject,
      projects,
      isloading,
    };
  },
};
</script>

<style scoped>
.v-btn {
  height: 45px !important;
}

.project-list {
  background-color: rgba(44, 148, 210, 1);
}

.project-card-title {
  font-family: "Fira Sans";
  font-style: normal;
  font-weight: 800;
  font-size: 11px;
  line-height: 120%;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 10px;
}

table > tr {
  vertical-align: text-top;
}

.project-title {
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: left;
}

.project-item {
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: left;
}
</style>
