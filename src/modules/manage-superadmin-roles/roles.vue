<template>
  <div>
    <v-card flat class="rounded-lg pa-4 mt-3">
      <v-card-text class="d-flex flex-row align-center">
        <v-row>
            <v-col class="d-flex flex-row align-center">
              <p class="mb-0 font-weight-bold fz-21">Manage Admin Roles</p>
              <v-spacer />
              <v-text-field
                maxlength="50"
                hide-details
                outlined
                style="max-width: 200px"
                placeholder="Search"
                v-model="search"
                class="pr-5"
                v-on:keyup.enter="doSearch">
              </v-text-field>
              <v-btn
                id="CreateNewUser"
                depressed
                height="50"
                width="150"
                @click="toCreate"
                class="secondary">
              <span class="fz-14">Create New Role</span>
              </v-btn>
            </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-data-table
          id="my-table"
          hide-default-footer
          :headers="headers"
          hide-default-header
          :items-per-page="10"
          :items="roles"
          :server-items-length="pagination.count">
          <template v-slot:header="{ props, on }">
            <v-data-table-header
              v-on="on"
              v-bind="props"
              sort-icon="mdi-menu-down"
            >
            </v-data-table-header>
          </template>
          <template v-slot:item.name="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:item.type="{ item }">
            <span v-if="item.default">Default</span>
            <span v-else>Custom</span>
          </template>
          <template v-slot:item.usages="{ item }">
            {{ item.usages }}
          </template>
          <template v-slot:item.desc="{ item }">
            {{ item.desc }}
          </template>
          <template v-slot:item.created_at="{ item }">
            {{ $moment(new Date(item.created_at)).format("DD/MM/YYYY") }}
          </template>
          <template v-slot:item.action="{ item }">
            <popupquote
              v-model="item.open"
              :offsetTop="20"
              :documentid="'popup' + item.id"
              offset-y
              allow-overflow>
              <template v-slot:activator="{ on, attrs }">
                <label
                  v-bind="attrs"
                  class="primary--text linkpointer"
                  style="position: relative; white-space: nowrap"
                  @click="($event) => {
                    on.click($event)
                    itemSelectedvalue = item
                  }">More
                  <v-icon
                    :class="{
                      rotate: item.open,
                    }"
                    :id="'popup' + item.id"
                    color="primary"
                    >mdi-chevron-down</v-icon
                  >
                </label>
              </template>
              <v-list>
                <v-list-item @click="() => {toDetail(item)}">
                  <v-list-item-title>Detail</v-list-item-title>
                </v-list-item>
                <v-list-item style="min-height: 1px; margin-left: -16px; margin-right: -16px" v-if="!item.default">
                  <v-divider style="min-width: 160px" />
                </v-list-item>
                <v-list-item @click="() => {dialog_delete=true}" v-if="!item.default">
                  <v-list-item-title class="error--text">Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </popupquote>
          </template>
          <template v-slot:footer v-if="roles.length">
            <custom-footer-datatable :props="{pagination: pagination, options: options}"/>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog_delete" max-width="500">
      <v-card>
        <v-card-title>
          <div class="headline font-weight-bold font--text pb-4">
            Delete this Role
          </div>
        </v-card-title>
        <v-card-text class="pb-0">
          <p>All users will be set as the default role after deleted. Are you sure?</p>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn
                color="accent"
                block
                depressed
                height="50"
                @click="dialog_delete = false">
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="error"
                block
                height="50"
                depressed
                @click="() => {delete_role()}">
                Yes
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import { GODMODEMANAGEROLES } from "./namespace";
import { useNamespacedState, useNamespacedActions, useNamespacedMutations } from 'vuex-composition-helpers'

export default {
    name: "Roles",
    methods:{
      toCreate(){
        this.$router.push(`/manage-superadmin-roles/create`)
      }
    },
    setup(){
        const itemSelectedvalue = ref({})
        const dialog_delete = ref(false)
        const pagination = ref({})
        const options  = ref({})
        const headers = ref([
            {
                text: "Role Name",
                value: "name",
            },
            {
                text: "Type",
                value: "type",
            },
            {
                text: "Usages",
                value: "usages",
            },
            {
                text: "Description",
                value: "desc",
            },
            {
                text: "Create At",
                value: "created_at",
            },
            {
                text: "Action",
                value: "action",
            }
        ]);
        const search = ref("");
        const opendialogedituser = ref(false);

        const { getSuperAdminRole, deleteSuperAdminRole } = useNamespacedActions(GODMODEMANAGEROLES, [
          "getSuperAdminRole", "deleteSuperAdminRole"
        ]);

        const delete_role = async function(){
          let res = await deleteSuperAdminRole({id:itemSelectedvalue.value.id})
          dialog_delete.value = false
          if(res.status == 200){
            await getSuperAdminRole();
            let paginate = {
              itemsLength: roles_pagination.value.total_data,
              pageCount: roles_pagination.value.total_page,
              itemsPerPage: roles_pagination.value.limit,
              page: roles_pagination.value.page
            }
            pagination.value = paginate
            options.value = paginate
          }
        }

        const toDetail = function(item) {
          this.$router.push(`/manage-superadmin-roles/${item.id}`)
        };

        const { roles, roles_pagination } = useNamespacedState(GODMODEMANAGEROLES, ['roles', 'roles_pagination'])

        watch(() => options, async (newValue, oldValue) => {
            pagination.value = newValue.value
            let params = {
              limit:pagination.value.itemsPerPage,
              page: pagination.value.page
            }
            if (search.value){
              params.search = search.value
            }
            await getSuperAdminRole({
              params: params
            });
            let paginate = {
              itemsLength: roles_pagination.value.total_data,
              pageCount: roles_pagination.value.total_page,
              itemsPerPage: roles_pagination.value.limit,
              page: roles_pagination.value.page
            }
            pagination.value = paginate
          },
          { deep: true }
        )

        const doSearch = async function() {
            options.value = {
              itemsLength: roles_pagination.value.total_data,
              pageCount: roles_pagination.value.total_page,
              itemsPerPage: roles_pagination.value.limit,
              page: 1
            }
        }

        watch(() => search, async (newValue, oldValue) => {
          doSearch()
          },
          { deep: true }
        )

        onMounted(async ()  =>  {
          await getSuperAdminRole();
          let paginate = {
            itemsLength: roles_pagination.value.total_data,
            pageCount: roles_pagination.value.total_page,
            itemsPerPage: roles_pagination.value.limit,
            page: roles_pagination.value.page
          }
          pagination.value = paginate
          options.value = paginate
        })
        return {
            itemSelectedvalue,
            delete_role,
            dialog_delete,
            toDetail,
            doSearch,
            headers,
            roles,
            search,
            options,
            opendialogedituser,
            pagination
        }
    }
}
</script>


<style>
/* #my-table > div > table > tbody > tr{
  cursor: pointer;
} */
#my-table > div > table > tbody > tr:hover{
  background: #f0f5f5 !important;
}
</style>