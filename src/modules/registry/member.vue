<template>
  <div>
    <v-container class="mt-6">
      <v-row
        ><v-col class="d-flex justify-end mr-4"
          ><v-btn
            :disabled="disable || disabled"
            depressed
            width="150"
            height="50"
            class="secondary"
            @click="
              () => {
                closed = true;
              }
            "
            >Add User</v-btn
          ></v-col
        ></v-row
      >
      <v-col cols="12"
        ><v-data-table
          :headers="headers"
          :items="listusers"
          class="elevation-0"
          item-key="no"
          hide-default-footer
          :items-per-page="10"
          :options.sync="options"
          :loading="isLoading"
          :server-items-length="listusers.length"
        >
          <template #[`item.entity_type`]="{ item }">
            <div>{{ item.entity_type == "u" ? "User" : "-" }} </div>
          </template>
          <template #[`item.action`]="{ item }">
            <div v-if="item.entity_name!='admin'">
              More
              <v-menu right down>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-menu-down</v-icon>
                </template>

                <v-list>
                  <v-subheader style="padding-left: 5px;" class="font-weight-bold">Set Role</v-subheader>
                  <v-list-item v-for="row in listRole" :key="row.id"
                        :disabled="disable">
                    <v-list-item-title
                      @click="
                        () => {
                          onUpdate(item, row.id);
                        }
                      "
                      class="cursor-pointer"
                    >
                      {{ row.text }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item  v-if=" username==item.entity_name && role!='Superadmin'">
                    <v-list-item-title
                      @click="
                      () => {
                          packageselected=item
                          ShowPass=true
                      }"
                      class="cursor-pointer"
                    >
                      Show Password
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item  v-if=" username==item.entity_name ">
                    <v-list-item-title
                      @click="
                      () => {
                          packageselected=item
                          openDialogAdd=true
                      }"
                      class="cursor-pointer"
                    >
                      Change Password
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item  v-if="role=='Superadmin'">
                    <v-list-item-title
                      @click="
                      () => {
                          packageselected=item
                          ShowPass=true
                      }"
                      class="cursor-pointer"
                    >
                      Show Password
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="!item.IsCreator && role=='Superadmin' || role=='Owner'"
                        :disabled="disable">
                    <v-list-item-title
                      @click="onDelete(item)"                                                                                                                                                                                                               
                      class="cursor-pointer"
                    >
                      Delete
                      <v-icon color="red" dark class="ml-2"
                        >mdi-delete</v-icon
                      ></v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item  v-if="!item.IsCreator && role!='Superadmin' && role!='Owner' && username==item.entity_name"
                        :disabled="disable">
                    <v-list-item-title
                      @click="onDelete(item)"
                      class="cursor-pointer"
                    >
                      Delete
                      <v-icon color="red" dark class="ml-2"
                        >mdi-delete</v-icon
                      ></v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
          <template v-slot:footer="{ props }">
            <custom-footer-datatable
              @input="
                (val) => {
                  options = val;
                  // changePage(val);
                }
              "
              :props="props"
            />
          </template>
        </v-data-table> </v-col
    ></v-container>
    <createUser v-if="closed" v-model="closed"></createUser>
    <confirmPass 
    v-if="ShowPass" v-model="ShowPass" :item="packageselected" @clearItem="packageselected = $event">
  </confirmPass>
  <changePassword 
    v-if="openDialogAdd" v-model="openDialogAdd" :item="packageselected" @clearItem="packageselected = $event">
  </changePassword>
  </div>
</template>

<script>
import createUser from "./dialog/create-user.vue";
import confirmPass from "./dialog/dialog-confirm-pass.vue";
import changePassword from "./dialog/dialog-confirm-change-pass.vue";
import { ref, onMounted,watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { REGISTRY } from "./namespace";
import { async } from "@firebase/util";
export default {
  components: {
    createUser,
    confirmPass,
    changePassword,
  },
  setup() {
    onMounted(async () => {
      setLoadCard(false);
      await getMembers(projectName.value);
    });
    const { listProjects, isLoading, listMembers, totalMembers,Status,listusersOrg,listmembersOrg } =
      useNamespacedGetters(REGISTRY, [
        "listProjects",
        "isLoading",
        "listMembers",
        "totalMembers",
        "Status",
        "listusersOrg",
        "listmembersOrg",
      ]);

    const { getMembers, getListProjects, fetchMembers,updateMembers,deleteMembers } = useNamespacedActions(
      REGISTRY,
      ["getMembers", "getListProjects", "fetchMembers","updateMembers","deleteMembers"]
    );
    const { setLoadCard } = useNamespacedMutations(REGISTRY, ["setLoadCard"]);
    const nameProject = ref(
      JSON.parse(localStorage.getItem("currentProj") || "{}")
    );
    const projectName = ref(
      nameProject.value.name.toLowerCase().replace(" ", "-")
    );
    const disable = ref(true)
    const role=localStorage.getItem("role"); 
    if(role=="Owner"||role=='Superadmin'){
      disable.value=false
    }
    const username=localStorage.getItem('username');
    const closed = ref(false);
    const closeDialog = ref(false);
    const openDialogAdd = ref(false)
    const ShowPass = ref(false)
    const disabled = ref(false)
    const packageselected = ref({})
    const dataConfirm = ref({})
    const listusers=ref([{}]);
    const options = ref({ page: 1, itemsPerPage: 10, rowsPerPage: 10, search: "", sortBy: [], sortDesc: [], is_created: [] });
    const headers = ref([
      // { text: "No", value: "no" },
      { text: "Name", value: "entity_name" },
      { text: "Member Type", value: "entity_type" },
      { text: "Role", value: "role_name" },
      { text: "Action", value: "action" },
    ]);
    const listRole = ref([
      { id: 1, text: "Project Admin", value: "project_admin" },
      { id: 2, text: "Developer", value: "developer" },
      { id: 3, text: "Guest", value: "guest" },
      { id: 4, text: "Maintainer", value: "maintainer" },
    ]);
    const onUpdate = async(item, id) => {
      // console.log("update id", id);
      // console.log("update data", item.id);
      const payload = {
        member_id:item.id,
        body: {
          role_id:id
        },
      };
      await updateMembers(payload);
    }
    
    watch(listusersOrg, async(val) => {
      // console.log(listusersOrg)
      // console.log("onUpdate listusersOrg leng",val.length)
      // console.log("onUpdate listusersOrg",val)
      // console.log("onUpdate listmembersOrg",listmembersOrg)
      listusers.value=[]
      var j=""
      var k=0
      var l=0
      for(var i=0;i<val.length;i++){
        listmembersOrg.value.forEach(function (value, index) {
          if(val[i].Email==value.entity_name){
            j=index
            l++
          }
        })
        if(l>0){
          if(k==0){
          listusers.value[k]=listmembersOrg.value[j]
          listusers.value[k].IsCreator=val[i].IsCreator
          listusers.value[k].UserID=val[i].UserID
            
          } 
          else{
            listusers.value.push(listmembersOrg.value[j]);
            listusers.value[k].IsCreator=val[i].IsCreator
            listusers.value[k].UserID=val[i].UserID
          }
          k++
          l=0;
        }
        else{
          j="";
        }
      }
      if(!listusers.value[0]){
        listusers.value=[]
      }
      if(val.length==listusers.value.length){
        disabled.value=true
      }else{
        disabled.value=false
      }
      // console.log("listusers",listusers)
    })
    const onDelete = (item) => {
      // console.log("delete id", item);
      deleteMembers(item);
    };
    
    const ChangePass=(item)=>{
      // console.log("ChangePass", item);
      dataConfirm.value = item;
      // console.log("dataConfirm", dataConfirm);
      close.value = true;      
    }
    return {
      ChangePass,
      headers,
      closed,
      closeDialog,
      username,
      listMembers,
      getListProjects,
      getMembers,
      totalMembers,
      isLoading,
      Status,
      setLoadCard,
      nameProject,
      projectName,
      role,
      disable,
      options,
      fetchMembers,
      updateMembers,
      deleteMembers,
      listRole,
      onUpdate,
      onDelete,
      packageselected,
      openDialogAdd,
      dataConfirm,
      ShowPass,
      listusersOrg,
      listmembersOrg,
      listusers,
      disabled,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
