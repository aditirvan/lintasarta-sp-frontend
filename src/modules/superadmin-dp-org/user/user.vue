<template>
  <div>
    <v-card class="rounded-lg" flat>
      <!-- <div class="d-flex justify-center" v-if="isLoading">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div> -->
      <v-container fluid class="px-7 py-0">
        <v-row>
          <v-col cols="12" class="d-flex">
            <div class="firewall-title mt-2">Users Dekaprime</div>
            <v-spacer></v-spacer>
          <!-- </v-col>
          <v-col cols="3" class="text-right"> -->
            <v-text-field
            maxlength="50"
            class="search mr-2"
            placeholder="Search"
            outlined
            hide-details
            style="max-width: 200px;"
            v-model="searchUser"
            clearable
            ></v-text-field>

            <v-btn
            link
            style="height: 45px; width: 150px; font-size: 12px"
            class="secondary mt-1"
            depressed
            @click="() =>{
              openDialogCreate = true
            }"
            >
              New
            </v-btn>
          </v-col>
        </v-row>
        <v-card class="rounded-lg " flat>
          
          <v-data-table
          :headers="headersTable"
          :options.sync="options"
          :items="listUsers"
          :items-per-page="10"
          :server-items-length="TRUsers"
          :loading="isLoading"
          class="elevation-0"
          hide-default-footer
          > 
            <template v-slot:item.name="{ item }">
                <span class="primary--text" style="cursor:pointer" @click="detailUser(item)">
                  {{ item.name }}
                </span>
              </template>

            <template v-slot:item.fullName="{ item }">
              {{ item.fullName ? item.fullName : '-' }}
            </template>
            
            <template v-slot:item.isEnabled="{ item }">
              {{ item.isEnabled ? 'Enabled' : 'Disabled' }}
            </template>

            <template v-slot:item.type="{ item }">
              {{ item.type ? item.type  : '-' }}
            </template>

            <template v-slot:item.isLocked="{ item }">
              <v-icon color="grey">
                {{ item.isLocked ? 'mdi-lock-outline' : 'mdi-lock-open-outline' }}
              </v-icon>
            </template>

            <template v-slot:footer="{ props }">
                <custom-footer-datatable
                @input="
                  (val) => {
                    changePage(val)
                  }
                " 
                :props="props" />
              </template>
          </v-data-table>

        </v-card>
      </v-container>
      
      <DialogCreate
      v-if="openDialogCreate"
      v-model="openDialogCreate"
      @refreshPage="refreshPage"
      />
    </v-card>
  </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'
import { ORGDP } from '../namespace'
import DialogCreate from './dialog-create.vue'

export default {
  components: {
    DialogCreate
  },
  setup(props, context) {
    const { fetchUsers } = useNamespacedActions(ORGDP, ["fetchUsers"])
    const { TRUsers, listUsers, isLoading  } = useNamespacedGetters(ORGDP, ["TRUsers", "listUsers", "isLoading"])
    
    onMounted(async() => {
      // detailOrg.value = JSON.parse(localStorage.getItem('detailOrg'))
      detailOrg.value = JSON.parse(localStorage.getItem('orgDP'))
      options.value.idOrg = detailOrg.value.id
      
      await fetchUsers(options.value)
    })

    const openDialogCreate = ref(false)
    const detailOrg = ref()

    const headersTable = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Full Name", value: "fullName", sortable: false },
      // { text: "Flavor", value: "master",  },
      { text: "State", value: "isEnabled", sortable: false },
      { text: "Locked", value: "isLocked", sortable: false },
      { text: "Role", value: "roleNames", sortable: false },
      { text: "Type", value: "type", sortable: false },

    ])
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      // projek: currentProj.openstack_project_id
    })

    const searchUser = ref("")
    let search = null;
    watch(searchUser, (val) => {
      if (search) {
          clearTimeout(search);
          search = setTimeout(async function() {
          // let detailOrg = JSON.parse(localStorage.getItem('detailOrg'))
          options.value = { ...options.value, page: 1, idOrg: detailOrg.value.id, search: val };
          await fetchUsers(options.value)
          }, 1000);
      } else {
          search = setTimeout(function() {}, 1000);
      }
    });
    
    const changePage = async() => {
      // let detailOrg = JSON.parse(localStorage.getItem('detailOrg'))
      options.value = { ...options.value, idOrg: detailOrg.value.id }
      await fetchUsers(options.value)
    }

    const splitIUserId = (data) => {
      let href = data
      let replaceHref = href.replace("https://", '')
      let splitHref = replaceHref.split("/")
      // let providerId = splitHref[4]
      return splitHref[4]
    }

    const detailUser = (item) => {
      console.log(item)
      localStorage.setItem('detailUserDP', JSON.stringify({name: item.name, id: splitIUserId(item.href)}))
      context.root.$router.push(`/organization-detail/${context.root.$route.params.organizationid}/detail-userdp`)
    }

    const refreshPage = async() => {
      detailOrg.value = JSON.parse(localStorage.getItem('orgDP'))
      // options.value.idOrg = detailOrg.value.id
      await fetchUsers({...options.value, page: 1, id: detailOrg.value.id})
    }
    return{
      headersTable,
      options,
      listUsers,
      TRUsers,
      isLoading,
      changePage,
      detailUser,
      searchUser,
      openDialogCreate,
      refreshPage
    }
  },
}
</script>