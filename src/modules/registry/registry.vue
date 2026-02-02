<template>
  <div>
    <!-- <v-col cols="12"> -->
      <v-card class="rounded-lg" flat>
        <!-- <v-container fluid class="px-7 py-4" v-if="loadCard">
          <v-card flat outlined class="rounded-lg">
            <v-col md="12">
              <v-card
                flat
                class="
                  d-flex
                  rounded-lg
                  flex-grow-1 flex-column
                  text-center
                  ma-auto
                "
              >
                <v-card-text>
                  <p
                    style="font-size: 16px; text-transform: capitalize"
                    class="font-weight-bold"
                  >
                    Accelerate and protect your site with Cloudeka
                  </p>
                  <v-row v-if="(is_creator || role=='Superadmin') && listUsers!=null && quotastatus!=204 && quotalimits.limits>0">
                    <v-col>
                      <v-btn
                        width="100%"
                        append
                        max-width="300"
                        height="50"
                        depressed
                        class="fz-16"
                        color="secondary"
                        exact
                        to="/registry/create-repository"
                        style="font-size: 16px"
                      >
                        Create Repository
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row v-else-if="(!is_creator || role!='Superadmin') && (status == 204 ||status == 403) && listUsers!=null && quotastatus!=204 && quotalimits.limits>0">
                    <v-card-text>
                    Your role is not allowed to access this feature, please contact your administrator for further information</v-card-text>
                  </v-row>
                  <v-row v-else-if="quotastatus==204 || quotalimits.limits==0">
                    <v-card-text>
                      Registry quota is empty. Custom your quota, then you can create deka registry for your project</v-card-text>
                  </v-row>
                  <v-row v-else-if="listUsers==null && quotastatus!=204">
                    <v-card-text>
                      Sorry, your organization doesn't have a user</v-card-text>
                  </v-row>
                  <v-row v-else>
                    <v-card-text>
                    sorry, only project owner can create registry</v-card-text>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-card>
        </v-container> -->

        <v-container fluid class="px-7 py-4">
          <v-row>
            <v-col cols="6">
              <div class="firewall-title">{{registryid.registry_name}}</div>
            </v-col>
            <v-row class="justify-end mr-3">
              <v-col cols="4">
                <div class="firewall-title ">
                  <v-btn
                    width="100%"
                    append
                    max-width="300"
                    height="50"
                    depressed
                    class="fz-16"
                    color="secondary"
                    exact
                    :to="`/registry/${$route.params.project_name}/overview`"
                  >
                    Overview
                  </v-btn>
                </div>
              </v-col>
              <!-- <v-col cols="3" v-if="role=='Superadmin'|| is_creator">
                <div class="d-flex justify-space-around align-center flex-column flex-sm-row">
                  <v-btn
                    height="50"
                    variant="outlined"
                    color="error"
                    @click="DeleteConfirm()"
                  > 
                    Delete Registry
                  </v-btn>
                </div>
              </v-col> -->
            </v-row>
          </v-row>
          <v-card class="rounded-lg mt-4 mb-4" flat outlined>
            <template>
              <v-tabs class="mb-6">
                <v-tab class="fz-14 firewall-title" :to="`/registry/${$route.params.project_name}/summary`"
                  >Summary</v-tab
                >
                <v-tab class="fz-14 firewall-title" :to="`/registry/${$route.params.project_name}/repositories`"
                  >Repositories</v-tab
                >
                <v-tab class="fz-14 firewall-title" :to="`/registry/${$route.params.project_name}/logs`"
                  >Logs</v-tab
                >
                <v-tab class="fz-14 firewall-title" :to="`/registry/${$route.params.project_name}/labels`"
                  >Labels</v-tab
                >
                <v-tab
                  class="fz-14 firewall-title"
                  :to="`/registry/${$route.params.project_name}/tag-immutability`"
                  >Tag Immutability</v-tab
                >
                <v-tab class="fz-14 firewall-title" :to="`/registry/${$route.params.project_name}/member`"
                  >Member</v-tab
                >
              </v-tabs>
            </template>

            <v-tabs-items v-model="$route.path" class="mb-6">
              <v-tab-item :value="`/registry/${$route.params.project_name}/summary`">
                <v-card flat>
                  <router-view></router-view>
                  <!-- <Summary></Summary> -->
                </v-card>
              </v-tab-item>
              <v-tab-item :value="`/registry/${$route.params.project_name}/repositories`">
                <v-card flat>
                  <router-view></router-view>
                  <!-- <Repositories></Repositories> -->
                </v-card>
              </v-tab-item>
              <v-tab-item :value="`/registry/${$route.params.project_name}/logs`">
                <v-card flat>
                  <router-view></router-view>
                  <!-- <Logs></Logs> -->
                </v-card>
              </v-tab-item>
              <v-tab-item :value="`/registry/${$route.params.project_name}/labels`">
                <v-card flat>
                  <router-view></router-view>
                  <!-- <Labels></Labels> -->
                </v-card>
              </v-tab-item>
              <v-tab-item :value="`/registry/${$route.params.project_name}/tag-immutability`">
                <v-card flat>
                  <router-view></router-view>
                  <!-- <tagImmutability></tagImmutability> -->
                </v-card>
              </v-tab-item>
              <v-tab-item :value="`/registry/${$route.params.project_name}/member`">
                <v-card flat>
                  <router-view></router-view>
                  <!-- <Member></Member> -->
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-container>
      </v-card>
    <!-- </v-col> -->
    
  <dialogDelete 
    v-if="deleteRegistry" v-model="deleteRegistry"
    :head="'detail'"
    >
  </dialogDelete>
  <alert v-if="closed" v-model="closed"></alert>
  </div>
</template>

<script>
import { ref, onMounted,onBeforeMount,watch } from "@vue/composition-api";
import dialogDelete from "./dialog/dialog-delete-registry.vue";
import alert from "./dialog/alert.vue";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import Summary from "./summary.vue";
import Logs from "./logs.vue";
import Repositories from "./repositories.vue";
import tagImmutability from "./tag-immutability.vue";
import Member from "./member.vue";
import Labels from "./labels.vue";
import { REGISTRY } from "./namespace";

export default {
  components: {
    // Summary,
    // Logs,
    // Repositories,
    // tagImmutability,
    // Member,
    // Labels,    
    dialogDelete, 
    alert,
  },
  setup(props, context) {
    const { getListRepositories, getListProjects,getlistUsers,getquotalimits } = useNamespacedActions(
      REGISTRY,
      ["getListRepositories", "getListProjects","getSummary","getlistUsers","getquotalimits"]
    );
    const { listRepositories, listProjects, isLoading, loadCard,status,listUsers,quotastatus,quotalimits,totalRepositories } =
      useNamespacedGetters(REGISTRY, [
        "listRepositories",
        "listProjects",
        "isLoading",
        "loadCard",
        "status",
        "listUsers",
        "quotastatus",
        "quotalimits",
        "totalRepositories",
      ]);
    const { setLoadCard } = useNamespacedMutations(REGISTRY, ["setLoadCard"]);
    onMounted(async () => {
      // setLoadCard(false);
      // await getlistUsers();
      // await getquotalimits();
      // console.log("========status project====",context.root.$route.params.project)
      // console.log("========setquotalimits====",quotalimits.value.limits)
      // console.log("========quota status====",quotastatus.value)
      // tab.value="/registry/detail/summary";
    });
    const deleteRegistry = ref(false);
    const closed = ref(false);
    const role=localStorage.getItem("role"); 
    const is_creator=ref(JSON.parse(localStorage.getItem("is_creator")|| "{}")) 
      // console.log("========is_creator====",is_creator)
    const tab = ref(null);
    const nameProject = ref(
      JSON.parse(localStorage.getItem("currentProj") || "{}")
    );
    const userId = JSON.parse(localStorage.getItem("userId"));
    const registryid =  ref(JSON.parse(localStorage.getItem("registry")|| "{}"));
    // localStorage.setItem('registry', JSON.stringify({"registry_id":registryid.registry_id,"organization_id":nameProject.value.organization_id,"user_id":userId,"project_id":nameProject.value.id,"project_name": nameProject.value.name.toLowerCase().replace(/ /g, "-")}));    
    const DeleteConfirm= async()=>{
      await getListRepositories()
      if(totalRepositories.value.count==0){
        deleteRegistry.value = true;
      }else{
        closed.value = true;
      }
    }
    
    watch(
      tab,
      (val) => {
        // console.log(val);
      }
    );
    return {
      getListRepositories,
      getListProjects,
      getlistUsers,
      getquotalimits,
      quotalimits,
      listProjects,
      listRepositories,
      listUsers,
      quotastatus,
      isLoading,
      tab,
      nameProject,
      registryid,
      loadCard,
      setLoadCard,
      status,
      role,
      is_creator,
      DeleteConfirm,
      deleteRegistry,
      closed,
      totalRepositories,
    };
  },
};
</script>

<style lang="scss" scoped>
.fz-16 {
  font-size: 65% 
}
.fz-14 {
  font-size: 14px;
}
::v-deep
  .v-item-group.theme--light.v-slide-group.v-tabs-bar.v-tabs-bar--is-mobile.primary--text {
  display: grid;
}
::v-deep .v-slide-group__wrapper {
  height: 71px;
}
</style>