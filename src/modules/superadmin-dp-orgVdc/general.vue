<template>
  <div>
    <v-card class="rounded-lg" flat>
      <div class="d-flex justify-center" v-if="isLoading">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div>
      <v-container fluid v-else class="px-7 py-0">
        <br />
        <v-card class="rounded-lg mt-4 mb-4" flat>
          <div class="d-flex">
            <span class="primary--text fz-16 ml-4" style="cursor: pointer" @click="dialogEdit">
              EDIT
            </span>

            <span class="primary--text fz-16 ml-4" style="cursor: pointer" @click="dialogEnable">
              {{ orgVdcById.isEnabled ? 'DISABLE' : 'ENABLE' }}
            </span>

            <span v-if="!orgVdcById.isEnabled" class="red--text fz-16 ml-4" style="cursor: pointer" @click="dialogDelete">
              DELETE
            </span>
          </div>
          <v-expansion-panels class="mt-3" v-model="panel" multiple>
            <v-expansion-panel>
              <v-expansion-panel-header color="#f1f2f2">Info</v-expansion-panel-header>
              <div :style="panel.includes(0) ? '' : 'display: none'">
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Name </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ orgVdcById.name }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Description </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ orgVdcById.description ? orgVdcById.description : '-' }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Status </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content>
                      {{ orgVdcById.status == 1 ? 'Ready' : 'Not Ready' }}
                    </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> State </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ orgVdcById.isEnabled ? 'Enabled' : 'Disabled' }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
              </div>
            </v-expansion-panel>
            <v-expansion-panel class="mt-0">
              <v-expansion-panel-header color="#f1f2f2">Metrics</v-expansion-panel-header>
              <div :style="panel.includes(1) ? '' : 'display: none'">
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> CPU (Allocated Used/Quota) </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ `${(cpuUsed/1000)} GHz / ${(cpuLimit/1000)} GHz (${(Math.ceil((cpuUsed/cpuLimit)*100))}%)` }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> Memory (Allocated Used/Quota) </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> {{ `${(memoryUsed/1000)} GHz / ${(memoryLimit/1000)} GHz (${(Math.ceil((memoryUsed/memoryLimit)*100))}%) ` }} </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
              </div>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>

        <v-card class="rounded-lg mt-4 mb-4" flat>
          <v-expansion-panels v-model="panel1" multiple>
            <v-expansion-panel>
              <v-expansion-panel-header color="#f1f2f2">Other</v-expansion-panel-header>
              <div :style="panel1.includes(0) ? '' : 'display: none'">
                <v-row class="ma-0">
                  <v-col md="6"><v-expansion-panel-content> VM Discovery </v-expansion-panel-content></v-col
                  ><v-col md="6"
                    ><v-expansion-panel-content> Default </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
              </div>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-container>
      <dialog-edit
      v-if="openDialogEdit"
      v-model="openDialogEdit"
      :item="itemEdit"
      />

      <dialog-enable
      v-if="openDialogEnable"
      v-model="openDialogEnable"
      :item="itemEdit"
      @refreshPage="refreshPage" />

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
import { ORGVDC } from './namespace';
import DialogEdit from './dialog-edit-general.vue'
import DialogEnable from './dialog-enable.vue'
import DialogDelete from './dialog-delete.vue'

export default {
  components: {
    DialogEdit,
    DialogEnable,
    DialogDelete
  },
  setup() {
    const { fetchOrgVdcById } = useNamespacedActions(ORGVDC, ["fetchOrgVdcById"])
    const { isLoading, orgVdcById  } = useNamespacedGetters(ORGVDC, ["isLoading", "orgVdcById"])

    onMounted(async() => {
      let detailOrg = JSON.parse(localStorage.getItem('detailOrgVdc'))
      await fetchOrgVdcById({id: detailOrg.id})
      console.log(orgVdcById.value)
    })

    const refreshPage = async() => {
      let detailOrg = JSON.parse(localStorage.getItem('detailOrgVdc'))
      await fetchOrgVdcById({id: detailOrg.id})
    }

    const loading = ref(false)
    const panel = ref([0,1]);
    const panel1 = ref([0]);

    const openDialogEdit = ref(false)
    const itemEdit = ref()
    const dialogEdit = () => {
      itemEdit.value = orgVdcById.value
      openDialogEdit.value = true
    }

    const openDialogEnable = ref(false)
    const dialogEnable = () => {
      itemEdit.value = orgVdcById.value
      openDialogEnable.value = true
    }

    const openDialogDelete = ref(false)
    const dialogDelete = () => {
      itemEdit.value = orgVdcById.value
      openDialogDelete.value = true
    }

    const cpuUsed = computed(() => {
      return orgVdcById.value?.computeCapacity?.cpu?.used
    })
    const cpuLimit = computed(() => {
      return orgVdcById.value?.computeCapacity?.cpu?.limit
    })
    const memoryUsed = computed(() => {
      return orgVdcById.value?.computeCapacity?.memory?.used
    })
    const memoryLimit = computed(() => {
      return orgVdcById.value?.computeCapacity?.memory?.limit
    })
    return{
      panel,
      panel1,
      loading,
      isLoading,
      orgVdcById,
      dialogEdit,
      openDialogEdit,
      itemEdit,
      openDialogEnable,
      dialogEnable,
      openDialogDelete,
      dialogDelete,
      cpuUsed,
      cpuLimit,
      memoryUsed,
      memoryLimit,
      refreshPage
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