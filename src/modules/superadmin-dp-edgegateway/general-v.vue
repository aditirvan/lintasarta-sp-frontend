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
            <span v-if="edgeGatewayById.status == 1" class="primary--text fz-16 ml-4" style="cursor: pointer" @click="dialogEdit">
              EDIT
            </span>
            <span v-else class="grey--text fz-16 ml-4" >
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
                  <v-col md="6">
                    <v-expansion-panel-content> Name </v-expansion-panel-content>
                  </v-col>
                  <v-col md="6">
                    <v-expansion-panel-content> {{ edgeGatewayById.name }} </v-expansion-panel-content>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6">
                    <v-expansion-panel-content> Description </v-expansion-panel-content>
                  </v-col>
                  <v-col md="6">
                    <v-expansion-panel-content> {{ edgeGatewayById.description ? edgeGatewayById.description : '-' }} </v-expansion-panel-content>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6">
                    <v-expansion-panel-content> Status </v-expansion-panel-content>
                  </v-col>
                  <v-col md="6">
                    <v-expansion-panel-content> 
                      <v-icon :color="edgeGatewayById.status == 1 ? 'green' : 'red'">
                        {{ edgeGatewayById.status == 1 ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                      </v-icon> 
                      {{ edgeGatewayById.status == 1 ? 'Normal' : 'Failed' }} 
                    </v-expansion-panel-content>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6">
                    <v-expansion-panel-content> Distributed Routing </v-expansion-panel-content>
                  </v-col>
                  <v-col md="6">
                    <v-expansion-panel-content> {{ edgeGatewayById.configuration&&edgeGatewayById.configuration.distributedRoutingEnabled ? 'Enabled' : 'Disabled' }} </v-expansion-panel-content>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6">
                    <v-expansion-panel-content> FIPS Mode </v-expansion-panel-content>
                  </v-col>
                  <v-col md="6">
                    <v-expansion-panel-content> {{ edgeGatewayById.configuration&&edgeGatewayById.configuration.fipsModeEnabled ? 'Enabled' : 'Disabled' }} </v-expansion-panel-content>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6">
                    <v-expansion-panel-content> Edge Gateway Configuration </v-expansion-panel-content>
                  </v-col>
                  <v-col md="6">
                    <v-expansion-panel-content> {{ edgeGatewayById.configuration&&edgeGatewayById.configuration.gatewayBackingConfig }} </v-expansion-panel-content>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6">
                    <v-expansion-panel-content> High Availability </v-expansion-panel-content>
                    </v-col>
                  <v-col md="6">
                    <v-expansion-panel-content> {{ edgeGatewayById.configuration&&edgeGatewayById.configuration.haEnabled ? 'Enabled' : 'Disabled' }} </v-expansion-panel-content>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6">
                    <v-expansion-panel-content> Syslog Server Settings </v-expansion-panel-content>
                  </v-col>
                  <v-col md="6">
                    <v-expansion-panel-content> {{ syslogIp }} </v-expansion-panel-content>
                  </v-col>
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
      <EditGeneralV
      v-if="openDialogEdit"
      v-model="openDialogEdit"
      :item="itemEdit"
      />

      <dialog-delete
      v-if="openDialogDelete"
      v-model="openDialogDelete"
      :item="itemEdit" />
    </v-card>
  </div>
</template>

<script>
import { computed, onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { EDGEGATEWAY } from './namespace';
import EditGeneralV from './edit-general-v.vue'
import DialogDelete from './dialog-delete.vue'

export default {
  components: {
    EditGeneralV,
    DialogDelete
  },
  setup() {
    const { fetchEdgeGatewayByIdV } = useNamespacedActions(EDGEGATEWAY, ["fetchEdgeGatewayByIdV"])
    const { isLoading, edgeGatewayById  } = useNamespacedGetters(EDGEGATEWAY, ["isLoading", "edgeGatewayById"])

    onMounted(async() => {
      let detailEdge = JSON.parse(localStorage.getItem('detailEdge'))
      type.value = detailEdge.type
      org.value = detailEdge.org
      orgVdc.value = detailEdge.orgVdc
      await fetchEdgeGatewayByIdV({id: detailEdge.id})
      console.log(edgeGatewayById.value)
    })

    const type = ref()
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

    const syslogIp = computed(() => {
      let syslog = edgeGatewayById.value?.configuration?.syslogServerSettings?.tenantSyslogServerSettings?.syslogServerIp
      let val = syslog?.length ? syslog[0] : '-'
      return val
    })
    return{
      panel,
      hide,
      panel1,
      hide1,
      isLoading,
      edgeGatewayById,
      type,
      org,
      orgVdc,
      dialogEdit,
      openDialogEdit,
      itemEdit,
      dialogDelete,
      openDialogDelete,
      syslogIp
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