<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-col cols="9" class="pb-0">
            <div class="firewall-title ml-5">IP Set</div>
          </v-col>
          <v-row class="ml-2 mr-4">
            <v-spacer></v-spacer>
            <v-col cols="3" class="mt-4">
              <v-btn
                block
                color="secondary"
                outlined
                dark
                @click="
                  () => {
                    openDialogAdd = true
                    title = 'Add'
                  }
                "
                > <v-icon small>mdi-plus</v-icon>&nbsp; New</v-btn
              >
            </v-col>
          </v-row>
          <!-- <v-col cols="6" class="pt-0 pb-0 mb-4">
            <v-row class="ml-2" >
              <v-col v-if="!read_only" class="d-flex align-items-center">Show only user-defined rules</v-col>
              <v-col v-if="!read_only" class="d-flex"><v-switch></v-switch></v-col>
            </v-row>
          </v-col> -->
          <v-container fluid class="px-7 pt-0"
            ><v-data-table
              :headers="headers"
              :items="listIpset"
              :options.sync="options"
              :items-per-page="10"
              :server-items-length="rowsIpset"
              item-key="no"
              single-line
              class="elevation-0"
              :loading="isLoadingIpset"
              hide-default-footer
              disable-pagination
            >
            <template v-slot:item.action="{ item }">
              <v-card class="scroll" style="">
                <v-row>
                  <v-col class="pt-3 pr-0"
                    ><v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon small v-bind="attrs" v-on="on">
                          <v-icon
                          color="primary"
                          small
                          @click="() => {
                            row = item
                            openDialogAdd = true
                            title = 'Edit'
                          }">
                            mdi-square-edit-outline
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Update</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          small
                          v-bind="attrs"
                          v-on="on"
                          @click="
                            () => {
                              openDialogDelete = true
                              row = item
                            }
                          "
                          ><v-icon color="red" small>mdi-trash-can-outline</v-icon></v-btn
                        >
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <template v-slot:footer="{ props }">
              <custom-footer-datatable
              @input="
              (val) => {
                options = val ;
              }
              "
              :props="props"/>
            </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <dialogAddIpset
    v-if="openDialogAdd"
    v-model="openDialogAdd"
    :title="title"
    :rowSelected="row"
    @refreshTab="refreshTab"
    />
    <dialogDeleteIpset
    v-if="openDialogDelete"
    v-model="openDialogDelete"
    :rowSelected="row"
    @refreshTab="refreshTab"
    />
  </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { DPSECURITY } from '../namespace';
import dialogAddIpset from './ipset/dialog-add-ipset.vue';
import dialogDeleteIpset from './ipset/dialog-delete-ipset.vue';

export default {
  components: {
    dialogAddIpset,
    dialogDeleteIpset
  },
  setup(props, context) {
    const { fetchIpset } = useNamespacedActions(DPSECURITY, ["fetchIpset"])
    const { listIpset, rowsIpset, isLoadingIpset } = useNamespacedGetters(DPSECURITY, ["listIpset", "rowsIpset", "isLoadingIpset"])
    const headers = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Description", value: "description", sortable: false },
      { text: "Action", value: "action", sortable: false },
      
    ]);

    const options = ref({
      page: 1,
      itemsPerPage: 10,
      idEdge: context.root.$route.params.idEdge
    })
    watch(options,async (val) => {
      try {
          await fetchIpset(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    const row = ref()
    const title = ref('')
    const openDialogAdd = ref(false)
    const openDialogDelete = ref(false)

    onMounted(async() => {

      await fetchIpset(options.value)
    })

    const refreshTab = async() => {
      options.value.page = 1
      options.value.itemsPerPage = 10
      await fetchIpset(options.value)
    }
    return{
      headers,
      options,
      rowsIpset,
      isLoadingIpset,
      listIpset,
      row,
      title,
      openDialogAdd,
      openDialogDelete,
      refreshTab,
    }
  },
}
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center !important;
}
.scroll {
  height: 65px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: hidden;
  background-color: transparent;
}
</style>