<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container class="pa-7">
            <div class="vpc-title">Settings Project</div>

            <v-row>
              <v-col cols="6">
                <h4 class="pb-2">Name</h4>
                <v-text-field
                  maxlength="30"
                  v-model="name"
                  placeholder="Enter Project Name"
                  single-line
                  outlined
                  :error-messages="$vUserAdmin.name.$errors.length ? $vUserAdmin.name.$errors[0].$message : ''"
                ></v-text-field>
              </v-col>

              <v-col>
                <h4 class="pb-2">Description</h4>
                <v-textarea
                  maxlength="255"
                  v-model="desc"
                  outlined
                  single-line
                  name="input-7-4"
                  placeholder="Enter Description Project"
                  :error-messages="$vUserAdmin.description.$errors.length ? $vUserAdmin.description.$errors[0].$message : ''"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn block class="primary" style="background-color: #a5b3bf !important" depressed @click="$router.go(-1)"
                  ><span style="font-size: 16px">Cancel</span></v-btn
                >
              </v-col>

              <v-col>
                <v-btn block class="secondary" depressed @click="updateProject()"><span style="font-size: 16px">Save</span></v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <ProjectDetail :vatid="vatid" />

    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container class="pa-7">
            <v-row>
              <v-col cols="9">
                <h2>Delete Project</h2>
                <p>To delete a project, you must move or delete all resources within it. Default project cannot be deleted.</p>
              </v-col>
              <v-col cols="3" class="text-center">
                <!-- opendeleteproject = true; -->
                <v-btn :selectedproject="currentProj" @click="hapusProject" style="width: 150px" depressed dark class="error"
                  ><span style="font-size: 14px">Delete Project</span></v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <dialogDeleteProj
      v-if="opendeleteproject"
      :selectedproject="currentProj"
      v-model="opendeleteproject"
      @close="
        () => {
          opendeleteproject = false;
        }
      "
      @deleteproject="
        () => {
          opendialogareyousure = true;
        }
      "
    />
    <dialogAreYouSure
      v-if="opendialogareyousure"
      :project="currentProj"
      v-model="opendialogareyousure"
      @deleted="() => {}"
      @error="
        (response) => {
          opendeleteproject = false;
          dialogerrormsg = response.data.data;
          opendialogerror = true;
        }
      "
    />
    <dialogErrorDelete v-model="opendialogerror" :message="dialogerrormsg" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from "vuex-composition-helpers";
import { SUPERADMIN } from "../superadmin/namespace";
import dialogDeleteProj from "./dialogDeleteProj.vue";
import dialogAreYouSure from "./dialogAreYouSure.vue";
import dialogErrorDelete from "./dialogErrorDelete.vue";
import findprojectbyname from "./findprojectbyname";
import { PROJECT } from "./namespace";
import { useCreateProject } from "./useCreateProject";
import ProjectDetail from "./setting/ProjectDetail.vue";

export default defineComponent({
  props: ["project"],
  components: { dialogDeleteProj, dialogErrorDelete, dialogAreYouSure, ProjectDetail },
  setup(props, context: any) {
    const { deleteproject, checkproject } = useNamespacedActions(PROJECT, ["deleteproject", "checkproject"]);
    const { currentProj } = useNamespacedState(SUPERADMIN, ["currentProj"]);
    const { name, description: desc, $vUserAdmin, vatid } = useCreateProject();

    onMounted(() => {
      const proj = currentProj as any;
      name.value = proj.value.name;
      desc.value = proj.value.description;
      vatid.value = proj.value.vat_id
    });

    const purpose = ref("");
    const env = ref("");
    const nameErrors = computed(() => {
      return $vUserAdmin.value.name.$errors;
    });
    const descErrors = computed(() => {
      return $vUserAdmin.value.description.$errors;
    });
    const { updateCurrentProj } = useNamespacedActions(SUPERADMIN, ["updateCurrentProj"]);
    const { showErrorToast } = useNamespacedActions("HOMEPAGE", ["showErrorToast"]);
    const { editproject } = useNamespacedActions(PROJECT, ["editproject"]);
    const { projectname } = useNamespacedState(PROJECT, ["projectname"]);
    const { setopendialoghavebeensubmitted } = useNamespacedMutations("DASHBOARD", ["setopendialoghavebeensubmitted"]);
    const { opendialoghavebeensubmitted } = useNamespacedState("DASHBOARD", ["opendialoghavebeensubmitted"]);

    const updateProject = () => {
      $vUserAdmin.value.$touch();
      if ($vUserAdmin.value.$errors.length) return;
      const curr = currentProj.value as any;
      const Value = {
        id: curr.id,
        name: name.value,
        description: desc.value,
      };
      editproject(Value)
        .then(() => {
          updateCurrentProj(Value);
          setopendialoghavebeensubmitted(true);
          watch(opendialoghavebeensubmitted, (val) => {
            if (val == false) {
              // context.root.$router.go(-1);
              context.root.$router.replace("/project/" + Value.name + "/" + curr.id);
            }
          });
        })
        .catch(({ response }) => {
          showErrorToast(response.data.data);
        });
    };

    const { setprojectname } = useNamespacedMutations(PROJECT, ["setprojectname"]);
    const { setCurrentProj } = useNamespacedMutations(SUPERADMIN, ["setCurrentProj"]);
    const dialogerrormsg = ref("");
    const opendialogerror = ref(false);
    const opendeleteproject = ref(false);
    const opendialogareyousure = ref(false);
    const dialogareyousureprojectname = ref("");

    const hapusProject = () => {
      // const deka = localStorage.getItem("dekaPrime");
      // if (!deka) {
      //   $vUserAdmin.value.$touch();
      //   if ($vUserAdmin.value.$errors.length) return;
      // }
      const curr = currentProj.value as any;
      const Value = {
        id: curr.id,
        name: name.value,
        description: desc.value,
      };
      checkproject(Value)
        .then((e: any) => {
          opendeleteproject.value = true;
          //context.root.$router.replace(`/`);
          //opendialogareyousure=true;
          //opendialogareyousure(true);
          // updateCurrentProj(Value);
          // setopendialoghavebeensubmitted(true);
          // watch(opendialoghavebeensubmitted, (val) => {
          //   if (val == false) {
          //     context.root.$router.replace(`/project/${name.value}`);
          //   }
          // });
        })
        .catch((e: any) => {
          const { data } = e.response.data;
          opendialogerror.value = true;
          dialogerrormsg.value = data;
          //opendialogerror.message=data;
        });
    };

    return {
      dialogareyousureprojectname,
      opendialogareyousure,
      dialogerrormsg,
      opendialogerror,
      $vUserAdmin,
      setprojectname,
      setCurrentProj,
      opendeleteproject,
      name,
      nameErrors,
      vatid,
      desc,
      descErrors,
      purpose,
      env,
      hapusProject,
      updateProject,
      currentProj,
    };
  },

  beforeRouteEnter: async (to, from, next) => {
    const projectname = to.params.project;
    const id = to.params.id;
    const project = await findprojectbyname(id);
    if (project) {
      next((vm: any) => {
        vm.setprojectname(projectname);
        vm.setCurrentProj(project);
      });
    } else {
      next("/notfound");
    }
  },
});
</script>

<style scoped>
.vpc-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.vpc-content {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 140%;
  color: #a5b3bf;
}

.v-btn {
  height: 55px !important;
}
</style>
