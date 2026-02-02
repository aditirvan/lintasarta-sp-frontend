
<template>
  <div>
    <v-container class="mt-6">
      
      <v-row>
        
        <v-col cols="6">
          </v-col>
      <v-col cols="12"
        ><v-data-table
          :headers="headers"
          :items="listRepositories"
          class="elevation-0"
          item-key="no"
          hide-default-footer
          :items-per-page="10"
          :options.sync="options"
          :loading="isLoading"
          :server-items-length="totalRepositories.count"
        >
        <!-- /registry/repositories/:name/:project -->
        
        <template v-slot:item.name="{ item }">
              <router-link append :to="{path:`/registry/${$route.params.project_name}/repositories/${splitRepo(item.name)}`}">{{ item.name }}</router-link>
            </template>
          <template #[`item.update_time`]="{ item }">
            
            <div v-if="item.update_time!='0001-01-01T00:00:00.000Z'">
              {{ formatDate(item.update_time) }}
            </div>
            <div  v-else>
            </div>
          </template>
          <template v-slot:footer="{ props }">
            <custom-footer-datatable
              @input="
                (val) => {
                  options = val;
                  changePage(val);
                }
              "
              :props="props"
            />
          </template>
          
          <template #[`item.action`]="{ item }">
            <div v-if="!disable">
              <span 
                  class="cursor-pointer red--text"
                  @click="DeleteConfirm(item)"
                  > 
                  Delete
                    <!-- <v-icon>mdi-delete</v-icon> -->
                  </span>
            </div>
            <div v-else>
              <span class="grey--text"> 
                  Delete
              </span>
            </div>
          </template>

        </v-data-table> </v-col
    >
    </v-row>
  </v-container>
  
    <deleteDialog
      :close.sync="close"
      :data-delete="dataDelete"
    ></deleteDialog>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { REGISTRY } from "./namespace";
import deleteDialog from "./dialog/delete-dialog.vue";
import moment from "moment";

export default {
  components: {
    deleteDialog
  },
  setup() {
    onMounted(async () => {
      setLoadCard(false);
      // await getListProjects();
      const projectName = nameProject.value.name
        .toLowerCase()
        .replace(" ", "-");
      // const project = listProjects.value.find((element) => {
      //   return element.name === projectName;
      // });
      await getListRepositories(projectName);
      // console.log("listRepositories-------------",listRepositories)
    });
    const { listProjects, isLoading, listRepositories, totalRepositories } = useNamespacedGetters(
      REGISTRY,
      ["listProjects", "isLoading", "listRepositories", "totalRepositories"]
    );

    const { getListRepositories, getListProjects, fetchListRepositories } = useNamespacedActions(REGISTRY, [
      "getListRepositories",
      "getListProjects",
      "fetchListRepositories",
    ]);
    const { setLoadCard } = useNamespacedMutations(REGISTRY, ["setLoadCard"]);
    const headers = ref([
        { text: "Name", value: "name", sortable: false },
        { text: "Artifacts", value: "artifact_count", sortable: false },
        { text: "Pulls", value: "pull_count" , sortable: false},
        { text: "Last Modified Time", value: "update_time", sortable: false },
        { text: "Action", value: "action" },
    ]);
    const nameProject = ref(
      JSON.parse(localStorage.getItem("currentProj") || "{}")
    );
    const options = ref({ page: 1, itemsPerPage: 10, rowsPerPage: 10, search: "", sortBy: [], sortDesc: [], is_created: [] });

    const disable = ref(true)
    const role=localStorage.getItem("role"); 
    // console.log("role====",role)
    if(role=="Owner"||role=='Superadmin'){
      disable.value=false
    }
    const formatDate = (date) => {
      return moment(date).format("l, LT");
    };
    const close = ref(false);
    const dataDelete = ref({});
    const DeleteConfirm = (val) => {
    
      const params = {
        name:val.name,
        title:"Repositories",
      };
      dataDelete.value = params;
      close.value = true;
      // console.log("=================item======================",val)

    }
    const changePage = (val) => {
      // console.log("val==============",val)
      // const params = new URLSearchParams();
      // params.append("page_size", val.itemsPerPage);
      // params.append("page", val.page);
      const params={
        page_size:val.itemsPerPage,
        page:val.page,
        project: nameProject.value.name,
      }
      const payload = {
        project: nameProject.value.name,
        params: params
      }
      // console.log("payload==============",payload)
      fetchListRepositories(payload);
    };
    const splitRepo = (name) => {
      let nameImage = name.split('/')
      return nameImage[1]
    }
    return {
      headers,
      getListProjects,
      nameProject,
      listProjects,
      listRepositories,
      getListRepositories,
      fetchListRepositories,
      isLoading,
      formatDate,
      setLoadCard,
      totalRepositories,
      changePage,
      options,
      DeleteConfirm,
      close,
      dataDelete,
      role,
      disable,
      splitRepo
    };
  },
};
</script>

<style lang="scss" scoped>
</style>