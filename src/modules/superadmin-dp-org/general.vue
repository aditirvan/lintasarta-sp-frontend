<template>
  <div>
    <v-card class="rounded-lg" flat>
      <div class="d-flex justify-center" v-if="isLoading">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div>
      <v-container fluid v-else class="px-7 py-0">
        <br />
        <v-card class="rounded-lg " flat>
          <div class="d-flex">
            <span class="primary--text fz-16 ml-4" style="cursor: pointer" @click="dialogEdit">
              EDIT
            </span>

            <span class="primary--text fz-16 ml-4" style="cursor: pointer" @click="dialogEnable">
              {{ orgById.isEnabled ? 'DISABLE' : 'ENABLE' }}
            </span>

            <span v-if="!orgById.isEnabled" class="red--text fz-16 ml-4" style="cursor: pointer" @click="dialogDelete">
              DELETE
            </span>
          </div>
          <v-expansion-panels class="mt-3" v-model="panel">
            <v-expansion-panel>
              <v-expansion-panel-header color="#f1f2f2">General</v-expansion-panel-header>
              <div :style="hide == true ? '' : 'display: none'">
                <v-row class="ma-0">
                  <v-col md="5"><v-expansion-panel-content> Organization Name </v-expansion-panel-content></v-col
                  ><v-col md="7"
                    ><v-expansion-panel-content> 
                      {{ orgById.name }} 
                      <p class="fz-12 mb-0">The unique identifier in the full URL with which users log in to this organization.</p>
                    </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <!-- <v-row class="ma-0">
                  <v-col md="7"><v-expansion-panel-content> Default organization URL </v-expansion-panel-content></v-col
                  ><v-col md="7"
                    ><v-expansion-panel-content> {{  }}  </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider> -->
                <v-row class="ma-0">
                  <v-col md="5"><v-expansion-panel-content> Organization fullname </v-expansion-panel-content></v-col
                  ><v-col md="7"
                    ><v-expansion-panel-content> 
                      {{ orgById.displayName }} 
                      <p class="fz-12 mb-0">Appear in the Cloud application as a human-readable name of the organization.</p>
                    </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="5"><v-expansion-panel-content> State </v-expansion-panel-content></v-col
                  ><v-col md="7"
                    ><v-expansion-panel-content>
                      
                      {{ orgById.isEnabled ? 'Enabled' :'Disabled' }}
                    </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-0">
                  <v-col md="5"><v-expansion-panel-content> Description </v-expansion-panel-content></v-col
                  ><v-col md="7"
                    ><v-expansion-panel-content> {{ orgById.description }} </v-expansion-panel-content></v-col
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
              <v-expansion-panel-header color="#f1f2f2">Other</v-expansion-panel-header>
              <div :style="hide1 == true ? '' : 'display: none'">
                <v-row class="ma-0">
                  <v-col md="5"><v-expansion-panel-content> VM Discovery </v-expansion-panel-content></v-col
                  ><v-col md="7"
                    ><v-expansion-panel-content> Default </v-expansion-panel-content></v-col
                  >
                </v-row>
                <v-divider></v-divider>
              </div>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-container>
      <dialog-create
      v-if="openDialogEdit"
      v-model="openDialogEdit"
      :item="itemEdit" />

      <dialog-enable
      v-if="openDialogEnable"
      v-model="openDialogEnable"
      :item="itemEdit"
      @refreshPage="refreshPage" 
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
import { ORGDP } from './namespace';
import DialogCreate from './dialog-create.vue'
import DialogEnable from './dialog-enable.vue'
import DialogDelete from './dialog-delete.vue'

export default {
  components: {
    DialogCreate,
    DialogEnable,
    DialogDelete
  },
  setup() {
    const { fetchOrgDPById } = useNamespacedActions(ORGDP, ["fetchOrgDPById"])
    const { isLoading, orgById  } = useNamespacedGetters(ORGDP, ["isLoading", "orgById"])

    onMounted(async() => {
      let detailOrg = JSON.parse(localStorage.getItem('detailOrg'))
      await fetchOrgDPById({id: detailOrg?.id})
      console.log(orgById.value)
    })

    const loading = ref(false)
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
      itemEdit.value = orgById.value
      openDialogEdit.value = true
    }

    const openDialogEnable = ref(false)
    const dialogEnable = () => {
      itemEdit.value = orgById.value
      openDialogEnable.value = true
    }

    const openDialogDelete = ref(false)
    const dialogDelete = () => {
      itemEdit.value = orgById.value
      openDialogDelete.value = true
    }

    const refreshPage = async() => {
      let detailOrg = JSON.parse(localStorage.getItem('detailOrg'))
      await fetchOrgDPById({id: detailOrg?.id})
    }

    return{
      panel,
      hide,
      panel1,
      hide1,
      loading,
      isLoading,
      orgById,
      dialogEdit,
      openDialogEdit,
      itemEdit,
      openDialogEnable,
      dialogEnable,
      dialogDelete,
      openDialogDelete,
      refreshPage,
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