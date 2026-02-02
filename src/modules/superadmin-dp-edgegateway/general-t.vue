<template>
  <div>
    <v-card class="rounded-lg" flat>
      <div class="d-flex justify-center" v-if="isLoading">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div>
      <v-container fluid v-else class="px-7 py-4">
        <br />
        <v-card class="rounded-lg mt-4 mb-4" flat>
          <div class="d-flex">
            <span class="primary--text fz-16 ml-4" style="cursor: pointer" @click="dialogEdit">
              EDIT
            </span>
            <span class="red--text fz-16 ml-4" style="cursor: pointer" @click="dialogDelete">
              DELETE
            </span>
          </div>
          <v-expansion-panels class="mt-3" v-model="panel">
            <v-expansion-panel>
              <v-expansion-panel-header color="#f1f2f2">General</v-expansion-panel-header>
              <div :style="hide == true ? '' : 'display: none'">
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Name </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ edgeGatewayById.name }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Status </v-expansion-panel-content>
                  </v-col>
                  <v-col md="6">
                    <v-expansion-panel-content> 
                      <v-icon :color="edgeGatewayById.status == 'REALIZED' ? 'green' : 'red'">
                        {{ edgeGatewayById.status == 'REALIZED' ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                      </v-icon> 
                      {{ edgeGatewayById.status == 'REALIZED' ? 'Normal' : edgeGatewayById.status }} 
                    </v-expansion-panel-content>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Description </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ edgeGatewayById.description ? edgeGatewayById.description : '-' }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Allow Non-Distributed Routing </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ edgeGatewayById.distributedRoutingEnabled ? 'Yes' : 'No' }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Type </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> NSX-T </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Connected </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ edgeGatewayById.edgeGatewayUplinks&&edgeGatewayById.edgeGatewayUplinks[0].connected ? 'Yes' : 'No' }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Using Dedicated Provider Router </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ edgeGatewayById.edgeGatewayUplinks&&edgeGatewayById.edgeGatewayUplinks[0].dedicated ? 'Yes' : 'No' }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>

              </div>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>

        <v-card class="rounded-lg mt-4 mb-4" flat>
          <v-expansion-panels v-model="panel1">
            <v-expansion-panel>
              <v-expansion-panel-header color="#f1f2f2">Scope</v-expansion-panel-header>
              <div :style="hide1 == true ? '' : 'display: none'">
                <v-row class="ma-0">
                  <v-col md="6">
                    <v-expansion-panel-content> Organization Virtual Data Center</v-expansion-panel-content>
                  </v-col>
                  <v-col md="6" >
                    <v-expansion-panel-content> 
                      <v-icon>
                        mdi-cloud-outline
                      </v-icon>
                      {{ orgVdc }} 
                    </v-expansion-panel-content>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6">
                    <v-expansion-panel-content> Organization </v-expansion-panel-content>
                  </v-col>
                  <v-col md="6">
                    <v-expansion-panel-content> {{ org }} </v-expansion-panel-content>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </div>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-container>
      <EditGeneralT
      v-if="openDialogEdit"
      v-model="openDialogEdit"
      :item="itemEdit"
      />

      <dialog-delete
      v-if="openDialogDelete"
      v-model="openDialogDelete"
      :item="itemEdit" />
    </v-card>
    </v-card>
  </div>
</template>

<script>
import { computed, onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { EDGEGATEWAY } from './namespace';
import EditGeneralT from './edit-general-t.vue';
import DialogDelete from './dialog-delete.vue'

export default {
  components:{
    EditGeneralT,
    DialogDelete
  },
  setup() {
    const { fetchEdgeGatewayByIdT } = useNamespacedActions(EDGEGATEWAY, ["fetchEdgeGatewayByIdT"])
    const { isLoading, edgeGatewayById  } = useNamespacedGetters(EDGEGATEWAY, ["isLoading", "edgeGatewayById"])

    onMounted(async() => {
      let detailEdge = JSON.parse(localStorage.getItem('detailEdge'))
      org.value = detailEdge.org
      orgVdc.value = detailEdge.orgVdc
      await fetchEdgeGatewayByIdT({id: detailEdge.id})
      // console.log(edgeGatewayById.value)
    })

    const org = ref()
    const orgVdc = ref()
    const panel = ref(0);
    const hide = computed(() => {
      return Number.isInteger(panel.value);
    });

    const panel1 = ref(0);
    const hide1 = computed(() => {
      return Number.isInteger(panel1.value);
    });

    const openDialogEdit = ref(false)
    const itemEdit = ref()
    const dialogEdit = () => {
      itemEdit.value = edgeGatewayById.value
      openDialogEdit.value = true
    }

    const openDialogDelete = ref(false)
    const dialogDelete = () => {
      itemEdit.value = edgeGatewayById.value
      openDialogDelete.value = true
    }
    return{
      panel,
      hide,
      panel1,
      hide1,
      isLoading,
      edgeGatewayById,
      org,
      orgVdc,
      dialogEdit,
      openDialogEdit,
      itemEdit,
      dialogDelete,
      openDialogDelete
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .v-expansion-panel-content__wrap {
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
}
::v-deep .v-application {
  line-height: 0;
}

.capital {
  text-transform: capitalize;
}
</style>