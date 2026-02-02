<template>
    <div>
      <v-card class="rounded-lg" flat>
        <v-container class="px-7 py-4">
          <div v-if="loadingPage" class="d-flex justify-center">
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>

          <div v-else>
            <div v-if="registrylist.length">
              <v-row>
                <v-col cols="9">
                  <div class="firewall-title mt-2">Registry</div>
                </v-col>
                <!-- <v-col class="d-flex justify-end mr-4">
                  <v-btn
                    :disabled="disable"
                    depressed
                    width="150"
                    height="50"
                    class="secondary"
                    to="/registry/create-repository"
                    >
                    Create Registry
                  </v-btn>
                </v-col> -->
              </v-row>
              
              <v-card
              flat
              class="d-flex rounded-lg flex-grow-1 flex-column ma-auto">
                <v-row>
                  <v-col md="8">
                    <v-text-field
                    outlined
                    append-icon="mdi-magnify"
                    label="Search"
                    v-model="searchQuery"
                    @click="
                      {
                        
                      }"></v-text-field>
                  </v-col>
                  <v-col md="2"> </v-col>
                  <v-col md="2" class="add-btn">
                    <v-btn
                    :disabled="disable"
                    depressed
                    color="primary"
                    width="150"
                    height="50"
                    class="fz16"
                    to="/registry/create-repository"
                    >
                      <!-- <v-icon left dark> mdi-plus </v-icon> -->
                      Create Registry
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
              <br />
              
              <div>
                <v-row v-if="registrylist.length > 0">
                  <v-col
                  v-if="filterItems(registrylist) == false"
                  class="text-center mt-6 text-h5 mb-4">
                    <strong>No Matching Registry Found</strong>
                  </v-col>
                  <v-col
                    else
                    cols="3"
                    v-for="(row, index) in filterItems(registrylist)"
                    :key="index"
                  >
                    <v-card
                    elevation="2"
                    class="mx-auto"
                    max-width="300"
                    @click="goto(row.ID, row.Project_name)"
                    >
                      <v-list-item three-line>
                        <v-list-item-content :title="row.Project_name">
                          <v-list-item-title
                          class="text-sm-h5 mb-1 d-flex justify-center">
                            {{ row.Project_name }}
                          </v-list-item-title>
                          <v-list-item-title
                          class="text-sm-h6 d-flex justify-center mr-6 my-1"
                          v-if="row.summary.metadata.public == 'true'">
                            <v-icon color="" right class="mr-2">mdi-earth</v-icon>
                            Public
                          </v-list-item-title>
                          <v-list-item-title
                          class="text-sm-h6 d-flex justify-center mr-6 my-1"
                          v-else>
                            <v-icon color="" right class="mr-2">mdi-lock-outline</v-icon>
                            Private
                          </v-list-item-title>
                          <!-- <v-list-item-title
                          class="text-sm-h6 d-flex justify-center mr-6">
                            <span>Storage used </span>
                          </v-list-item-title> -->
                          <v-list-item-title
                          class="d-flex justify-center ml-4 mt-1">
                            <!-- <span class="float-right">
                              {{ $formatSize(row.summary.quota.used.storage) }} of {{ $formatSize(row.summary.quota.hard.storage) }}
                            </span> -->
                            <!-- <div> -->
                              <v-progress-linear
                              :value="(Math.ceil((row.summary.quota.used.storage/row.summary.quota.hard.storage)*100))"
                              color="light-green"
                              height="25"
                              stream
                              >
                              <strong>{{ $formatSize(row.summary.quota.used.storage) }} of {{ $formatSize(row.summary.quota.hard.storage) }}</strong>
                              </v-progress-linear>
                            <!-- </div> -->
                          </v-list-item-title>
                        </v-list-item-content>
                        <div class="btn-menu" v-if="role=='Superadmin'|| role=='Owner'">
                          <v-menu bottom right>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn dark icon v-bind="attrs" v-on="on">
                                <v-icon color="black">mdi-dots-vertical</v-icon>
                              </v-btn>
                            </template>

                            <v-list>
                              <!-- <v-list-item>
                                <v-list-item-title @click="onUpdate(row)" class="cursor-pointer"> Update <v-icon color="yellow" dark class="ml-2">mdi-pencil</v-icon></v-list-item-title>
                              </v-list-item> -->
                              <v-list-item>
                                <v-list-item-title
                                @click="() => {
                                  currentStorage = row
                                  openDialogResize = true
                                }"
                                class="cursor-pointer">
                                <v-icon color="grey" dark class="mr-2">mdi-cog</v-icon>
                                  Resize storage
                                </v-list-item-title>
                              </v-list-item>
                              <v-list-item>
                                <v-list-item-title
                                @click="DeleteConfirm(row.ID,row.Project_name)"
                                class="cursor-pointer red--text">
                                <v-icon color="red" dark class="mr-2">mdi-delete</v-icon>
                                  Delete
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </div>
                      </v-list-item>
                    </v-card>
                  </v-col>
                </v-row>
              </div>


              <!-- <v-row>
                <v-col cols="12">
                  <v-data-table
                  :headers="headers"
                  :items="registrylist"
                  class="elevation-0"
                  item-key="no"
                  hide-default-footer
                  :items-per-page="10"
                  :options.sync="options"
                  :loading="isLoading"
                  >
                  <template #[`item.Project_name`]="{ item }">
                      <v-btn text color="primary" @click="goto(item.ID,item.Project_name)">{{ item.Project_name }} </v-btn>
                  </template>
                  <template #[`item.CreatedAt`]="{ item }">
                    <div v-if="item.pull_time!='0001-01-01T00:00:00.000Z'">
                    {{ formatDate(item.CreatedAt) }}
                    </div>
                  </template>
                  <template #[`item.action`]="{ item }">
                      <v-btn text color="red" @click="DeleteConfirm(item.ID,item.Project_name)"  v-if="role=='Superadmin'|| role=='Owner'">Delete</v-btn>
                  </template>
                    <template v-slot:footer="{ props }">
                      <custom-footer-datatable
                        @input="
                            (val) => {
                            options = val;
                            }
                        "
                        :props="props"
                      />
                    </template>
                  </v-data-table>
                </v-col>
              </v-row> -->
            </div>

            <v-card v-else flat outlined class="rounded-lg">
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
                    <v-row v-if="(role=='Owner' || role=='Superadmin') && listUsers!=null && quotastatus!=204 && !disable">
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
                    <v-row v-else-if="(role!='Owner' || role!='Superadmin') && (status == 204 ||status == 403) && listUsers!=null && quotastatus!=204 && quotalimits.limits>0">
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
          </div>
          
        </v-container>
      </v-card>
      <dialogResize
      v-if="openDialogResize"
      v-model="openDialogResize"
      :storageVal="currentStorage"
      @refreshList="refreshTable"
      />
      <dialogDelete 
        v-if="deleteRegistry" v-model="deleteRegistry"
        :head="'front'"
        @refreshTable="refreshTable"
        >
      </dialogDelete>
    <alert v-if="closed" v-model="closed"></alert>
    </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import dialogDelete from "./dialog/dialog-delete-registry.vue";
import dialogResize from './dialog/resize-storage.vue'
import alert from "./dialog/alert.vue";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { REGISTRY } from "./namespace";
import moment from "moment";
export default {

  components: {
    dialogDelete, 
    alert,
    dialogResize
  },
  setup(props, context) {
    onMounted(async () => {
      loadingPage.value = true
      const nameProject = ref(
        JSON.parse(localStorage.getItem("currentProj") || "{}")
      );
      const userId = JSON.parse(localStorage.getItem("userId"));
      const registryid = JSON.parse(localStorage.getItem("registry"));
      localStorage.setItem('registry', JSON.stringify({"organization_id":nameProject.value.organization_id,"user_id":userId,"project_id":nameProject.value.id,"project_name": nameProject.value.name.toLowerCase().replace(/ /g, "-")}));    
      await getlistUsers();
      // isLoading(false);
      await getListRegistry();
      // console.log("listRegistry===>",listRegistry)
      registrylist.value=listRegistry.value;
      lenghtRegistry.value=listRegistry.value.length;
      // console.log("lenghtRegistry===>",lenghtRegistry)
      await getquotalimits();
      if(quotalimits.value?.limits_registry>lenghtRegistry.value){
        disable.value=false
      } 
      else{
        disable.value=true
      }
      loadingPage.value = false
    });
    const { isLoading,listRegistry,quotalimits,totalRepositories,listUsers,quotastatus,status } =
      useNamespacedGetters(REGISTRY, [
        "isLoading",
        "listRegistry",
        "quotalimits",
        "totalRepositories",
        "listUsers",
        "quotastatus",
        "quotalimits",
        "status"
      ]);

    const {getListRegistry,getquotalimits,getListRepositories,getlistUsers} = useNamespacedActions(
      REGISTRY,
      ["getListRegistry","getquotalimits","getListRepositories","getlistUsers","getquotalimits"]
    );
    const refreshTable = async() => {
      loadingPage.value = true
      await getlistUsers();
      await getListRegistry()
      registrylist.value=listRegistry.value;
      lenghtRegistry.value=listRegistry.value.length;
      // console.log("lenghtRegistry===>",lenghtRegistry)
      await getquotalimits();
      if(quotalimits.value?.limits_registry>lenghtRegistry.value){
        disable.value=false
      } 
      else{
        disable.value=true
      }
      loadingPage.value = false
    }
    const loadingPage = ref(false)
    const closed = ref(false);
    const is_creator=ref(JSON.parse(localStorage.getItem("is_creator")|| "{}")) 
    const role=localStorage.getItem("role"); 
    const registrylist=ref([]);
    const lenghtRegistry=ref();
    const deleteRegistry = ref(false);
    const options = ref({ page: 1, itemsPerPage: 10, rowsPerPage: 10, search: "", sortBy: [], sortDesc: [], is_created: [] });
    const headers = ref([
      // { text: "No", value: "no" },
      { text: "Registry Name", value: "Project_name" },
      { text: "Created date", value: "CreatedAt" },
      { text: "Action", value: "action" },
    ]);
    const disable = ref(true)
    const openDialogResize = ref(false)
    const currentStorage = ref()
    const goto = (id,Project_name) => {
      // console.log("id repo===>",id)
      
      const nameProject = ref(
        JSON.parse(localStorage.getItem("currentProj") || "{}")
      );
      const userId = JSON.parse(localStorage.getItem("userId"));
      const registryid = JSON.parse(localStorage.getItem("registry"));
      localStorage.setItem('registry', JSON.stringify({"registry_id":id,"registry_name":Project_name,"organization_id":nameProject.value.organization_id,"user_id":userId,"project_id":nameProject.value.id,"project_name": nameProject.value.name.toLowerCase().replace(/ /g, "-")}));    
      context.root.$router.push(`/registry/${Project_name}`);
    };
    const formatDate = (date) => {
      return moment(date).format("l, LT");
    };
    const DeleteConfirm = async(id,Project_name) => {
      const nameProject = ref(
        JSON.parse(localStorage.getItem("currentProj") || "{}")
      );
      const userId = JSON.parse(localStorage.getItem("userId"));
      const registryid = JSON.parse(localStorage.getItem("registry"));
      localStorage.setItem('registry', JSON.stringify({"registry_id":id,"registry_name":Project_name,"organization_id":nameProject.value.organization_id,"user_id":userId,"project_id":nameProject.value.id,"project_name": nameProject.value.name.toLowerCase().replace(/ /g, "-")}));    
      await getListRepositories()
      if(totalRepositories.value.count==0){
        deleteRegistry.value = true;
      }else{
        closed.value = true;
      }
    }
    const searchQuery = ref("")
    function filterItems(listData){
      return listData.filter((list) => {
        let regex = new RegExp("(" + searchQuery.value + ")", "i");
        if (list.Project_name.match(regex) == null) {
          return false;
        } else {
          return list?.Project_name.match(regex);
        }
      });
    }
    return {
      headers,
      listRegistry,
      isLoading,
      options,
      disable,
      getListRegistry,
      formatDate,
      registrylist,
      lenghtRegistry,
      goto,
      DeleteConfirm,
      deleteRegistry,
      getListRepositories,
      role,
      is_creator,
      totalRepositories,
      listUsers,
      quotastatus,
      quotalimits,
      status,
      refreshTable,
      closed,
      filterItems,
      searchQuery,
      loadingPage,
      openDialogResize,
      currentStorage
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-menu {
  margin-bottom: 60px;
  margin-right: -12px;
}
</style>