<template>
    <v-container fluid>
      <v-row v-show="!ready"> 
        <v-row>
          <v-col cols="4" offset="4">
            Loading . . . <br/>
            <v-progress-linear
                color="blue darken-4 accent-4"
                indeterminate
                rounded
                height="6"
            ></v-progress-linear>
          </v-col>
        </v-row>
      </v-row>
      <v-row v-show="ready" class="d-flex flex-row">
        <v-col lg="6" md="12" cols="12" class="list-role">
          <v-card flat class="pa-3 rounded-lg">
            <v-card-text>
              <div v-if="mode == 'create'" class="headline font-weight-bold font--text">
                Create Role
              </div>
              <div v-else-if="mode == 'edit'" class="headline font-weight-bold font--text">
                Edit Role
              </div>
              <v-spacer />
            </v-card-text>
            <v-card-text>
              <p class="titletext">
                Role Name<span :class="{ 'error--text': $v.name.$errors.length }"
                  >*</span
                >
              </p>
              <v-text-field
                maxlength="50"
                v-model="name"
                placeholder="Type Role Name"
                outlined
                class="mb-4"
                :disabled="is_default"
                :error-messages="
                  $v.name.$errors.length ? $v.name.$errors[0].$message : ''
                "
              ></v-text-field>
              <p class="titletext">Description<span>*</span>
              </p>
              <v-textarea
                v-model="desc"
                :disabled="is_default"
                placeholder="Type Description Here"
                outlined
                maxlength="255">
              </v-textarea>
              <v-divider class="mt-10"></v-divider>
              <br />
              <p class="headline font-weight-bold font--text">Privileges</p>
              <p v-if="privilegesmin" class="error--text ma-0 pa-0">{{ privilegesmin }}</p>

              <p class="font-weight-bold pt-2">Organization Type</p>
              <v-row>
                <v-checkbox 
                  label="Personal"
                  :value="TypeChecked('Manage Organization', 'personal')" 
                  @change="AddOrRemoveType($event, 'Manage Organization', 'personal')" 
                  class="ma-0 ml-4"
                />
                <v-checkbox 
                  label="Corporate" 
                  :value="TypeChecked('Manage Organization', 'corporate')"
                  @change="AddOrRemoveType($event, 'Manage Organization', 'corporate')" 
                  class="ma-0 ml-8"
                />
              </v-row>
              <p v-if="orgtypemin" class="error--text ma-0 pa-0 pb-2">{{ orgtypemin }}</p>

              <v-row>
                <div class="col-5 top-left-border rounded-tl-lg font-weight-bold">Access</div>
                <div class="col-3 top-center-border font-weight-bold">Permission</div>
                <div class="col-2 top-center-border text-center font-weight-bold">Editor</div>
                <div class="col-2 top-right-border rounded-tr-lg text-center font-weight-bold">Viewer</div>
              </v-row>
              <v-row v-for="(p, i) in privileges" :key="i">
                <div
                  class="col-5 bottom-left-border"
                  :class="{ 'rounded-bl-lg': i + 1 == privileges.length }">
                  <div class="v-input--selection-controls pa-0 ma-0">{{ p.name }}</div>
                </div>
                <div class="col-3 bottom-right-border">
                  <v-switch
                    :disabled="is_default || p.name == 'Manage Organization'"
                    @change="(e) => swatch(e, p)"
                    hide-details=""
                    v-model="p.role"
                    class="pa-0 ma-0">
                  </v-switch>
                </div>
                <div class="col-2 bottom-right-border">
                  <v-radio-group hide-details="" v-model="p.role" class="pa-0 ma-0">
                    <v-radio value="editor" class="justify-center" :disabled="is_default"></v-radio>
                  </v-radio-group>
                </div>
                <div class="col-2 bottom-right-border" :class="{ 'rounded-br-lg': i + 1 == privileges.length }">
                  <v-radio-group hide-details="" v-model="p.role" :disabled="is_default" class="pa-0 ma-0">
                    <v-radio value="viewer" class="justify-center"></v-radio>
                  </v-radio-group>
                </div>
              </v-row>
  
              <div class="d-flex flex-row pt-7">
                <v-btn
                  depressed
                  width="150"
                  height="50"
                  :style="[is_default ? {'width': '100%'} : {}]"
                  class="accent flex-grow-1"
                  @click="$router.go(-1)"
                  >Cancel</v-btn
                >
                <v-spacer />
                <v-btn
                  v-if="!is_default"
                  id="SaveRole"
                  depressed
                  width="150"
                  height="50"
                  class="secondary flex-grow-1"
                  @click="
                    () => {
                      SubmitRole();
                    }
                  "
                  >
                  <template v-if="mode == 'create'">
                    Save Role
                  </template>
                  <template v-else-if="mode == 'edit'">
                    Update Role
                  </template>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col lg="6" md="12" cols="12" class="list-admin">
          <v-card flat class="pa-3 rounded-lg">
            <v-card-text>
              <v-col class="d-flex flex-row">
                <div v-if="mode == 'create'" class="headline font-weight-bold font--text">
                  Add admin
                </div>
                <div v-else-if="mode == 'edit'" class="headline font-weight-bold font--text">
                  List Admin 
                </div>
                <v-spacer />
                <v-btn
                  class="mx-1"
                  fab
                  dark
                  color="primary"
                  open-on-focus
                  v-on:click="dialog = true"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </v-col>
            </v-card-text>
            <v-card-text>
              <v-data-table
                hide-default-footer
                :headers="headers"
                :items="admins.data"
                :options.sync="options"
                item-key="id"
                class="elevation-1"
                style="padding: 10px;"
                >
                <template v-slot:item.action="{ item }">
                  <v-btn 
                  elevation="2" 
                  depressed 
                  class="ma-1 elevation-1" 
                  color="error" 
                  plain
                  :style="[is_default ? {'color': '#a9a9a9 !important'} : {}]" 
                  v-on:click="
                    if(is_default){
                      return
                    }
                    revoke_admin(item)
                  ">
                  remove
                </v-btn>
                </template>
                <template v-slot:footer v-if="admins.data.length && mode != 'create'">
                  <custom-footer-datatable :props="{pagination: admins_paginate, options: options}" mb-5/>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog
        v-model="dialog"
        max-width="700px"
        transition="dialog-bottom-transition">
        <v-card
        style="overflow-x: hidden !important;"
        >
          <v-toolbar
            dark
            fixed
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Assign To Super Admin</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                dark
                text
                :loading="assign_is_loading"
                @click="assign_admin"
              >
                Assign
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-list rounded>
            <v-row>
              <v-col cols="9" offset="1">
                <v-text-field v-model="admin_member_search"></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-btn
                  color="primary"
                  depressed
                  large
                  v-on:click="search_admin"
                >
                  <v-icon dark>
                    mdi-magnify
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-list-item-group
              v-model="selected_superadmin"
              color="primary"
            >
              <v-list-item
                v-for="item in members"
                :key="item.id"
                :value="item.id"
              >
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.fullname"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title v-text="item.email"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-bottom-navigation>
            <v-pagination
              v-model="admin_member_page"
              :length="pagination.totalpage"
              :total-visible="10"
              circle
            ></v-pagination>
          </v-bottom-navigation>
        </v-card>
      </v-dialog>
    </v-container>
  </template>

<script>
import { ref, watch, onMounted } from "@vue/composition-api";
import { GODMODEMANAGEROLES } from "./namespace";
import { GODMODEMANAGEUSER } from "@/modules/manager-superadmin/namespace";
import { useNamespacedActions, useNamespacedState, useNamespacedMutations } from 'vuex-composition-helpers'

import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { list_privileges } from "@/lib/middleware";

export default {
  data () {
      return {
        selected_superadmin: "",
        selected_superadmin_list: [],

        dialog: false,

        headers: [
          {
            text: 'Fullname',
            align: 'start',
            sortable: false,
            value: 'fullname',
          },
          { text: 'Email', value: 'email', sortable: false, align: 'start' },
          { text: 'Action', value: 'action', sortable: false, align: 'end' },
        ]
      }
    },
    setup(props, context) {
        const { getAdminsOfARole, signAdminOfARole, removeAdminOfARole, updateSuperAdminRole, addSuperAdminRole, getSuperAdminRoleDetail } = useNamespacedActions(GODMODEMANAGEROLES, [
          "getAdminsOfARole",
          "signAdminOfARole",
          "removeAdminOfARole",

          "updateSuperAdminRole",
          "addSuperAdminRole",
          "getSuperAdminRoleDetail"
        ]);

        const admin_member_search = ref("");
        const admin_member_page =  ref(1);
        const is_default = ref(false);
        const { admins } = useNamespacedState(GODMODEMANAGEROLES, ["admins"]);
        const { setAdmins } = useNamespacedMutations(GODMODEMANAGEROLES, ["setAdmins"]);

        const { fetchmembers } = useNamespacedActions(GODMODEMANAGEUSER, ["fetchmembers"]);
        const { members, pagination } = useNamespacedState(GODMODEMANAGEUSER, ["members", "pagination"]);

        const admins_paginate = ref({})
        const options  = ref({})

        const ready = ref(false);
        const assign_is_loading = ref(false);
        const privilegesmin = ref("");
        const orgtypemin = ref("");
        const mode = ref("create");
        const name = ref("");
        const desc = ref("");
        const detail = ref({});
        const swatch = (event, p) => {
            if (!event) {
                p.role = null;
            } else {
                p.role = "viewer";
            }
        };
        const privileges = ref(
          list_privileges.map((x) => {
            if (x.name == 'Manage Organization' && !context.root.$route.params.id){
              return {
                  name: x.name,
                  role: 'viewer',
                  types: [],
              }  
            }
            return {
                name: x.name,
                role: null,
            }
          })
        );

        onMounted(async ()  => {
          let role_id = context.root.$route.params.id;
          if (role_id) {
            // get role detail
            detail.value = await getSuperAdminRoleDetail(role_id)
            name.value = detail.value.name;
            desc.value = detail.value.desc;
            mode.value = "edit"
            is_default.value = detail.value.default;

            detail.value.privileges.forEach((element) => {
              privileges.value.forEach((e, i) => {
                if (element.name == e.name) {
                  e.role = element.role;
                  if (element.types) e.types = element.types
                  if (element.name === "Manage Organization") {
                    if (!e.types) {
                      e.types = []
                    }
                  }
                }
              });
            });

            // get admins
            await getAdminsOfARole({id: role_id})
            let paginate = {
              itemsLength: admins.value.paginate.total_data,
              pageCount: admins.value.paginate.total_page,
              itemsPerPage: admins.value.paginate.limit,
              page: admins.value.paginate.page
            }
            admins_paginate.value = paginate
            options.value = paginate
          }else{
            let paginate = {
              itemsLength: 50,
              pageCount: 1,
              itemsPerPage: 50,
              page: 1
            }
            admins_paginate.value = paginate
            setAdmins({data:[],pagination:{}})
          }
          await fetchmembers({limit:5})
          ready.value = true
        })

        const $v = useVuelidate(
          {name: { required }},{name}
        );

        const search_admin = async function(){
          let payload = {};
          if (admin_member_search.value){
            payload.search=admin_member_search.value;
          }
          if (admin_member_page.value){
            payload.page=admin_member_page.value;
          }
          await fetchmembers(payload)
        }

        const assign_admin = async function(){
          let role_id = context.root.$route.params.id;
          assign_is_loading.value = true
          if (role_id) {
            await signAdminOfARole({id:role_id, admin_id:this.selected_superadmin})
            await getAdminsOfARole({id: role_id})
            let paginate = {
              itemsLength: admins.value.paginate.total_data,
              pageCount: admins.value.paginate.total_page,
              itemsPerPage: admins.value.paginate.limit,
              page: admins.value.paginate.page
            }
            admins_paginate.value = paginate
          }else{
            if (this.selected_superadmin_list.includes(this.selected_superadmin)){
              this.$store.dispatch(
                "HOMEPAGE/showErrorToast",
                "This admin is already exist in list",
                { root: true }
              );
              assign_is_loading.value = false
              this.dialog = false;
              return
            }

            this.selected_superadmin_list.push(this.selected_superadmin)
            for (let index = 0; index < members.value.length; index++) {
              const element = members.value[index];
              if (element.id == this.selected_superadmin){
                setAdmins({data:[...admins.value.data, element],pagination:{}})
                break
              } 
            }
          }
          assign_is_loading.value = false
          this.dialog = false;
        }

        const revoke_admin = async function(item, _){
          let role_id = context.root.$route.params.id;
          if (role_id) {
            await removeAdminOfARole({id:role_id, admin_id:item.id})
            await getAdminsOfARole({id: role_id})
          }else{
            let tempAdmin = admins.value.data;
            this.selected_superadmin_list = this.selected_superadmin_list.filter(id => id !== item.id);
            tempAdmin = tempAdmin.filter(e => e.id !== item.id);
            setAdmins({data:tempAdmin,pagination:{}})
          }
        }

        const SubmitRole = async function() {
          let payload = {name: name.value, desc: desc.value, privileges: []};
          $v.value.$touch();
          if ($v.value.$errors.length) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return
          };

          privileges.value.forEach((item)=>{
            if (item.role != null){
              payload.privileges.push({...item})
            }
          })

          
          const orgPrivilegeIndex = payload.privileges.findIndex((x => x.name === "Manage Organization"))
          if(payload.privileges[orgPrivilegeIndex].types && payload.privileges[orgPrivilegeIndex].types.length <= 0){
            orgtypemin.value = "Please select at least one organization type";
            window.scrollTo({ top: 0, behavior: "smooth" });
            return
          }

          if(payload.privileges.length <= 1){
            privilegesmin.value = "please select at least one exept Manage Organization";
            window.scrollTo({ top: 0, behavior: "smooth" });
            return
          }

          ready.value = false
          if (mode.value == "edit"){
            let edited = false
            if (name.value == detail.value.name){
              delete payload.name
              edited = true
            }
            if (desc.value == detail.value.desc){
              delete payload.desc
              edited = true
            }
            if (payload.privileges == detail.value.privilages){
              delete payload.privileges
              edited = true
            }

            if (!edited){
              alert("your data is not edited")
            }
            payload.id = this.$route.params.id;
            await updateSuperAdminRole(payload)
          }else{
            payload.admins_id = this.selected_superadmin_list;
            let res = await addSuperAdminRole(payload)
            if(res.status == 200){
              this.$router.push('/manage-superadmin-roles')
              return
            }
          }
          ready.value = true
        }

        const AddOrRemoveType = (e, privilegeName, key) => {
          const i = privileges.value.findIndex((x => x.name === privilegeName))
          if (e) {
            orgtypemin.value = ""
            privileges.value[i].types.push(key)
          } else {
            privileges.value[i].types = privileges.value[i].types.filter(x => x !== key)
          }
        }

        const TypeChecked = (privilegeName, type) => {
          const i = privileges.value.findIndex((x => x.name === privilegeName))
          if (privileges.value[i].types) {
            return privileges.value[i].types.includes(type)
          }

          return false
        }

        watch(
          privileges,
          (val) => {
            privilegesmin.value = "";
          },
          { deep: true }
        );

        watch(
          admin_member_page, async (val) => {
            console.log(val)
            await search_admin();
          }
        );

        watch(() => options, async (newValue, oldValue) => {
            let params = {
              limit:newValue.value.itemsPerPage,
              page: newValue.value.page
            }
            if(context.root.$route.params.id){
              await getAdminsOfARole({id: context.root.$route.params.id, params: params})
              let paginate = {
                itemsLength: admins.value.paginate.total_data,
                pageCount: admins.value.paginate.total_page,
                itemsPerPage: admins.value.paginate.limit,
                page: admins.value.paginate.page
              }
              admins_paginate.value = paginate
            }
          },
          { deep: true }
        )

        return {
            $v,
            is_default,
            ready,
            name,
            desc,
            swatch,
            mode,
            privileges,
            privilegesmin,
            orgtypemin,
            SubmitRole,
            admins,
            members,
            pagination,
            assign_is_loading,

            admin_member_search,
            admin_member_page,
            admins_paginate, 
            options,

            search_admin,
            assign_admin,
            revoke_admin,
            AddOrRemoveType,
            TypeChecked,
        }
    }
}
</script>

<style scoped>

@media (max-width: 1250px) {
  .list-admin {
    order: 1;
  }
  .list-role{
    order: 2;
  }
}

.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
    border: none;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row), .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row){
  border-bottom: none;
}
/* .theme--light.v-table tbody tr:not(:last-child) {
    border-bottom: none;
} */

</style>